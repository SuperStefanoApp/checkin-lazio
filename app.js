
let token=localStorage.getItem("checkin_token")||"";
let mrzReader=null;
let mrzStarting=false;
const COUNTRY_NAMES = {"ABW": "Aruba", "AFG": "Afghanistan", "AGO": "Angola", "AIA": "Anguilla", "ALA": "Isole Åland", "ALB": "Albania", "AND": "Andorra", "ARE": "Emirati Arabi Uniti", "ARG": "Argentina", "ARM": "Armenia", "ASM": "Samoa Americane", "ATA": "Antartide", "ATF": "Terre Australi Francesi", "ATG": "Antigua e Barbuda", "AUS": "Australia", "AUT": "Austria", "AZE": "Azerbaigian", "BDI": "Burundi", "BEL": "Belgio", "BEN": "Benin", "BES": "Caraibi Olandesi", "BFA": "Burkina Faso", "BGD": "Bangladesh", "BGR": "Bulgaria", "BHR": "Bahrein", "BHS": "Bahamas", "BIH": "Bosnia ed Erzegovina", "BLM": "Saint-Barthélemy", "BLR": "Bielorussia", "BLZ": "Belize", "BMU": "Bermuda", "BOL": "Bolivia", "BRA": "Brasile", "BRB": "Barbados", "BRN": "Brunei", "BTN": "Bhutan", "BVT": "Isola Bouvet", "BWA": "Botswana", "CAF": "Repubblica Centrafricana", "CAN": "Canada", "CCK": "Isole Cocos (Keeling)", "CHE": "Svizzera", "CHL": "Cile", "CHN": "Cina", "CIV": "Costa d’Avorio", "CMR": "Camerun", "COD": "Congo - Kinshasa", "COG": "Congo-Brazzaville", "COK": "Isole Cook", "COL": "Colombia", "COM": "Comore", "CPV": "Capo Verde", "CRI": "Costa Rica", "CUB": "Cuba", "CUW": "Curaçao", "CXR": "Isola Christmas", "CYM": "Isole Cayman", "CYP": "Cipro", "CZE": "Cechia", "DEU": "Germania", "DJI": "Gibuti", "DMA": "Dominica", "DNK": "Danimarca", "DOM": "Repubblica Dominicana", "DZA": "Algeria", "ECU": "Ecuador", "EGY": "Egitto", "ERI": "Eritrea", "ESH": "Sahara Occidentale", "ESP": "Spagna", "EST": "Estonia", "ETH": "Etiopia", "FIN": "Finlandia", "FJI": "Figi", "FLK": "Isole Falkland", "FRA": "Francia", "FRO": "Isole Fær Øer", "FSM": "Micronesia", "GAB": "Gabon", "GBR": "Regno Unito", "GEO": "Georgia", "GGY": "Guernsey", "GHA": "Ghana", "GIB": "Gibilterra", "GIN": "Guinea", "GLP": "Guadalupa", "GMB": "Gambia", "GNB": "Guinea-Bissau", "GNQ": "Guinea Equatoriale", "GRC": "Grecia", "GRD": "Grenada", "GRL": "Groenlandia", "GTM": "Guatemala", "GUF": "Guyana Francese", "GUM": "Guam", "GUY": "Guyana", "HKG": "RAS di Hong Kong", "HMD": "Isole Heard e McDonald", "HND": "Honduras", "HRV": "Croazia", "HTI": "Haiti", "HUN": "Ungheria", "IDN": "Indonesia", "IMN": "Isola di Man", "IND": "India", "IOT": "Territorio Britannico dell’Oceano Indiano", "IRL": "Irlanda", "IRN": "Iran", "IRQ": "Iraq", "ISL": "Islanda", "ISR": "Israele", "ITA": "Italia", "JAM": "Giamaica", "JEY": "Jersey", "JOR": "Giordania", "JPN": "Giappone", "KAZ": "Kazakistan", "KEN": "Kenya", "KGZ": "Kirghizistan", "KHM": "Cambogia", "KIR": "Kiribati", "KNA": "Saint Kitts e Nevis", "KOR": "Corea del Sud", "KWT": "Kuwait", "LAO": "Laos", "LBN": "Libano", "LBR": "Liberia", "LBY": "Libia", "LCA": "Saint Lucia", "LIE": "Liechtenstein", "LKA": "Sri Lanka", "LSO": "Lesotho", "LTU": "Lituania", "LUX": "Lussemburgo", "LVA": "Lettonia", "MAC": "RAS di Macao", "MAF": "Saint Martin", "MAR": "Marocco", "MCO": "Monaco", "MDA": "Moldavia", "MDG": "Madagascar", "MDV": "Maldive", "MEX": "Messico", "MHL": "Isole Marshall", "MKD": "Macedonia del Nord", "MLI": "Mali", "MLT": "Malta", "MMR": "Myanmar (Birmania)", "MNE": "Montenegro", "MNG": "Mongolia", "MNP": "Isole Marianne Settentrionali", "MOZ": "Mozambico", "MRT": "Mauritania", "MSR": "Montserrat", "MTQ": "Martinica", "MUS": "Mauritius", "MWI": "Malawi", "MYS": "Malaysia", "MYT": "Mayotte", "NAM": "Namibia", "NCL": "Nuova Caledonia", "NER": "Niger", "NFK": "Isola Norfolk", "NGA": "Nigeria", "NIC": "Nicaragua", "NIU": "Niue", "NLD": "Paesi Bassi", "NOR": "Norvegia", "NPL": "Nepal", "NRU": "Nauru", "NZL": "Nuova Zelanda", "OMN": "Oman", "PAK": "Pakistan", "PAN": "Panama", "PCN": "Isole Pitcairn", "PER": "Perù", "PHL": "Filippine", "PLW": "Palau", "PNG": "Papua Nuova Guinea", "POL": "Polonia", "PRI": "Portorico", "PRK": "Corea del Nord", "PRT": "Portogallo", "PRY": "Paraguay", "PSE": "Territori Palestinesi", "PYF": "Polinesia Francese", "QAT": "Qatar", "REU": "Riunione", "ROU": "Romania", "RUS": "Russia", "RWA": "Ruanda", "SAU": "Arabia Saudita", "SDN": "Sudan", "SEN": "Senegal", "SGP": "Singapore", "SGS": "Georgia del Sud e Sandwich Australi", "SHN": "Sant’Elena", "SJM": "Svalbard e Jan Mayen", "SLB": "Isole Salomone", "SLE": "Sierra Leone", "SLV": "El Salvador", "SMR": "San Marino", "SOM": "Somalia", "SPM": "Saint-Pierre e Miquelon", "SRB": "Serbia", "SSD": "Sud Sudan", "STP": "São Tomé e Príncipe", "SUR": "Suriname", "SVK": "Slovacchia", "SVN": "Slovenia", "SWE": "Svezia", "SWZ": "Eswatini", "SXM": "Sint Maarten", "SYC": "Seychelles", "SYR": "Siria", "TCA": "Isole Turks e Caicos", "TCD": "Ciad", "TGO": "Togo", "THA": "Thailandia", "TJK": "Tagikistan", "TKL": "Tokelau", "TKM": "Turkmenistan", "TLS": "Timor Est", "TON": "Tonga", "TTO": "Trinidad e Tobago", "TUN": "Tunisia", "TUR": "Turchia", "TUV": "Tuvalu", "TWN": "Taiwan", "TZA": "Tanzania", "UGA": "Uganda", "UKR": "Ucraina", "UMI": "Isole Minori Esterne degli Stati Uniti", "URY": "Uruguay", "USA": "Stati Uniti", "UZB": "Uzbekistan", "VAT": "Città del Vaticano", "VCT": "Saint Vincent e Grenadine", "VEN": "Venezuela", "VGB": "Isole Vergini Britanniche", "VIR": "Isole Vergini Americane", "VNM": "Vietnam", "VUT": "Vanuatu", "WLF": "Wallis e Futuna", "WSM": "Samoa", "XKX": "Kosovo", "YEM": "Yemen", "ZAF": "Sudafrica", "ZMB": "Zambia", "ZWE": "Zimbabwe"};
function countryName(code){const c=String(code||"").trim().toUpperCase(); return COUNTRY_NAMES[c]||c;}

