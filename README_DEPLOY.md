# CheckIn Lazio V37 - Alloggiati + storico + IDSWH ROSS persistente

Questa revisione parte dalla V37 e modifica esclusivamente:
- gestione/invio Alloggiati Web;
- storico dei check-in e delle trasmissioni;
- generazione e persistenza degli idswh ROSS 1000.

Non modifica il lettore MRZ/OCR.

## Alloggiati Web

- Il tracciato continua a essere costruito secondo il record ufficiale di 168 caratteri.
- Prima dell'invio viene eseguito il controllo ufficiale `Test` (oppure `GestioneAppartamenti_Test` se è configurato l'ID appartamento).
- Se il controllo rileva un errore, il sistema mostra il codice e la descrizione restituiti da Alloggiati invece di tentare l'invio.
- L'invio effettivo avviene solo se il controllo preliminare è valido.
- Il codice usa il Web Service ufficiale Alloggiati.

## Storico

La cronologia mantiene:
- soggiorni e ospiti inseriti;
- richieste XML;
- risposte ricevute;
- esiti delle comunicazioni;
- modifica/recupero del soggiorno.

## ROSS 1000 - idswh

Gli idswh non sono più ricavati direttamente dall'ID SQLite del soggiorno.

Ogni nuovo soggiorno riceve un progressivo persistente, ad esempio:
- primo soggiorno con 2 ospiti: `CL20261-1`, `CL20261-2`
- secondo soggiorno con 2 ospiti: `CL20262-1`, `CL20262-2`
- terzo soggiorno con 1 ospite: `CL20263-1`

Gli identificativi vengono salvati nella tabella `stays` e vengono riutilizzati nelle ritrasmissioni/modifiche dello stesso soggiorno.

## Persistenza Render

Il database è configurato su `/var/data/checkin.db` tramite disco persistente Render. Questo è necessario affinché il progressivo ROSS e lo storico non ripartano da zero quando il processo viene riavviato o il container viene ricreato.

Le variabili d'ambiente necessarie restano:
- ADMIN_USER
- ADMIN_PASSWORD
- SESSION_SECRET
- ALLOGGIATI_USER
- ALLOGGIATI_PASSWORD
- ALLOGGIATI_WSKEY
- ROSS_USER
- ROSS_PASSWORD
- ROSS_STRUCTURE_CODE
- ROSS_ENDPOINT
- opzionale: ALLOGGIATI_ID_APPARTAMENTO
