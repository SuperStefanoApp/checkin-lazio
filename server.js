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
  // When mounted with app.use("/api", auth), Express exposes req.path without
  // the mount prefix. Use originalUrl so the public routes are unambiguous.
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
    req.user = a;
    next();
  } catch { return res.status(401).json({error:"AUTH_INVALID"}); }
}
app.use("/api", auth);

app.get("/api/health",(req,res)=>res.json({ok:true,service:"checkin-lazio",time:new Date().toISOString()}));

app.post("/api/login",(req,res)=>{
  const {username,password}=req.body||{};
  if(username===process.env.ADMIN_USER && password===process.env.ADMIN_PASSWORD){
    const a = crypto.randomUUID();
    const b = crypto.createHmac("sha256",process.env.SESSION_SECRET).update(a).digest("hex");
    return res.json({ok:true,token:`${a}.${b}`});
  }
  return res.status(401).json({ok:false,error:"Credenziali non valide"});
});

app.post("/api/stays",(req,res)=>{
  const {arrival,nights,departure,guests}=req.body||{};
  if(!arrival || !departure || !Number.isInteger(Number(nights)) || Number(nights)<1 || !Array.isArray(guests) || guests.length<1)
    return res.status(400).json({error:"DATI_INCOMPLETI"});
  const stmt=db.prepare("INSERT INTO stays(arrival,nights,departure,guests_json,created_at) VALUES(?,?,?,?,?)");
  const info=stmt.run(arrival,Number(nights),departure,JSON.stringify(guests),new Date().toISOString());
  res.json({ok:true,id:info.lastInsertRowid});
});

app.get("/api/stays",(req,res)=>{
  const rows=db.prepare("SELECT * FROM stays ORDER BY id DESC LIMIT 100").all();
  res.json(rows.map(r=>({...r,guests:JSON.parse(r.guests_json)})));
});

function xmlEscape(s=""){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");}

function guestToSchedina(g,stay){
  // The exact 168-char Alloggiati record layout must be mapped to the structure's
  // official tabella/field codes before production sending. This function deliberately
  // refuses to transmit an unverified record instead of inventing a format.
  return null;
}

async function alloggiatiGenerateToken(){
  const endpoint="https://alloggiatiweb.poliziadistato.it/service/Service.asmx";
  const body=`<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:all="AlloggiatiService">
<soap:Body><all:GenerateToken>
<all:Utente>${xmlEscape(process.env.ALLOGGIATI_USER)}</all:Utente>
<all:Password>${xmlEscape(process.env.ALLOGGIATI_PASSWORD)}</all:Password>
<all:WsKey>${xmlEscape(process.env.ALLOGGIATI_WSKEY)}</all:WsKey>
</all:GenerateToken></soap:Body></soap:Envelope>`;
  const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/soap+xml; charset=utf-8","SOAPAction":"AlloggiatiService/GenerateToken"},body});
  const text=await r.text();
  const token=(text.match(/<token>(.*?)<\/token>/)||[])[1]||"";
  const err=(text.match(/<ErroreDettaglio>(.*?)<\/ErroreDettaglio>/)||[])[1]||"";
  if(!token) throw new Error(err||"GenerateToken non ha restituito un token");
  return token;
}

app.post("/api/test/alloggiati",async(req,res)=>{
  try{
    if(!process.env.ALLOGGIATI_USER||!process.env.ALLOGGIATI_PASSWORD||!process.env.ALLOGGIATI_WSKEY)
      return res.status(400).json({ok:false,error:"Credenziali Alloggiati non configurate"});
    const token=await alloggiatiGenerateToken();
    res.json({ok:true,message:"GenerateToken riuscito",token_valid:true});
  }catch(e){res.status(502).json({ok:false,error:String(e.message||e)})}
});

app.post("/api/submit/:service/:stayId",async(req,res)=>{
  const service=req.params.service;
  const stay=db.prepare("SELECT * FROM stays WHERE id=?").get(req.params.stayId);
  if(!stay) return res.status(404).json({error:"SOGGIORNO_NON_TROVATO"});
  if(service==="alloggiati"){
    // Production sending is intentionally gated until the exact structure field map
    // is entered in configuration. The official WS is reachable/testable via GenerateToken.
    const detail="Invio dati non eseguito: manca la mappatura verificata dei campi Alloggiati della struttura.";
    db.prepare("INSERT INTO submissions(stay_id,service,status,detail,created_at) VALUES(?,?,?,?,?)")
      .run(stay.id,service,"blocked",detail,new Date().toISOString());
    return res.json({ok:false,status:"blocked",detail});
  }
  if(service==="ross1000"){
    const detail="Endpoint ROSS 1000 configurato; il tracciato XML definitivo deve essere validato sulla versione WS della Regione Lazio prima dell'invio reale.";
    db.prepare("INSERT INTO submissions(stay_id,service,status,detail,created_at) VALUES(?,?,?,?,?)")
      .run(stay.id,service,"blocked",detail,new Date().toISOString());
    return res.json({ok:false,status:"blocked",detail});
  }
  res.status(400).json({error:"SERVIZIO_NON_SUPPORTATO"});
});

app.get("/api/submissions",(req,res)=>{
  res.json(db.prepare("SELECT * FROM submissions ORDER BY id DESC LIMIT 200").all());
});

app.get(/.*/,(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

app.listen(PORT,()=>console.log(`CheckIn Lazio cloud server on :${PORT}`));