function api(path,opt={}){opt.headers={...(opt.headers||{}),Authorization:"Bearer "+token,"Content-Type":"application/json"};return fetch(path,opt)}
function show(id,msg){const e=document.getElementById(id);e.textContent=msg;e.classList.remove("hidden")}

let officialCountries=[];
let officialCountriesLoaded=false;
let nationalityTimers={};
async function loadOfficialCountries(){
 if(officialCountriesLoaded)return officialCountries;
 try{const r=await api("/api/nazioni");const j=await r.json();if(!j.ok)throw new Error(j.error||"Elenco Stati non disponibile");officialCountries=Array.isArray(j.items)?j.items:[];officialCountriesLoaded=true;return officialCountries;}catch(e){officialCountries=[];return []}
}
function countryNorm(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().replace(/[^A-Z0-9]+/g," ").trim()}
function countrySuggestionBox(index){return document.getElementById(`nationalitySuggestions_${index}`)}
function fallbackCountries(){return Object.entries(COUNTRY_NAMES).map(([iso,nome])=>({codice:"",nome})).sort((a,b)=>a.nome.localeCompare(b.nome,"it"))}
function availableCountries(){return officialCountries.length?officialCountries:fallbackCountries()}
function clearNationalitySuggestions(index){const b=countrySuggestionBox(index);if(b){b.innerHTML="";b.classList.add("hidden")}}
function renderNationalitySuggestions(index,query=""){const g=getGuest(index);if(!g)return;const b=countrySuggestionBox(index);if(!b)return;const q=countryNorm(query);const items=availableCountries().filter(x=>!q||countryNorm(x.nome).includes(q)).slice(0,80);b.innerHTML=items.map(x=>`<button type="button" data-name="${escapeHtml(x.nome)}" data-code="${escapeHtml(x.codice||"")}" onpointerdown="selectNationality(${index},this);return false;">${escapeHtml(x.nome)}</button>`).join("");b.classList.toggle("hidden",items.length===0)}
async function openNationalityList(index){renderNationalitySuggestions(index,getGuest(index)?.querySelector('[data-f="cittadinanza"]')?.value||"");loadOfficialCountries().then(()=>renderNationalitySuggestions(index,getGuest(index)?.querySelector('[data-f="cittadinanza"]')?.value||""))}
async function handleNationalityInput(index){const g=getGuest(index);if(!g)return;const field=g.querySelector('[data-f="cittadinanza"]'),code=g.querySelector('[data-f="cittadinanza_code"]');if(code)code.value="";if(field){field.dataset.countrySelected="0";field.dataset.countryCode=""}clearTimeout(nationalityTimers[index]);renderNationalitySuggestions(index,field?.value||"");nationalityTimers[index]=setTimeout(async()=>{await loadOfficialCountries();renderNationalitySuggestions(index,field?.value||"")},150)}
function selectNationality(index,button){const g=getGuest(index);if(!g)return;const field=g.querySelector('[data-f="cittadinanza"]'),code=g.querySelector('[data-f="cittadinanza_code"]');const name=button.dataset.name||"",cc=button.dataset.code||"";if(field){field.value=name;field.dataset.countrySelected="1";field.dataset.countryCode=cc}if(code)code.value=cc;const h=document.getElementById(`nationalityHint_${index}`);if(h)h.textContent=cc?`Selezionato: ${name} — codice Alloggiati ${cc}`:`Selezionato: ${name}`;clearNationalitySuggestions(index);syncPlacesFromNationality(index)}
async function handleNationalityBlur(index){setTimeout(async()=>{const g=getGuest(index);if(!g)return;const field=g.querySelector('[data-f="cittadinanza"]'),code=g.querySelector('[data-f="cittadinanza_code"]');if(field?.dataset.countrySelected==="1")return;const typed=countryNorm(field?.value||"");if(!typed){clearNationalitySuggestions(index);return}await loadOfficialCountries();const exact=availableCountries().find(x=>countryNorm(x.nome)===typed);if(exact){selectNationality(index,{dataset:{name:exact.nome,code:exact.codice||""}});return}
// Non cancelliamo ciò che l'utente ha digitato se il servizio ufficiale non è temporaneamente disponibile.
// In questo caso il dato verrà risolto dal server al momento della trasmissione.
if(officialCountriesLoaded && officialCountries.length){if(field)field.value="";if(code)code.value="";const h=document.getElementById(`nationalityHint_${index}`);if(h)h.textContent="Seleziona uno Stato dall'elenco ufficiale Alloggiati Web.";clearNationalitySuggestions(index);}
},300)}
let officialGuestTypes=[];
let officialDocumentTypes=[];
const OFFICIAL_DOCUMENT_FALLBACK=[
"CARTA DI IDENTITA'","CARTA ID. DIPLOMATICA","CARTA IDENTITA' ELETTRONICA","CERTIFICATO D'IDENTITA'",
"PASSAPORTO DIPLOMATICO","PASSAPORTO DI SERVIZIO","PASSAPORTO ORDINARIO","PATENTE DI GUIDA","PATENTE NAUTICA",
"PORTO D'ARMI GUARDIE GIUR","PORTO D'ARMI USO SPORTIVO","PORTO FUCILE DIF. PERSON.","PORTO FUCILE USO CACCIA","PORTO PISTOLA DIF. PERSON",
"TES. ENTE NAZ. ASSIS.VOLO","TES. FERROV. EX DEPUTATI","TES. FERROVIARIA DEPUTATI","TES. POSTE E TELECOMUNIC.",
"TES. UNICO PER LA CAMERA","TES.DOGANALE RIL.MIN.FIN.","TESS. AG. E AG.SC. C.F.S.","TESS. AGENTI/ASS.TI P.P.","TESS. AGENTI/ASS.TI P.S.",
"TESS. APP.TO AG.CUSTODIA","TESS. APP.TO CARABINIERI","TESS. APP.TO FINANZIERE","TESS. APP.TO/VIG. URBANO","TESS. APP.TO/VIG. VV.FF.",
"TESS. CONSIGLIO DI STATO","TESS. CORTE D'APPELLO","TESS. CORTE DEI CONTI","TESS. FERROV. SENATO","TESS. FUNZIONARI P.S.",
"TESS. IDENTIF.TELECOM IT.","TESS. ISCR. ALBO MED/CHI.","TESS. ISCRIZ. ALBO ODONT.","TESS. ISPETTORI P.P.","TESS. ISPETTORI P.S.",
"TESS. MEMBRO EQUIP. AEREO","TESS. MINISTERO INTERNO","TESS. MINISTERO GIUSTIZIA","TESS. MINISTERO DIFESA","TESS. MINISTERO FINANZE",
"TESS. MINISTERO SANITA'","TESS. MINISTERO TESORO","TESS. MIN.PUBB.ISTRUZIONE","TESS. MINIST. TRASP/NAVIG.",
"TESSERA DELL'ORDINE NOTAI","TESSERA RICONOSC. D.I.A.","TESSERA U.N.U.C.I.","TITOLO VIAGGIO RIF.POLIT."];

