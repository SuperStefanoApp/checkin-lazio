import express from "express";
import Database from "better-sqlite3";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database(process.env.DB_PATH || path.join(__dirname, "data", "checkin.db"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS stays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  arrival TEXT NOT NULL,
  nights INTEGER NOT NULL,
  departure TEXT NOT NULL,
  guests_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stay_id INTEGER NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL
);
`);

app.use(express.json({limit:"10mb"}));
app.use(express.static(path.join(__dirname,"public")));

function auth(req,res,next){
  const publicUrl = req.originalUrl.split("?")[0];
  if(publicUrl === "/api/health" || publicUrl === "/api/login") return next();
  const h = req.headers.authorization || "";
  if(!h.startsWith("Bearer ")) return res.status(401).json({error:"AUTH_REQUIRED"});
  const token = h.slice(7);
  if(!process.env.SESSION_SECRET || !token) return res.status(401).json({error:"AUTH_REQUIRED"});
  try {
    const [a,b] = token.split(".");
    const expected = crypto.createHmac("sha256", process.env.SESSION_SECRET).update(a).digest("hex");
    if(!b || !crypto.timingSafeEqual(Buffer.from(b),Buffer.from(expected))) throw new Error();
    req.user = a; next();
  } catch { return res.status(401).json({error:"AUTH_INVALID"}); }
}
app.use("/api", auth);

app.get("/api/health",(req,res)=>res.json({ok:true,service:"checkin-lazio",time:new Date().toISOString()}));

// Elenco Stati/Nazioni ufficiale Alloggiati Web.
// Viene ricavato dalla tabella "Luoghi" del Web Service della Polizia di Stato,
// così l'app non incorpora una lista statica che potrebbe diventare obsoleta.
let nazioniCache={time:0,items:[]};
app.get("/api/nazioni",async(req,res)=>{
  if(nazioniCache.items.length && Date.now()-nazioniCache.time<6*60*60*1000) return res.json({ok:true,items:nazioniCache.items});
  try{
    const token=await alloggiatiGenerateToken();
    const csv=await alloggiatiTable(token,"Luoghi");
    const items=[];
    const seen=new Set();
    for(const row of csvRows(csv).slice(1)){
      const cells=row.map(x=>String(x||"").trim());
      const code=cells.find(x=>/^(100000|100001|110000)\d{3}$/.test(x))||"";
      if(!code) continue;
      const name=cells.find(x=>x && x!==code && !/^[-0-9]+$/.test(x))||"";
      if(!name) continue;
      const key=code+"|"+norm(name);
      if(seen.has(key)) continue;
      seen.add(key);
      items.push({code,name});
    }
    items.sort((a,b)=>norm(a.name).localeCompare(norm(b.name),"it"));
    if(!items.length) throw new Error("Tabella Stati/Nazioni vuota o non riconosciuta");
    nazioniCache={time:Date.now(),items};
    return res.json({ok:true,items});
  }catch(e){
    return res.status(502).json({ok:false,error:"TABELLA_NAZIONI_NON_DISPONIBILE",detail:String(e.message||e)});
  }
});

// Ricerca comuni italiani: proxy server-side verso un dataset aggiornato derivato da ISTAT.
// Il frontend non contatta direttamente servizi esterni e riceve solo i campi necessari.
const comuniCache = new Map();
app.get("/api/comuni",async(req,res)=>{
  const q=String(req.query.q||"").trim();
  if(q.length<2) return res.json({ok:true,items:[]});
  const key=q.toLocaleLowerCase("it-IT");
  const cached=comuniCache.get(key);
  if(cached && (Date.now()-cached.time)<10*60*1000) return res.json({ok:true,items:cached.items});
  try{
    const url=`https://comuni-ita.nicolorebaioli.dev/v5/comuni?q=${encodeURIComponent(q)}&sort=nome&fields=nome,codice,sigla&pagesize=12`;
    const r=await fetch(url,{headers:{Accept:"application/json","User-Agent":"CheckIn-Lazio/1.0"}});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const data=await r.json();
    const raw=Array.isArray(data)?data:(Array.isArray(data?.data)?data.data:(Array.isArray(data?.items)?data.items:[]));
    const items=raw.map(x=>({nome:String(x.nome||x.name||"").trim(),sigla:String(x.sigla||x.provincia?.sigla||"").trim().toUpperCase(),codice:String(x.codice||x.istat||"").trim()})).filter(x=>x.nome);
    comuniCache.set(key,{time:Date.now(),items});
    return res.json({ok:true,items});
  }catch(e){
    return res.status(502).json({ok:false,error:"RICERCA_COMUNI_NON_DISPONIBILE",detail:String(e.message||e)});
  }
});
app.post("/api/login",(req,res)=>{
  const {username,password}=req.body||{};
  if(username===process.env.ADMIN_USER && password===process.env.ADMIN_PASSWORD){
    const a=crypto.randomUUID();
    const b=crypto.createHmac("sha256",process.env.SESSION_SECRET).update(a).digest("hex");
    return res.json({ok:true,token:`${a}.${b}`});
  }
  res.status(401).json({ok:false,error:"Credenziali non valide"});
});

