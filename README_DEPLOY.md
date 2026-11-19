# CheckIn Lazio – V37 Tabelle ufficiali Alloggiati Web

Questa versione mantiene invariata la parte frontend di V37, compresi lettura MRZ, OCR e ICAO.

## Correzione principale
- Le tabelle usate per Alloggiati Web vengono recuperate dai download ufficiali della Polizia di Stato:
  - Comuni
  - Stati
  - Tipo Documento
  - Tipo Alloggiato
- Il download ufficiale viene gestito sia se restituisce CSV diretto sia se restituisce un archivio ZIP.
- Le codifiche usate nella generazione del tracciato Alloggiati vengono prese dalle stesse tabelle ufficiali.
- Per la ricerca dei comuni dell'interfaccia viene usata la tabella ufficiale Alloggiati, non un dataset esterno.
- È stato eliminato il fallback non documentato verso `Nazioni` nel Web Service Alloggiati.
- Il Web Service continua a essere usato per autenticazione/token e per le tabelle per cui il manuale ufficiale documenta il metodo `Tabella`.

## Environment
Mantieni le variabili già presenti in Render:
- ADMIN_USER
- ADMIN_PASSWORD
- SESSION_SECRET
- ALLOGGIATI_USER
- ALLOGGIATI_PASSWORD
- ALLOGGIATI_WSKEY
- ROSS_USER
- ROSS_PASSWORD
- ROSS_STRUCTURE_CODE
- ROSS_ENDPOINT=https://lazioturismo.ross1000.it/ws/checkinV2

Non sono state modificate le funzioni ROSS 1000 né la parte MRZ/OCR/ICAO.