async function loadOfficialGuestTypes(){
  try{const r=await api("/api/tipi-alloggiato");const j=await r.json();if(!j.ok)throw new Error(j.error||"Tabella Tipo Alloggiato non disponibile");officialGuestTypes=j.items||[];renderGuestTypeControls();}catch(e){officialGuestTypes=[];}
}
async function loadOfficialDocumentTypes(){
  try{
    const r=await api("/api/tipi-documento");
    const j=await r.json();
    if(!j.ok)throw new Error(j.error||"Tabella Tipo Documento non disponibile");
    officialDocumentTypes=Array.isArray(j.items)?j.items:[];
  }catch(e){
    // Il menu deve rimanere utilizzabile anche se il download ufficiale non è momentaneamente disponibile.
    // I codici per la trasmissione vengono comunque risolti lato server contro la tabella Alloggiati Web.
    officialDocumentTypes=OFFICIAL_DOCUMENT_FALLBACK.map(nome=>({codice:"",nome}));
  }
  renderDocumentTypeControls();
}
function internalGuestTypeFromName(name){
 const n=countryNorm(name);
 if(n.includes("CAPO FAMIGLIA"))return "capo_famiglia";
 if(n.includes("CAPO GRUPPO"))return "capo_gruppo";
 if(n.includes("FAMILIARE"))return "familiare";
 if(n.includes("MEMBRO GRUPPO")||n.includes("MEMBRO DI GRUPPO"))return "membro_gruppo";
 if(n.includes("OSPITE SINGOLO"))return "ospite_singolo";
 return "";
}
function officialGuestTypeCode(internal){
 const x=officialGuestTypes.find(x=>internalGuestTypeFromName(x.nome)===internal);
 return x?.codice||"";
}
function renderGuestTypeControls(){
 document.querySelectorAll('.guest').forEach((g,i)=>{
   const sel=g.querySelector('[data-f="tipologia"]');
   const hidden=g.querySelector('[data-f="tipologia_code"]');
   if(i===0 && sel && officialGuestTypes.length){
     const current=sel.value||"ospite_singolo";
     sel.innerHTML=officialGuestTypes.map(x=>`<option value="${escapeHtml(internalGuestTypeFromName(x.nome))}" data-code="${escapeHtml(x.codice)}">${escapeHtml(x.nome)}</option>`).filter(x=>!x.includes('value=""')).join("");
     sel.value=officialGuestTypes.some(x=>internalGuestTypeFromName(x.nome)===current)?current:officialGuestTypes.length?internalGuestTypeFromName(officialGuestTypes[0].nome):"ospite_singolo";
     if(hidden)hidden.value=officialGuestTypeCode(sel.value);
   } else if(i>0 && hidden){
     const internal=String(sel?.value||"ospite_singolo");
     hidden.value=officialGuestTypeCode(internal)||hidden.value||"";
   }
 });
 applyHeadGuestRule();
}
function renderDocumentTypeControls(){
 const field=document.querySelector('[data-f="tipo_documento"]');
 if(!field || field.tagName!=='SELECT')return;
 const current=field.value||'';
 const items=officialDocumentTypes.length?officialDocumentTypes:OFFICIAL_DOCUMENT_FALLBACK.map(nome=>({codice:'',nome}));
 field.innerHTML='<option value="">Seleziona</option>'+items.map(x=>`<option value="${escapeHtml(x.nome)}" data-code="${escapeHtml(x.codice||'')}">${escapeHtml(x.nome)}</option>`).join('');
 if(current && items.some(x=>countryNorm(x.nome)===countryNorm(current))) field.value=items.find(x=>countryNorm(x.nome)===countryNorm(current)).nome;
 field.onchange=function(){
   const opt=this.options[this.selectedIndex];
   this.dataset.documentCode=opt?.dataset.code||'';
   this.dataset.documentSelected=this.value?'1':'0';
   const hint=document.getElementById('documentTypeHint_0');
   if(hint)hint.textContent=this.value?(this.dataset.documentCode?`Selezionato: ${this.value} — codice Alloggiati ${this.dataset.documentCode}`:`Selezionato: ${this.value}`):"Seleziona un documento dall'elenco ufficiale Alloggiati Web.";
 };
}
async function loadOfficialLookups(){await Promise.all([loadOfficialCountries(),loadOfficialGuestTypes(),loadOfficialDocumentTypes()]);}

async function login(){const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:user.value,password:pass.value})});const j=await r.json();if(j.ok){token=j.token;localStorage.setItem("checkin_token",token);document.getElementById("login").classList.add("hidden");document.getElementById("app").classList.remove("hidden");syncGuests();setDepartureFromNights();loadOfficialLookups().catch(()=>{})}else show("loginMsg",j.error||"Accesso negato")}

// Date handling deliberately avoids toISOString(), which converts midnight to UTC and
// can shift an Italian calendar date back by one day.
function dateDiff(a,b){
 if(!a||!b)return null;
 const [ay,am,ad]=a.split("-").map(Number), [by,bm,bd]=b.split("-").map(Number);
 const A=Date.UTC(ay,am-1,ad), B=Date.UTC(by,bm-1,bd);
 return Math.round((B-A)/86400000);
}
function addDays(dateStr,n){
 const [y,m,d]=dateStr.split("-").map(Number);
 const dt=new Date(y,m-1,d);
 dt.setDate(dt.getDate()+n);
 const yy=dt.getFullYear(), mm=String(dt.getMonth()+1).padStart(2,"0"), dd=String(dt.getDate()).padStart(2,"0");
 return `${yy}-${mm}-${dd}`;
}
function setDepartureFromNights(){if(!arrival.value)return;const n=Number(nights.value||0);if(n<1)return;departure.value=addDays(arrival.value,n)}
function setNightsFromDates(){const n=dateDiff(arrival.value,departure.value);if(n!==null&&n>=1)nights.value=n}

