# CheckIn Lazio V35 FIXED

Correzione di packaging della V35: `public/index.html` è stato ripristinato come pagina HTML completa.

Il `server.js` mantiene la logica V35 per:
- Alloggiati Web
- ROSS 1000
- progressione persistente degli IDsWH
- cronologia e payload delle trasmissioni

Il lettore MRZ/OCR/ICAO del frontend non è stato modificato rispetto alla base frontend utilizzata.

Deploy: sostituire i file del repository con quelli presenti in questo archivio e lasciare che Render effettui il deploy.