app.post("/api/stays",(req,res)=>{
  const {arrival,nights,departure,guests}=req.body||{};
  if(!arrival||!departure||!Number.isInteger(Number(nights))||Number(nights)<1||Number(nights)>30||!Array.isArray(guests)||guests.length<1)
    return res.status(400).json({error:"DATI_INCOMPLETI_O_NUOVI_LIMITI"});
  const info=db.prepare("INSERT INTO stays(arrival,nights,departure,guests_json,created_at) VALUES(?,?,?,?,?)")
    .run(arrival,Number(nights),departure,JSON.stringify(guests),new Date().toISOString());
  res.json({ok:true,id:info.lastInsertRowid});
});
app.get("/api/stays",(req,res)=>{
  const rows=db.prepare("SELECT * FROM stays ORDER BY id DESC LIMIT 100").all();
  res.json(rows.map(r=>({...r,guests:JSON.parse(r.guests_json)})));
});
app.get("/api/submissions",(req,res)=>res.json(db.prepare("SELECT * FROM submissions ORDER BY id DESC LIMIT 200").all()));

function xmlEscape(s=""){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}
function tag(text,name){const re=new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`,`i`);return (text.match(re)||[])[1]||"";}
function allTags(text,name){const re=new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`,`gi`);return [...text.matchAll(re)].map(m=>m[1]);}
function isoToDMY(v){const [y,m,d]=String(v||"").split("-");return y&&m&&d?`${d}/${m}/${y}`:"";}
function yyyymmdd(v){const [y,m,d]=String(v||"").split("-");return y&&m&&d?`${y}${m}${d}`:"";}
function norm(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]+/g," ").trim();}