function guestHtml(i){
 const first=i===1;
 return `<div class="guest" data-guest-index="${i-1}">
<div class="pill">Ospite ${i}</div>
<div class="grid" style="margin-top:10px">
${first
 ? `<div><label>Tipologia Alloggiato</label><select data-f="tipologia" onchange="updateGuestType(0)"><option value="ospite_singolo">Ospite singolo</option><option value="capo_famiglia">Capo famiglia</option><option value="capo_gruppo">Capo gruppo</option><option value="familiare">Familiare</option><option value="membro_gruppo">Membro gruppo</option></select><input type="hidden" data-f="tipologia_code"></div>`
 : `<div><label>Tipologia Alloggiato</label><input data-f="tipologia" readonly value="ospite_singolo"><input type="hidden" data-f="tipologia_code"></div>`}
<div><label>Cittadinanza</label><div class="field-wrap"><input data-f="cittadinanza" autocomplete="off" oninput="handleNationalityInput(${i-1})" onfocus="openNationalityList(${i-1})" onblur="handleNationalityBlur(${i-1})"><input type="hidden" data-f="cittadinanza_code"><div id="nationalitySuggestions_${i-1}" class="country-suggestions hidden"></div></div><div id="nationalityHint_${i-1}" class="municipality-hint">Seleziona uno Stato dall'elenco ufficiale Alloggiati Web.</div></div>
<div><label>Luogo di nascita</label><div class="field-wrap"><input data-f="luogo_nascita" autocomplete="off" oninput="handlePlaceInput(${i-1},'birth')" onfocus="handlePlaceFocus(${i-1},'birth')" onblur="handlePlaceBlur(${i-1},'birth')"><div id="birthSuggestions_${i-1}" class="municipality-suggestions hidden"></div></div><div id="birthHint_${i-1}" class="municipality-hint"></div></div>
<div><label>Cognome</label><input data-f="cognome"></div>
<div><label>Nome</label><input data-f="nome"></div>
<div><label>Data di nascita</label><input data-f="nascita" type="date"></div>
<div><label>Sesso</label><select data-f="sesso"><option value="">Seleziona</option><option value="M">M</option><option value="F">F</option></select></div>
${first?`<div class="doc-field"><label>Tipologia documento</label><div class="field-wrap"><select data-f="tipo_documento" id="documentTypeSelect_0"><option value="">Seleziona</option>${OFFICIAL_DOCUMENT_FALLBACK.map(nome=>`<option value="${escapeHtml(nome)}">${escapeHtml(nome)}</option>`).join('')}</select></div><div id="documentTypeHint_0" class="municipality-hint">Seleziona un documento dall'elenco ufficiale Alloggiati Web.</div></div>
<div class="doc-field"><label>Luogo di rilascio del documento</label><div class="field-wrap"><input data-f="luogo_rilascio_documento" autocomplete="off" oninput="handlePlaceInput(0,'issue')" onfocus="handlePlaceFocus(0,'issue')" onblur="handlePlaceBlur(0,'issue')"><div id="issueSuggestions_0" class="municipality-suggestions hidden"></div></div><div id="issueHint_0" class="municipality-hint"></div></div>
<div class="doc-field"><label>Numero documento</label><input data-f="numero_documento"></div>`:`<input type="hidden" data-f="tipo_documento"><input type="hidden" data-f="luogo_rilascio_documento"><input type="hidden" data-f="numero_documento">`}
</div>
<button type="button" class="secondary" style="margin-top:12px" onclick="scanGuestMrz(${i-1})">📷 Leggi documento di Ospite ${i}</button>
<div class="small" style="margin-top:6px">Scansione disponibile in modalità <strong>MRZ</strong> oppure <strong>OCR</strong>. La lettura è associata esclusivamente a questo ospite. Per gli ospiti successivi non vengono richiesti i dati del documento.</div>
</div>`}
function syncGuests(){let n=Math.max(1,Number(party.value||1));guests.innerHTML=Array.from({length:n},(_,i)=>guestHtml(i+1)).join("");applyHeadGuestRule();for(let i=0;i<n;i++)updateGuestType(i)}
function addManual(){party.value=Number(party.value||0)+1;syncGuests();guests.lastElementChild?.scrollIntoView({behavior:"smooth"})}
function applyHeadGuestRule(){
 const first=getGuest(0); if(!first)return;
 const firstType=first.querySelector('[data-f="tipologia"]')?.value;
 const forced=firstType==="capo_famiglia"?"familiare":firstType==="capo_gruppo"?"membro_gruppo":"ospite_singolo";
 const firstCode=officialGuestTypeCode(firstType)||first.querySelector('[data-f="tipologia_code"]')?.value||"";
 const firstHidden=first.querySelector('[data-f="tipologia_code"]'); if(firstHidden&&firstType)firstHidden.value=firstCode;
 document.querySelectorAll('.guest').forEach((g,i)=>{
   if(i===0)return;
   const field=g.querySelector('[data-f="tipologia"]');
   const code=g.querySelector('[data-f="tipologia_code"]');
   if(field)field.value=forced;
   if(code)code.value=officialGuestTypeCode(forced)||"";
 });
}
function updateGuestType(index){
 const g=getGuest(index); if(!g)return;
 const sel=g.querySelector('[data-f="tipologia"]');
 const code=g.querySelector('[data-f="tipologia_code"]');
 if(sel&&code)code.value=officialGuestTypeCode(sel.value)||sel.selectedOptions?.[0]?.dataset?.code||"";
 if(index===0) applyHeadGuestRule();
}
function isItalianNationality(value){
 const v=countryNorm(value);
 if(v==="ITALIA"||v==="ITALIAN"||v==="ITA")return true;
 return officialCountries.some(x=>countryNorm(x.nome)===v&&String(x.codice)==="100000100");
}
function placeField(index,kind){
 const g=getGuest(index);if(!g)return null;
 return kind==="birth"?g.querySelector('[data-f="luogo_nascita"]'):g.querySelector('[data-f="luogo_rilascio_documento"]');
}
function placeSuggestionBox(index,kind){return document.getElementById(`${kind==='birth'?'birth':'issue'}Suggestions_${index}`)}
function placeHint(index,kind){return document.getElementById(`${kind==='birth'?'birth':'issue'}Hint_${index}`)}
function clearPlaceSuggestions(index,kind){const box=placeSuggestionBox(index,kind);if(box){box.innerHTML="";box.classList.add("hidden")}}
function markBirthplaceManual(index){
 const g=getGuest(index); if(!g)return;
 const b=g.querySelector('[data-f="luogo_nascita"]');
 if(b && b.value.trim()!==String(g.dataset.birthplaceAutoValue||"").trim()) g.dataset.birthplaceManual="1";
}
function markIssuingPlaceManual(index){
 const g=getGuest(index);if(!g)return;
 const el=g.querySelector('[data-f="luogo_rilascio_documento"]');
 if(el && el.value.trim()!==String(g.dataset.issuingPlaceAutoValue||"").trim()) g.dataset.issuingPlaceManual="1";
}
function syncPlacesFromNationality(index){
 const g=getGuest(index);if(!g)return;
 const c=g.querySelector('[data-f="cittadinanza"]')?.value?.trim();
 const cf=g.querySelector('[data-f="cittadinanza"]');
 const cc=g.querySelector('[data-f="cittadinanza_code"]')?.value?.trim();
 if(cf&&cc)cf.dataset.countryCode=cc;
 const b=g.querySelector('[data-f="luogo_nascita"]');
 const i=g.querySelector('[data-f="luogo_rilascio_documento"]');
 if(!c){clearPlaceSuggestions(index,'birth');clearPlaceSuggestions(index,'issue');return;}
 if(isItalianNationality(c)){
   if(b&&g.dataset.birthplaceManual!=="1"){b.value="";g.dataset.birthplaceAutoValue="";}
   if(i&&g.dataset.issuingPlaceManual!=="1"){i.value="";g.dataset.issuingPlaceAutoValue="";}
   if(placeHint(index,'birth'))placeHint(index,'birth').textContent="Cerca e seleziona il Comune italiano.";
   if(placeHint(index,'issue'))placeHint(index,'issue').textContent="Cerca e seleziona il Comune italiano.";
 }else{
   const countryItem=availableCountries().find(x=>countryNorm(x.nome)===countryNorm(c));
   const countryCode=countryItem?.codice||cc||"";
   if(b&&g.dataset.birthplaceManual!=="1"){b.value=countryItem?.nome||c;g.dataset.birthplaceAutoValue=countryItem?.nome||c;g.dataset.birthStateCode=countryCode;}
   if(i&&g.dataset.issuingPlaceManual!=="1"){i.value=countryItem?.nome||c;g.dataset.issuingPlaceAutoValue=countryItem?.nome||c;g.dataset.issuingStateCode=countryCode;}
   if(placeHint(index,'birth'))placeHint(index,'birth').textContent="Per cittadini stranieri viene indicato il Paese.";
   if(placeHint(index,'issue'))placeHint(index,'issue').textContent="Per cittadini stranieri viene indicato il Paese.";
   clearPlaceSuggestions(index,'birth');clearPlaceSuggestions(index,'issue');
 }
}
let placeSearchTimers={};
async function searchMunicipalities(index,kind){
 const g=getGuest(index);if(!g)return;
 const c=g.querySelector('[data-f="cittadinanza"]')?.value?.trim();
 const field=placeField(index,kind); if(!field||!isItalianNationality(c))return;
 const q=field.value.trim(); if(q.length<2){clearPlaceSuggestions(index,kind);return;}
 const key=`${index}:${kind}`;clearTimeout(placeSearchTimers[key]);
 placeSearchTimers[key]=setTimeout(async()=>{
   try{
     const r=await api(`/api/comuni?q=${encodeURIComponent(q)}`);
     const j=await r.json();
     if(!j.ok)throw new Error(j.error||"Ricerca non disponibile");
     const box=placeSuggestionBox(index,kind);if(!box)return;
     box.innerHTML=j.items.map(x=>`<button type="button" data-name="${escapeHtml(x.nome)}" data-prov="${escapeHtml(x.sigla)}" data-code="${escapeHtml(x.codice)}" onclick="selectMunicipality(${index},'${kind}',this)">${escapeHtml(x.nome)}${x.sigla?` (${escapeHtml(x.sigla)})`:''}</button>`).join("");
     box.classList.toggle("hidden",j.items.length===0);
   }catch(e){clearPlaceSuggestions(index,kind);}
 },180);
}
function escapeHtml(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;")}
function renderPlaceCountrySuggestions(index,kind,query=""){
 const box=placeSuggestionBox(index,kind);if(!box)return;
 const q=countryNorm(query);
 const items=availableCountries().filter(x=>!q||countryNorm(x.nome).includes(q)).slice(0,80);
 box.innerHTML=items.map(x=>`<button type="button" data-name="${escapeHtml(x.nome)}" data-code="${escapeHtml(x.codice||"")}" onpointerdown="selectPlaceCountry(${index},'${kind}',this);return false;">${escapeHtml(x.nome)}</button>`).join("");
 box.classList.toggle("hidden",items.length===0);
}
function selectPlaceCountry(index,kind,button){
 const g=getGuest(index);if(!g)return;
 const field=placeField(index,kind);if(!field)return;
 const name=button.dataset.name||"", code=button.dataset.code||"";
 const italian=countryNorm(name)==="ITALIA" || String(code)==="100000100";
 field.dataset.countrySelected="1";field.dataset.countryCode=code;
 field.dataset.municipalitySelected="0";field.dataset.municipalityCode="";field.dataset.municipalityProvince="";
 if(italian){
   // Per l'Italia Alloggiati Web non accetta lo Stato come luogo di nascita/rilascio:
   // deve essere indicato il Comune. Dopo aver selezionato ITALIA, svuotiamo il campo
   // e lo trasformiamo immediatamente nella ricerca del Comune.
   field.value="";
   field.dataset.countrySelected="0";
   field.dataset.countryCode=code;
   if(kind==='birth'){g.dataset.birthplaceManual="1";g.dataset.birthplaceAutoValue="";g.dataset.birthStateCode=code;g.dataset.birthProvince="";}
   else{g.dataset.issuingPlaceManual="1";g.dataset.issuingPlaceAutoValue="";g.dataset.issuingStateCode=code;}
   clearPlaceSuggestions(index,kind);
   const h=placeHint(index,kind);if(h)h.textContent="Italia selezionata: inserisci e seleziona il Comune dall'elenco Alloggiati Web.";
   setTimeout(()=>{try{field.focus()}catch(e){}},0);
   return;
 }
 field.value=name;
 if(kind==='birth'){g.dataset.birthplaceManual="1";g.dataset.birthplaceAutoValue="";g.dataset.birthStateCode=code;g.dataset.birthProvince="";}
 else{g.dataset.issuingPlaceManual="1";g.dataset.issuingPlaceAutoValue="";g.dataset.issuingStateCode=code;}
 clearPlaceSuggestions(index,kind);
 const h=placeHint(index,kind);if(h)h.textContent=`Selezionato: ${name}${code?` — codice Alloggiati ${code}`:''}`;
}
function handlePlaceFocus(index,kind){
 const g=getGuest(index);if(!g)return;
 const c=g.querySelector('[data-f="cittadinanza"]')?.value?.trim();
 if(!isItalianNationality(c)){
   renderPlaceCountrySuggestions(index,kind,(placeField(index,kind)?.value||"")===String(g.dataset.birthplaceAutoValue||g.dataset.issuingPlaceAutoValue||"")?"":(placeField(index,kind)?.value||""));
 }
}
function handlePlaceInput(index,kind){
 const g=getGuest(index);if(!g)return;
 const c=g.querySelector('[data-f="cittadinanza"]')?.value?.trim();
 const field=placeField(index,kind);if(!field)return;
 if(!isItalianNationality(c)){
   field.dataset.countrySelected="0";field.dataset.countryCode="";
   if(kind==='birth')markBirthplaceManual(index);else markIssuingPlaceManual(index);
   renderPlaceCountrySuggestions(index,kind,field.value||"");
   return;
 }
 field.dataset.municipalitySelected="0";field.dataset.municipalityCode="";field.dataset.municipalityProvince="";
 if(kind==='birth')markBirthplaceManual(index);else markIssuingPlaceManual(index);
 searchMunicipalities(index,kind);
}
function selectMunicipality(index,kind,button){
 const g=getGuest(index);if(!g)return;
 const field=placeField(index,kind);if(!field)return;
 const name=button.dataset.name||"";
 field.value=name;field.dataset.municipalitySelected="1";field.dataset.municipalityCode=button.dataset.code||"";field.dataset.municipalityProvince=button.dataset.prov||"";
 if(kind==='birth'){g.dataset.birthplaceManual="1";g.dataset.birthplaceAutoValue="";g.dataset.birthProvince=button.dataset.prov||"";}
 else{g.dataset.issuingPlaceManual="1";g.dataset.issuingPlaceAutoValue="";}
 clearPlaceSuggestions(index,kind);
 const h=placeHint(index,kind);if(h)h.textContent=`Selezionato: ${name}${button.dataset.prov?` (${button.dataset.prov})`:''}`;
}
function handlePlaceBlur(index,kind){
 setTimeout(async()=>{
   const g=getGuest(index);if(!g)return;
   const c=g.querySelector('[data-f="cittadinanza"]')?.value?.trim();
   const field=placeField(index,kind);if(!field)return;
   if(!isItalianNationality(c)){
     clearPlaceSuggestions(index,kind);
     if(field.dataset.countrySelected==="1")return;
     const typed=countryNorm(field.value||"");
     if(!typed){return;}
     await loadOfficialCountries();
     const exact=availableCountries().find(x=>countryNorm(x.nome)===typed);
     if(exact){selectPlaceCountry(index,kind,{dataset:{name:exact.nome,code:exact.codice||""}});return;}
     // Evita di salvare testo libero che Alloggiati Web non riconoscerà.
     field.value="";
     const h=placeHint(index,kind);if(h)h.textContent="Seleziona uno Stato dall'elenco ufficiale Alloggiati Web.";
     return;
   }
   clearPlaceSuggestions(index,kind);
   if(field.value.trim() && field.dataset.municipalitySelected!=="1"){
     field.value="";
     if(kind==='birth')g.dataset.birthProvince="";
     const h=placeHint(index,kind);if(h)h.textContent="Seleziona un Comune dall'elenco per evitare errori.";
   }
 },150);
}
function collectGuests(){
 return [...document.querySelectorAll(".guest")].map(g=>{
   const o=Object.fromEntries([...g.querySelectorAll("[data-f]")].map(x=>[x.dataset.f,x.value]));
   if(o.cittadinanza_code) o.cittadinanza_code=String(o.cittadinanza_code).trim();
   if(g.dataset.birthStateCode) o.stato_nascita_code=String(g.dataset.birthStateCode).trim();
   if(g.dataset.issuingStateCode) o.stato_documento_code=String(g.dataset.issuingStateCode).trim();
   if(g.dataset.birthMunicipality) o.luogo_nascita=String(g.dataset.birthMunicipality).trim();
   if(g.dataset.issuingMunicipality) o.luogo_rilascio_documento=String(g.dataset.issuingMunicipality).trim();
   if(o.cittadinanza && isItalianNationality(o.cittadinanza)){
     o.provincia_nascita=String(g.dataset.birthProvince||g.querySelector('[data-f="luogo_nascita"]')?.dataset.municipalityProvince||"").toUpperCase();
   }
   // I campi documento degli ospiti successivi sono nascosti nell'interfaccia,
   // ma restano necessari per Alloggiati Web quando il documento è stato letto.
   // Non eliminarli dalla struttura dati: sono valorizzati dai dati MRZ/OCR.
   return o;
 });
}
async function saveStay(){setNightsFromDates();if(!arrival.value||!departure.value||Number(nights.value)<1){show("saveMsg","Controlla arrivo e partenza: la partenza deve essere successiva all'arrivo.");return}const gs=collectGuests();const r=await api("/api/stays",{method:"POST",body:JSON.stringify({arrival:arrival.value,nights:Number(nights.value),departure:departure.value,guests:gs})});const j=await r.json();show("saveMsg",j.ok?`Check-in salvato. ID ${j.id}`:(j.error||"Errore")); if(j.ok){document.getElementById("sendBox").classList.remove("hidden");window.lastStayId=j.id}}

function mrzDate(v){if(!/^[0-9]{6}$/.test(v))return "";const yy=Number(v.slice(0,2)),mm=v.slice(2,4),dd=v.slice(4,6);const year=yy>=50?1900+yy:2000+yy;return `${year}-${mm}-${dd}`}

let activeGuestIndex=0;

function getGuest(index){return document.querySelector(`.guest[data-guest-index="${index}"]`)}
function scanGuestMrz(index){
 activeGuestIndex=index;
 const title=document.getElementById("scanTitle");
 if(title)title.textContent=`Scansione documento — Ospite ${index+1}`;
 startMrzScanner();
}

function mrzRawLines(raw){
 let s=String(raw||"").replace(/\r/g,"\n");
 // Remove diagnostic text that web-mrz-reader can append after the MRZ.
 s=s.split(/\n\nWarning:/i)[0];
 const lines=s.split(/\n+/).map(x=>x.trim()).filter(Boolean);
 return lines;
}
function repairMrzSeparators(raw){
 const lines=mrzRawLines(raw);
 if(!lines.length)return "";
 // OCR engines sometimes return visually similar glyphs instead of the MRZ filler '<'.
 const fixFillers=v=>String(v||"").replace(/[‹›«»﹤﹥＜＞≤≥≪≫]/g,"<").replace(/[=]/g,"<");
 const cleaned=lines.map(fixFillers);
 // The name field is the only MRZ area where '<' carries semantic meaning:
 // one separator between surname/given-name sections and additional fillers between names.
 // If OCR emits spaces there, convert them to the MRZ filler character.
 if(cleaned.length===2 && cleaned[0].length>=44){
   const name=cleaned[0].slice(5,44).replace(/\s+/g,"<");
   cleaned[0]=cleaned[0].slice(0,5)+name;
 }else if(cleaned.length===2 && cleaned[0].length>=36){
   const name=cleaned[0].slice(2,36).replace(/\s+/g,"<");
   cleaned[0]=cleaned[0].slice(0,2)+name;
 }else if(cleaned.length>=3 && cleaned[0].length>=30){
   const name=cleaned[2].replace(/\s+/g,"<");
   cleaned[2]=name;
 }
 return cleaned.join("\n");
}
function mrzParsedScore(p){
 if(!p||typeof p!=="object")return -1;
 let score=0;
 const v=p.Validation;
 if(v?.isValid===true)score+=1000;
 for(const k of ["Surname","Given Names","Document Number","Nationality","Issuing Country","Date of Birth","Gender"]) if(String(p[k]||"").trim())score+=10;
 const sn=String(p.Surname||"").trim(),gn=String(p["Given Names"]||"").trim();
 if(sn)score+=Math.min(20,sn.length);
 if(gn)score+=Math.min(20,gn.length);
 return score;
}
async function applyMrzResult(result){
 await loadOfficialCountries();
 let p=result?.parsed;
 if(!p || typeof p!=="object") return false;
 // Keep the library as the primary MRZ engine, but add a conservative repair pass
 // for OCR substitutions of '<' in the name field. Re-parse only when the repaired
 // text produces an equal or better structured result.
 try{
   const raw=repairMrzSeparators(result?.raw);
   if(raw){
     const mod=await loadMrzLibrary();
     if(typeof mod.parseMrz==="function"){
       const repaired=mod.parseMrz(raw);
       if(mrzParsedScore(repaired)>=mrzParsedScore(p))p=repaired;
     }
   }
 }catch(e){}
 const g=getGuest(activeGuestIndex); if(!g) return false;
 const get=(...keys)=>{for(const k of keys){if(p[k]!=null&&String(p[k]).trim()!=="")return String(p[k]).trim()}return ""};
 const sex=get("Gender");
 const nationality=countryName(get("Nationality"));
 const issuing=countryName(get("Issuing Country"));
 const data={
   nome:get("Given Names"),
   cognome:get("Surname"),
   nascita:mrzDate(get("Date of Birth")),
   sesso:sex==="Male"?"M":sex==="Female"?"F":"",
   cittadinanza:nationality,
   tipo_documento:p["Passport Number"]?"Passaporto":"Carta d'identità",
   numero_documento:get("Passport Number","Document Number")
 };
 for(const [k,v] of Object.entries(data)){const el=g.querySelector(`[data-f="${k}"]`);if(el&&v)el.value=v}
 // Dopo aver letto la cittadinanza dalla MRZ, applica immediatamente la regola
 // del luogo di nascita/rilascio: per stranieri = Paese; per italiani = Comune.
 if(nationality){
   const citEl=g.querySelector('[data-f="cittadinanza"]');
   const codeEl=g.querySelector('[data-f="cittadinanza_code"]');
   const match=officialCountries.find(x=>countryNorm(x.nome)===countryNorm(nationality));
   if(citEl&&match){citEl.value=match.nome;citEl.dataset.countrySelected="1";citEl.dataset.countryCode=match.codice;if(codeEl)codeEl.value=match.codice;}
   syncPlacesFromNationality(activeGuestIndex);
 }
 const validation=p.Validation;
 return validation?.isValid===true;
}

async function loadMrzLibrary(){
 if(window.__mrzModule)return window.__mrzModule;
 show("mrzMsg","Caricamento del lettore MRZ…");
 const mod=await import("https://esm.sh/web-mrz-reader@2.0.3");
 window.__mrzModule=mod;
 return mod;
}

async function startMrzScanner(){
 if(mrzStarting)return;
 mrzStarting=true;
 document.getElementById("mrzPanel").classList.remove("hidden");
 try{
   // Cleanly dispose of any previous reader before opening the camera again.
   if(mrzReader){try{mrzReader.stop()}catch(e){} mrzReader=null}
   const host=document.getElementById("mrz-reader");
   host.innerHTML="";
   await new Promise(r=>setTimeout(r,350));
   const {initMRZReader}=await loadMrzLibrary();
   mrzReader=initMRZReader({
     container:"#mrz-reader",
     workerPath:"https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js",
     corePath:"https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/",
     langPath:"https://cdn.jsdelivr.net/npm/web-mrz-reader@2.0.3/public/model/",
     drawBoundingBoxes:true,
     scanRegion:{left:0.05,top:0.52,width:0.90,height:0.40},
     onResult:(result)=>{
       const valid=applyMrzResult(result);
       if(valid){
         show("mrzMsg",`✓ Documento di Ospite ${activeGuestIndex+1} letto e verificato. I dati sono stati inseriti in questo ospite.`);
         document.getElementById("docResult").className="result-box";
         document.getElementById("docResult").textContent=`✓ Documento di Ospite ${activeGuestIndex+1} riconosciuto. I dati sono stati compilati automaticamente.`;
         setTimeout(()=>stopMrzScanner(),500);
       }else{
         show("mrzMsg","Documento letto, ma i controlli MRZ non sono tutti validi. Riprova mantenendo nitide e complete le righe MRZ.");
       }
     },
     onError:(err)=>show("mrzMsg","Lettura MRZ: "+(err||"riprova con il documento più vicino e ben illuminato."))
   });
   await mrzReader.capture();
 }catch(e){
   show("mrzMsg","Impossibile avviare il lettore MRZ. Verifica di aver autorizzato la fotocamera e che il browser sia aggiornato.");
 }finally{
   mrzStarting=false;
 }
}
async function captureMrz(){
 if(!mrzReader){await startMrzScanner();return}
 try{await mrzReader.capture()}catch(e){show("mrzMsg","Acquisizione non riuscita. Riprova tenendo ferme le righe MRZ nell'area indicata.")}
}
async function stopMrzScanner(){
 if(mrzReader){try{mrzReader.stop()}catch(e){} mrzReader=null}
 const host=document.getElementById("mrz-reader");
 if(host)host.innerHTML="";
 if(cieStream){cieStream.getTracks().forEach(t=>t.stop());cieStream=null}
 document.getElementById("cieOcrBox")?.classList.add("hidden");
 document.getElementById("mrzPanel").classList.add("hidden");
 // Give iOS/Safari time to release the previous MediaStream before the next guest.
 await new Promise(r=>setTimeout(r,350));
}

let cieStream=null;
async function startCieOcr(){
 const box=document.getElementById("cieOcrBox"),video=document.getElementById("cieVideo");
 box.classList.remove("hidden");
 show("cieOcrMsg","Avvio fotocamera…");
 try{
   if(cieStream){cieStream.getTracks().forEach(t=>t.stop());cieStream=null}
   cieStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1080}},audio:false});
   video.srcObject=cieStream; await video.play();
   show("cieOcrMsg","Posiziona il fronte della CIE ben visibile e premi Acquisisci.");
 }catch(e){show("cieOcrMsg","Impossibile accedere alla fotocamera per l'OCR. Controlla il permesso del browser.")}
}

