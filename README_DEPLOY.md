# CheckIn Lazio V35

V35 include:
- cronologia persistente dei check-in salvati;
- cronologia dettagliata delle trasmissioni Alloggiati Web e ROSS 1000;
- salvataggio della richiesta XML inviata e della risposta ricevuta, per il confronto;
- possibilità di selezionare uno storico e riutilizzarlo per una nuova trasmissione;
- pulsante ROSS 1000 “Ritrasmetti/modifica” che mantiene gli stessi `idswh` del soggiorno e ritrasmette il movimento del giorno di arrivo, secondo il tracciato XML ROSS 1000;
- mantenimento delle correzioni già presenti per MRZ/ICAO, gruppi/famiglie, tabelle ufficiali Alloggiati e campi automatici.

## Deploy

Sostituire i file del repository con quelli contenuti nello ZIP e lasciare che Render esegua il deploy automatico.

Le variabili d'ambiente già utilizzate restano necessarie:
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

Il database SQLite mantiene le tabelle `stays` e `submissions`; V35 aggiunge automaticamente le colonne necessarie alla cronologia senza richiedere una migrazione manuale.