async function soapCall(action, body){
  const endpoint="https://alloggiatiweb.poliziadistato.it/service/Service.asmx";
  const envelope=`<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:all="AlloggiatiService"><soap:Header/><soap:Body>${body}</soap:Body></soap:Envelope>`;
  const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/soap+xml; charset=utf-8","SOAPAction":`AlloggiatiService/${action}`},body:envelope});
  const text=await r.text();
  if(!r.ok) throw new Error(`Alloggiati HTTP ${r.status}: ${text.slice(0,500)}`);
  return text;
}
async function alloggiatiGenerateToken(){
  if(!process.env.ALLOGGIATI_USER||!process.env.ALLOGGIATI_PASSWORD||!process.env.ALLOGGIATI_WSKEY) throw new Error("Credenziali Alloggiati non configurate");
  const text=await soapCall("GenerateToken",`<all:GenerateToken><all:Utente>${xmlEscape(process.env.ALLOGGIATI_USER)}</all:Utente><all:Password>${xmlEscape(process.env.ALLOGGIATI_PASSWORD)}</all:Password><all:WsKey>${xmlEscape(process.env.ALLOGGIATI_WSKEY)}</all:WsKey></all:GenerateToken>`);
  const token=tag(text,"token");
  if(!token) throw new Error(tag(text,"ErroreDettaglio")||tag(text,"ErroreDes")||"GenerateToken non ha restituito un token");
  return token;
}
async function alloggiatiTable(token,tipo){
  const text=await soapCall("Tabella",`<all:Tabella><all:Utente>${xmlEscape(process.env.ALLOGGIATI_USER)}</all:Utente><all:token>${xmlEscape(token)}</all:token><all:tipo>${tipo}</all:tipo></all:Tabella>`);
  const csv=tag(text,"CSV");
  if(!csv) throw new Error(`Tabella ${tipo} non disponibile: ${tag(text,"ErroreDettaglio")||tag(text,"ErroreDes")||"errore sconosciuto"}`);
  return csv;
}
function csvRows(csv){return String(csv||"").trim().split(/\r?\n/).map(line=>line.split(";"));}
function findCode(csv, wanted){
  const w=norm(wanted);
  if(!w) return "";
  for(const row of csvRows(csv).slice(1)){
    if(row.some(cell=>norm(cell)===w)) return String(row[0]||"").trim();
  }
  for(const row of csvRows(csv).slice(1)){
    if(row.some(cell=>norm(cell).includes(w))) return String(row[0]||"").trim();
  }
  return "";
}
function findDocCode(csv, wanted){
  const w=norm(wanted);
  if(!w) return "";
  const aliases={
    "CARTA IDENTITA":"CARTA IDENTITA",
    "CARTA D IDENTITA":"CARTA IDENTITA",
    "CARTA IDENTITA ELETTRONICA":"CARTA IDENTITA ELETTRONICA",
    "PASSAPORTO":"PASSAPORTO"
  };
  const target=aliases[w]||w;
  for(const row of csvRows(csv).slice(1)){
    if(row.slice(1).some(cell=>norm(cell)===target)) return String(row[0]||"").trim();
  }
  for(const row of csvRows(csv).slice(1)){
    if(row.slice(1).some(cell=>norm(cell).includes(target))) return String(row[0]||"").trim();
  }
  return "";
}
function fixed(v,n){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Za-z0-9 /'\-]/g,"").slice(0,n).padEnd(n," ");}

async function buildAlloggiatiRecords(stay){
  const token=await alloggiatiGenerateToken();
  const luoghi=await alloggiatiTable(token,"Luoghi");
  const docs=await alloggiatiTable(token,"Tipi_Documento");
  const types=await alloggiatiTable(token,"Tipi_Alloggiato");
  const typeCodes={
    ospite_singolo: findCode(types,"Ospite Singolo")||"16",
    capo_famiglia: findCode(types,"Capo Famiglia")||"17",
    capo_gruppo: findCode(types,"Capo Gruppo")||"18",
    familiare: findCode(types,"Familiare")||"19",
    membro_gruppo: findCode(types,"Membro Gruppo")||"20"
  };
  const records=[];
  const problems=[];
  for(let i=0;i<stay.guests.length;i++){
    const g={...(stay.guests[i]||{})};
    const guestType=String(g.tipologia||"ospite_singolo");
    const typeCode=typeCodes[guestType]||typeCodes.ospite_singolo;
    const isComponent=guestType==="familiare"||guestType==="membro_gruppo";
    // Per i cittadini stranieri Alloggiati richiede il Paese sia come stato
    // di nascita sia come luogo/stato di rilascio. Se l'interfaccia ha
    // compilato il campo automaticamente ma il browser non lo ha trasmesso,
    // lo ricaviamo comunque dalla cittadinanza prima della validazione.
    const foreign=!isItalianCountry(g.cittadinanza);
    if(foreign){
      if(!String(g.luogo_nascita||'').trim()) g.luogo_nascita=countryToFull(g.cittadinanza);
      if(!String(g.luogo_rilascio_documento||'').trim()) g.luogo_rilascio_documento=countryToFull(g.cittadinanza);
      if(!String(g.stato_nascita||'').trim()) g.stato_nascita=countryToFull(g.cittadinanza);
      if(!String(g.stato_documento||'').trim()) g.stato_documento=countryToFull(g.cittadinanza);
    }
    const birthState=countryToFull(g.stato_nascita||g.stato_documento||g.cittadinanza);
    const birthStateCode=String(g.stato_nascita_code||g.cittadinanza_code||"").trim()||findCode(luoghi,birthState||g.cittadinanza);
    const nationalityCode=String(g.cittadinanza_code||"").trim()||findCode(luoghi,g.cittadinanza);
    const birthPlaceCode=findCode(luoghi,g.luogo_nascita);
    const docCode=isComponent?"":findDocCode(docs,g.tipo_documento||"Carta identità");
    const releaseCode=isComponent?"":String(g.stato_documento_code||g.cittadinanza_code||"").trim()||findCode(luoghi,g.stato_documento||g.luogo_rilascio||g.cittadinanza);
    const numeroDocumento=isComponent?"":g.numero_documento;
    const sesso=g.sesso==="M"?"1":g.sesso==="F"?"2":"";
    if(!g.cognome||!g.nome||!g.nascita||!sesso||!nationalityCode||!birthStateCode || (!isComponent && (!docCode||!numeroDocumento||!releaseCode))){
      problems.push(`Ospite ${i+1}: dati/codici mancanti (controlla nascita, cittadinanza, sesso${isComponent?"":" , documento e luogo rilascio"}).`); continue;
    }
    if(birthStateCode==="100000100"&&!birthPlaceCode) problems.push(`Ospite ${i+1}: luogo di nascita "${g.luogo_nascita}" non trovato nella tabella Alloggiati.`);
    const line = fixed(typeCode,2)+fixed(isoToDMY(stay.arrival),10)+fixed(String(stay.nights).padStart(2,"0"),2)+fixed(g.cognome,50)+fixed(g.nome,30)+fixed(sesso,1)+fixed(isoToDMY(g.nascita),10)+fixed(birthStateCode==="100000100"?birthPlaceCode:"",9)+fixed(birthStateCode==="100000100"?(g.provincia_nascita||""):"",2)+fixed(birthStateCode,9)+fixed(nationalityCode,9)+fixed(docCode,5)+fixed(numeroDocumento,20)+fixed(releaseCode,9);
    if(line.length!==168) problems.push(`Ospite ${i+1}: record generato di ${line.length} caratteri invece di 168.`); else records.push(line);
  }
  if(problems.length) throw new Error(problems.join(" | "));
  return {token,records};
}
function isItalianCountry(v){
  const n=norm(v);
  return n==="ITALIA"||n==="ITALY"||n==="ITA";
}
function countryToFull(v){
  const m={ITA:"Italia",Italy:"Italia",Italia:"Italia",FRA:"Francia",France:"Francia",DEU:"Germania",Germany:"Germania",ESP:"Spagna",Spain:"Spagna",GBR:"Regno Unito",UK:"Regno Unito",USA:"Stati Uniti",US:"Stati Uniti",CHE:"Svizzera",Switzerland:"Svizzera",AUT:"Austria",NLD:"Paesi Bassi",BEL:"Belgio",PRT:"Portogallo",POL:"Polonia",ROU:"Romania",BRA:"Brasile",CAN:"Canada",ARG:"Argentina",CHN:"Cina",JPN:"Giappone",IND:"India",ALB:"Albania",HRV:"Croazia",SVN:"Slovenia",SVK:"Slovacchia",CZE:"Cechia",HUN:"Ungheria",BGR:"Bulgaria",SRB:"Serbia",UKR:"Ucraina",RUS:"Russia",MAR:"Marocco",TUR:"Turchia",EGY:"Egitto"};
  return m[String(v||"").trim()]||String(v||"").trim();
}
async function alloggiatiSend(stay){
  const {token,records}=await buildAlloggiatiRecords(stay);
  const inner=records.map(x=>`<all:string>${xmlEscape(x)}</all:string>`).join("");
  const apartmentId=String(process.env.ALLOGGIATI_ID_APPARTAMENTO||"").trim();
  const method=apartmentId?"GestioneAppartamenti_Send":"Send";
  const body=apartmentId
    ? `<all:GestioneAppartamenti_Send><all:Utente>${xmlEscape(process.env.ALLOGGIATI_USER)}</all:Utente><all:token>${xmlEscape(token)}</all:token><all:ElencoSchedine>${inner}</all:ElencoSchedine><all:IdAppartamento>${xmlEscape(apartmentId)}</all:IdAppartamento></all:GestioneAppartamenti_Send>`
    : `<all:Send><all:Utente>${xmlEscape(process.env.ALLOGGIATI_USER)}</all:Utente><all:token>${xmlEscape(token)}</all:token><all:ElencoSchedine>${inner}</all:ElencoSchedine></all:Send>`;
  const text=await soapCall(method,body);
  const valid=Number(tag(text,"SchedineValide")||0);
  const detail=allTags(text,"EsitoOperazioneServizio").map(x=>({esito:tag(x,"esito"),codice:tag(x,"ErroreCod"),descrizione:tag(x,"ErroreDes"),dettaglio:tag(x,"ErroreDettaglio")}));
  const resultTag=tag(text,method+"Result")||tag(text,"SendResult")||tag(text,"GestioneAppartamenti_SendResult");
  const general={esito:resultTag?tag(resultTag,"esito"):"",errore:resultTag?tag(resultTag,"ErroreDettaglio"):""};
  const apartmentError=!apartmentId && /Gestore di Appartamenti/i.test(`${general.errore} ${detail.map(x=>x.descrizione||x.dettaglio||"").join(" ")}`)
    ? "L'utenza Alloggiati è di categoria Gestione Appartamenti. Configura ALLOGGIATI_ID_APPARTAMENTO con l'ID dell'appartamento presente in Alloggiati Web (Appartamenti > Elenco), poi ripeti l'invio."
    : "";
  return {ok:valid===records.length,status:valid===records.length?"sent":"partial",valid,total:records.length,detail,general,method,apartment_id:apartmentId||null,configuration_error:apartmentError};
}

app.post("/api/test/alloggiati",async(req,res)=>{
  try{const token=await alloggiatiGenerateToken();res.json({ok:true,message:"GenerateToken riuscito",token_valid:true});}
  catch(e){res.status(502).json({ok:false,error:String(e.message||e)})}
});
app.post("/api/test/ross1000",async(req,res)=>{
  try{
    if(!process.env.ROSS_USER||!process.env.ROSS_PASSWORD||!process.env.ROSS_STRUCTURE_CODE)
      throw new Error("ROSS 1000 non configurato: servono ROSS_USER, ROSS_PASSWORD e ROSS_STRUCTURE_CODE.");
    const endpoint=(process.env.ROSS_ENDPOINT||"https://lazioturismo.ross1000.it/ws/checkinV2").replace(/\/$/,"");
    const wsdl=endpoint+"?wsdl";
    const auth=Buffer.from(`${process.env.ROSS_USER}:${process.env.ROSS_PASSWORD}`).toString("base64");
    const r=await fetch(wsdl,{method:"GET",headers:{
      Authorization:`Basic ${auth}`,
      Accept:"text/xml, application/xml",
      "User-Agent":"CheckIn-Lazio/1.0"
    }});
    const text=await r.text();
    if(r.status===401||r.status===403){
      return res.status(502).json({
        ok:false, endpoint, http_status:r.status,
        message:"Endpoint ROSS raggiunto, ma le credenziali HTTP Basic sono state rifiutate.",
        detail:text.slice(0,500)
      });
    }
    if(r.status>=200 && r.status<300){
      return res.json({
        ok:true, endpoint, wsdl:true, http_status:r.status,
        message:"Endpoint ROSS 1000 raggiungibile e WSDL disponibile. Nessun movimento è stato inviato.",
        detail:text.slice(0,500)
      });
    }
    return res.status(502).json({
      ok:false, endpoint, http_status:r.status,
      message:"Endpoint ROSS raggiunto ma ha restituito una risposta non prevista. Nessun movimento è stato inviato.",
      detail:text.slice(0,500)
    });
  }catch(e){
    res.status(502).json({ok:false,error:String(e.message||e)})
  }
});
app.post("/api/submit/:service/:stayId",async(req,res)=>{
  const service=req.params.service;
  const row=db.prepare("SELECT * FROM stays WHERE id=?").get(req.params.stayId);
  if(!row) return res.status(404).json({error:"SOGGIORNO_NON_TROVATO"});
  const stay={...row,guests:JSON.parse(row.guests_json)};
  try{
    if(service==="alloggiati"){
      const result=await alloggiatiSend(stay);
      const detail=JSON.stringify(result);
      db.prepare("INSERT INTO submissions(stay_id,service,status,detail,created_at) VALUES(?,?,?,?,?)").run(row.id,service,result.status,detail,new Date().toISOString());
      return res.json(result);
    }
    if(service==="ross1000"){
      if(!process.env.ROSS_USER||!process.env.ROSS_PASSWORD||!process.env.ROSS_STRUCTURE_CODE) throw new Error("ROSS 1000 non configurato: servono ROSS_USER, ROSS_PASSWORD e ROSS_STRUCTURE_CODE.");
      const result=await rossSend(stay);
      db.prepare("INSERT INTO submissions(stay_id,service,status,detail,created_at) VALUES(?,?,?,?,?)").run(row.id,service,result.status,JSON.stringify(result),new Date().toISOString());
      return res.json(result);
    }
    res.status(400).json({error:"SERVIZIO_NON_SUPPORTATO"});
  }catch(e){
    const detail=String(e.message||e);
    db.prepare("INSERT INTO submissions(stay_id,service,status,detail,created_at) VALUES(?,?,?,?,?)").run(row.id,service,"error",detail,new Date().toISOString());
    res.status(502).json({ok:false,status:"error",error:detail});
  }
});

function rossXmlEscape(s=""){return xmlEscape(s);}
async function rossSend(stay){
  const endpoint=process.env.ROSS_ENDPOINT||"https://lazioturismo.ross1000.it/ws/checkinV2";
  const product=process.env.ROSS_PRODUCT||"CheckIn Lazio";
  const tourism=process.env.ROSS_TOURISM_DEFAULT||"Non Specificato";
  const transport=process.env.ROSS_TRANSPORT_DEFAULT||"Non specificato";
  const channel=process.env.ROSS_CHANNEL_DEFAULT||"Non specificato";
  const roomsAvailable=Number(process.env.ROSS_ROOMS_AVAILABLE||1);
  const bedsAvailable=Number(process.env.ROSS_BEDS_AVAILABLE||stay.guests.length);
  const roomOccupied=1;
  const rossTypeCodes={ospite_singolo:"16",capo_famiglia:"17",capo_gruppo:"18",familiare:"19",membro_gruppo:"20"};
  let nationCsv="";
  try{
    if(process.env.ALLOGGIATI_USER&&process.env.ALLOGGIATI_PASSWORD&&process.env.ALLOGGIATI_WSKEY){
      const tok=await alloggiatiGenerateToken();
      nationCsv=await alloggiatiTable(tok,"Nazioni");
    }
  }catch(_e){}
  const codeOrValue=(v)=>{
    if(!v)return "";
    if(/^\d{6,9}$/.test(String(v).trim())) return String(v).trim();
    return nationCsv?findCode(nationCsv,v):String(v).trim();
  };
  // ROSS richiede un idswh univoco per ogni record della stessa struttura.
  // Deve inoltre restare invariato se lo stesso soggiorno viene ritrasmesso.
  // Usiamo quindi l'ID persistente del soggiorno + anno + indice ospite,
  // mantenendo il valore entro i 20 caratteri previsti dal tracciato.
  const rossRecordId=(guestIndex)=>`CL${String(stay.arrival||"").slice(0,4)}${String(stay.id)}-${guestIndex+1}`;
  const arrivi=stay.guests.map((g,i)=>{
    const guestType=String(g.tipologia||"ospite_singolo");
    const typeCode=rossTypeCodes[guestType]||"16";
    const idcapo=(guestType==="familiare"||guestType==="membro_gruppo")?rossRecordId(0):"";
    const idswh=rossRecordId(i);
    const cittadinanza=codeOrValue(g.cittadinanza_code||g.cittadinanza);
    const statoResidenza=codeOrValue(g.residenza_stato_code||g.residenza_stato||g.cittadinanza);
    let luogoResidenza=String(g.residenza_luogo||"").trim();
    if(!luogoResidenza && !/^100000100$/.test(statoResidenza)) luogoResidenza=String(g.cittadinanza||"").trim();
    const comuneNascita=String(g.comune_nascita_code||"").trim();
    const statoNascita=codeOrValue(g.stato_nascita_code||g.stato_nascita||g.cittadinanza);
    return `<arrivo><idswh>${rossXmlEscape(idswh)}</idswh><tipoalloggiato>${typeCode}</tipoalloggiato><idcapo>${rossXmlEscape(idcapo)}</idcapo><cognome>${rossXmlEscape(g.cognome)}</cognome><nome>${rossXmlEscape(g.nome)}</nome><sesso>${g.sesso||""}</sesso><cittadinanza>${rossXmlEscape(cittadinanza)}</cittadinanza><statoresidenza>${rossXmlEscape(statoResidenza)}</statoresidenza><luogoresidenza>${rossXmlEscape(statoResidenza==="100000100"?(g.residenza_luogo_code||luogoResidenza):luogoResidenza)}</luogoresidenza><datanascita>${yyyymmdd(g.nascita)}</datanascita><statonascita>${rossXmlEscape(statoNascita)}</statonascita><comunenascita>${rossXmlEscape(statoNascita==="100000100"?comuneNascita:"")}</comunenascita><tipoturismo>${rossXmlEscape(g.tipoturismo||tourism)}</tipoturismo><mezzotrasporto>${rossXmlEscape(g.mezzotrasporto||transport)}</mezzotrasporto><canaleprenotazione>${rossXmlEscape(g.canaleprenotazione||channel)}</canaleprenotazione><titolostudio>${rossXmlEscape(g.titolostudio||"")}</titolostudio><professione>${rossXmlEscape(g.professione||"")}</professione><esenzioneimposta>${rossXmlEscape(g.esenzioneimposta||"")}</esenzioneimposta></arrivo>`;
  }).join("");
  const xml=`<?xml version="1.0" encoding="UTF-8"?><S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Body><ns2:inviaMovimentazione xmlns:ns2="http://checkin.ws.service.turismo5.gies.it/"><movimentazione><codice>${rossXmlEscape(process.env.ROSS_STRUCTURE_CODE)}</codice><prodotto>${rossXmlEscape(product)}</prodotto><movimento><data>${yyyymmdd(stay.arrival)}</data><struttura><apertura>SI</apertura><camereoccupate>${roomOccupied}</camereoccupate><cameredisponibili>${roomsAvailable}</cameredisponibili><lettidisponibili>${bedsAvailable}</lettidisponibili></struttura><arrivi>${arrivi}</arrivi></movimento></movimentazione></ns2:inviaMovimentazione></S:Body></S:Envelope>`;
  const auth=Buffer.from(`${process.env.ROSS_USER}:${process.env.ROSS_PASSWORD}`).toString("base64");
  const r=await fetch(endpoint,{method:"POST",headers:{Accept:"text/xml, multipart/related",Authorization:`Basic ${auth}`,"Content-Type":"text/xml; charset=utf-8",SOAPAction:"","User-Agent":"CheckIn-Lazio/1.0"},body:xml});
  const text=await r.text();
  if(!r.ok) throw new Error(`ROSS HTTP ${r.status}: ${text.slice(0,1200)}`);
  const fault=tag(text,"faultstring")||tag(text,"detail");
  if(fault) return {ok:false,status:"error",error:fault,raw:text.slice(0,5000)};
  const responseError=tag(text,"ErroreDettaglio")||tag(text,"errore")||tag(text,"error");
  if(responseError) return {ok:false,status:"error",error:`ROSS 1000: ${responseError}`,raw:text.slice(0,5000)};
  return {ok:true,status:"sent",message:"ROSS 1000: richiesta SOAP inviata. Identificativi idswh univoci per il soggiorno; camera occupata conteggiata una sola volta; per familiari/membri di gruppo sono stati inviati tipo e idcapo previsti.",raw:text.slice(0,5000)};
}

app.get(/.*/, (req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`CheckIn Lazio cloud server on :${PORT}`));