async function captureCieOcr(){
 const video=document.getElementById("cieVideo"),canvas=document.getElementById("cieCanvas");
 if(!video.videoWidth){show("cieOcrMsg","Fotocamera non pronta. Riprova tra un secondo.");return}
 // La guida mantiene un rapporto quasi identico alla CIE. Usiamo quindi solo la
 // porzione centrale della ripresa, evitando sfondo, volto dell'operatore e testo esterno.
 const vw=video.videoWidth,vh=video.videoHeight;
 const guideW=vw*0.92;
 const guideH=guideW*(54/85.6);
 const sx=(vw-guideW)/2, sy=Math.max(0,(vh-guideH)/2);
 canvas.width=Math.round(guideW);canvas.height=Math.round(guideH);
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 ctx.drawImage(video,sx,sy,guideW,guideH,0,0,canvas.width,canvas.height);
 // Correzione leggera del contrasto: niente soglie aggressive che possono distruggere
 // i caratteri laser della CIE.
 const img=ctx.getImageData(0,0,canvas.width,canvas.height),d=img.data;
 for(let i=0;i<d.length;i+=4){
   const y=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2];
   const v=Math.max(0,Math.min(255,(y-118)*1.18+128));
   d[i]=d[i+1]=d[i+2]=v;
 }
 ctx.putImageData(img,0,0);
 show("cieOcrMsg","Analisi CIE in corso: lettura per campi…");
 try{
   const {createWorker}=await import("https://esm.sh/tesseract.js@5.1.1");
   const worker=await createWorker("ita+eng");
   try{await worker.setParameters({preserve_interword_spaces:"1",user_defined_dpi:"300"})}catch(e){}
   const result=await parseCieByRegions(worker,canvas);
   await worker.terminate();
   applyCieStructuredResult(result);
 }catch(e){
   show("cieOcrMsg","OCR non riuscito. Riprova con la CIE ben allineata nel riquadro, senza riflessi.");
 }
}

function cropCanvas(source,rx,ry,rw,rh,scale=2){
 const sw=source.width,sh=source.height;
 const x=Math.max(0,Math.round(sw*rx)),y=Math.max(0,Math.round(sh*ry));
 const w=Math.min(sw-x,Math.round(sw*rw)),h=Math.min(sh-y,Math.round(sh*rh));
 const c=document.createElement("canvas");c.width=Math.max(1,Math.round(w*scale));c.height=Math.max(1,Math.round(h*scale));
 const cx=c.getContext("2d");cx.imageSmoothingEnabled=true;cx.drawImage(source,x,y,w,h,0,0,c.width,c.height);
 return c;
}
function normalizeFieldText(v){return normalizeOcrUpper(String(v||"")).replace(/[|¦]/g," ").replace(/[^A-Z0-9À-ÖØ-Ý'(). -]/g," ").replace(/\s+/g," ").trim()}
async function ocrRegion(worker,source,rx,ry,rw,rh,psm=7,whitelist=""){
 const c=cropCanvas(source,rx,ry,rw,rh,2.6);
 try{await worker.setParameters({tessedit_pageseg_mode:String(psm),preserve_interword_spaces:"1",user_defined_dpi:"300",tessedit_char_whitelist:whitelist||undefined})}catch(e){}
 const r=await worker.recognize(c);
 const text=normalizeFieldText(r?.data?.text||"");
 const conf=Number(r?.data?.confidence||0);
 return {text,confidence:conf};
}
async function parseCieByRegions(worker,source){
 // Coordinate are relative to the CIE itself, not to the whole camera image.
 // They follow the standard front layout visible on the Italian CIE.
 const out={};
 out.issuer=await ocrRegion(worker,source,.12,.20,.43,.18,7,"ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÌÒÙ' -()");
 out.surname=await ocrRegion(worker,source,.31,.35,.36,.10,7,"ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÌÒÙ' -");
 out.name=await ocrRegion(worker,source,.31,.43,.36,.10,7,"ABCDEFGHIJKLMNOPQRSTUVWXYZÀÈÉÌÒÙ' -");
 out.birth=await ocrRegion(worker,source,.31,.51,.40,.17,6,"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ÀÈÉÌÒÙ'().- / ");
 out.sex=await ocrRegion(worker,source,.31,.64,.14,.13,7,"MF");
 out.nationality=await ocrRegion(worker,source,.64,.64,.24,.13,7,"ABCDEFGHIJKLMNOPQRSTUVWXYZ");
 out.serial=await ocrRegion(worker,source,.72,.04,.25,.17,7,"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
 return out;
}
function cleanStructuredPerson(v){
 let x=normalizeFieldText(v).replace(/\b(COGNOME|SURNAME|NOME|NAME)\b/g," ").replace(/\s+/g," ").trim();
 return x;
}
function cleanStructuredPlace(v){
 let x=normalizeFieldText(v).replace(/\b(CO[M]?UNE|COMUNE|MUNICIPALITY|LUOGO|PLACE|DATA|DATE|NASCITA|BIRTH|CARTA|IDENTITA|IDENTITY|CARD|EMISSIONE|ISSUING|SCADENZA|EXPIRY)\b/g," ").replace(/\s+/g," ").trim();
 return x;
}
function parseStructuredBirth(v){
 const x=normalizeFieldText(v);
 const dm=x.match(/\b(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})\b/);
 let date=dm?`${dm[3]}-${String(dm[2]).padStart(2,"0")}-${String(dm[1]).padStart(2,"0")}`:"";
 let place=dm?x.replace(dm[0]," ").replace(/\b(PLACE|LUOGO|DATA|DATE|NASCITA|BIRTH)\b/g," ").replace(/\s+/g," ").trim():x;
 return {place:cleanStructuredPlace(place),date};
}
function applyCieStructuredResult(r){
 const g=getGuest(activeGuestIndex);if(!g)return;
 const set=(f,v)=>{const el=g.querySelector(`[data-f="${f}"]`);if(el&&v)el.value=String(v).trim()};
 const surname=cleanStructuredPerson(r.surname?.text);
 const name=cleanStructuredPerson(r.name?.text);
 const birth=parseStructuredBirth(r.birth?.text||"");
 const issuer=cleanStructuredPlace(r.issuer?.text);
 const natRaw=normalizeFieldText(r.nationality?.text||""); const nat=officialCountries.find(x=>countryNorm(natRaw).includes(countryNorm(x.nome)))?.nome || (/\bITA\b/.test(natRaw)?"Italia":"");
 const sex=/\bF\b/.test(r.sex?.text||"")?"F":/\bM\b/.test(r.sex?.text||"")?"M":"";
 const serial=String(r.serial?.text||"").replace(/[^A-Z0-9]/g,"");
 // Non inseriamo mai un campo solo perché contiene del testo: ciascun campo
 // viene accettato solo se supera controlli minimi di forma.
 if(/^[A-ZÀ-ÖØ-Ý' -]{2,40}$/.test(surname)&&!/(COGNOME|SURNAME|NOME|NAME)/.test(surname))set("cognome",surname);
 if(/^[A-ZÀ-ÖØ-Ý' -]{2,40}$/.test(name)&&!/(COGNOME|SURNAME|NOME|NAME)/.test(name))set("nome",name);
 if(birth.date)set("nascita",birth.date);
 if(nat){set("cittadinanza",nat);const ce=g.querySelector('[data-f="cittadinanza_code"]');const cm=officialCountries.find(x=>countryNorm(x.nome)===countryNorm(nat));if(ce&&cm)ce.value=cm.codice;const citEl=g.querySelector('[data-f="cittadinanza"]');if(citEl&&cm){citEl.dataset.countrySelected="1";citEl.dataset.countryCode=cm.codice;}}
 if(sex)set("sesso",sex);
 set("tipo_documento","Carta d'identità");
 if(/^[A-Z0-9]{8,12}$/.test(serial))set("numero_documento",serial);
 // Il luogo di nascita e il Comune emettitore sono trattati separatamente.
 // Per un cittadino italiano li validiamo tramite l'elenco Comuni prima di
 // inserirli; se non c'è una corrispondenza non inseriamo testo OCR dubbio.
 const selectMunicipality=async(kind,value)=>{
   if(!isItalianNationality(g.querySelector('[data-f="cittadinanza"]')?.value||""))return;
   const clean=String(value||"").replace(/\s*\([A-Z]{2,3}\)\s*$/i,"").trim();
   if(!clean||clean.length<3)return;
   try{
     const rr=await api(`/api/comuni?q=${encodeURIComponent(clean)}`);const jj=await rr.json();
     if(!jj.ok||!Array.isArray(jj.items)||!jj.items.length)return;
     const exact=jj.items.find(x=>normalizeOcrUpper(x.nome)===normalizeOcrUpper(clean));
     // Se l'OCR non trova una corrispondenza esatta, non scegliamo il primo risultato:
     // potrebbe essere un Comune omonimo o una lettura errata.
     if(!exact)return;
     const field=placeField(activeGuestIndex,kind);if(!field)return;
     field.value=exact.nome;field.dataset.municipalitySelected="1";field.dataset.municipalityCode=exact.codice||"";field.dataset.municipalityProvince=exact.sigla||"";
     const hint=placeHint(activeGuestIndex,kind);if(hint)hint.textContent=`Selezionato: ${exact.nome}${exact.sigla?` (${exact.sigla})`:''}`;
     if(kind==='birth'){g.dataset.birthProvince=exact.sigla||"";g.dataset.birthplaceManual="1";}
     if(kind==='issue'){g.dataset.issuingPlaceManual="1";}
   }catch(e){}
 };
 Promise.all([selectMunicipality("birth",birth.place),selectMunicipality("issue",issuer)]).finally(()=>{
   if(!nat){
     // Per uno straniero il valore corretto è il Paese, non un testo OCR del fronte.
     // La cittadinanza affidabile arriva normalmente dalla MRZ; se manca, lasciamo
     // i luoghi vuoti per evitare dati errati.
   }
   show("cieOcrMsg","✓ Analisi completata. Ho inserito solo dati riconosciuti e verificati. Controlla i campi prima di salvare.");
   if(cieStream){cieStream.getTracks().forEach(t=>t.stop());cieStream=null}
 });
}

async function testService(service){show("serviceMsg",service==="alloggiati"?"Test Alloggiati in corso…":"Verifica endpoint ROSS 1000 in corso…");const r=await api(`/api/test/${service}`,{method:"POST"});const j=await r.json();if(j.ok){show("serviceMsg",service==="alloggiati"?"GenerateToken riuscito":"ROSS 1000: endpoint raggiungibile (HTTP "+j.http_status+"). Nessun movimento è stato inviato.")}else show("serviceMsg",j.error||j.detail||j.message||"Test non riuscito")}

async function sendService(service){
 if(!window.lastStayId){show("serviceMsg","Prima salva il check-in.");return}
 show("serviceMsg",service==="alloggiati"?"Invio ad Alloggiati Web in corso…":"Invio a ROSS 1000 in corso…");
 try{
  const r=await api(`/api/submit/${service}/${window.lastStayId}`,{method:"POST"});
  const j=await r.json();
  if(service==="alloggiati"){
    if(j.ok){show("serviceMsg",`Alloggiati: ${j.valid}/${j.total} schedine accettate.`);return}
    const errs=(Array.isArray(j.detail)?j.detail:[]).filter(x=>x&&((x.descrizione||x.dettaglio||x.codice))).map(x=>`Ospite: ${x.descrizione||x.dettaglio||x.codice}`).join(" | ");
    const general=j.general?.errore?`Errore generale: ${j.general.errore}`:"";
    show("serviceMsg",errs||general||j.error||"Alloggiati: invio non riuscito.");
    return;
  }
  show("serviceMsg",j.ok?(j.message||"ROSS 1000: invio riuscito."):(j.error||j.detail||"ROSS 1000: invio non riuscito."));
 }catch(e){show("serviceMsg",`Errore di comunicazione: ${e.message||e}`)}
}

function showHistory(){api("/api/stays").then(r=>r.json()).then(rows=>show("serviceMsg",`Storico: ${rows.length} soggiorni presenti.`))}

document.getElementById("arrival").addEventListener("change",()=>setDepartureFromNights());
document.getElementById("departure").addEventListener("change",setNightsFromDates);
document.getElementById("nights").addEventListener("change",setDepartureFromNights);
if(token){document.getElementById("login").classList.add("hidden");document.getElementById("app").classList.remove("hidden");syncGuests();setDepartureFromNights();loadOfficialLookups().catch(()=>{})}
