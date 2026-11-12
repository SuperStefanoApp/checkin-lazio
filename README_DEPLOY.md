# CheckIn Lazio V8

V8 aggiunge un pulsante **Verifica ROSS 1000** nella sezione Trasmissioni.
Il controllo verifica la configurazione e raggiungibilità dell'endpoint ROSS senza inviare alcun movimento.

## Environment
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

Il pulsante **Invia a ROSS 1000** resta disponibile dopo il salvataggio di un soggiorno e costituisce invece l'invio della movimentazione.

V9
- Corretto il test ROSS 1000: la V8 faceva una GET diretta su /ws/checkinV2, che può restituire HTTP 500 perché il servizio è SOAP e richiede POST.
- Il test V9 interroga il WSDL /ws/checkinV2?wsdl con Basic Authentication.
- Il test non invia alcun movimento turistico.

V10
- Corretto un errore di sintassi JavaScript introdotto nel test ROSS 1000 della V9.
- Il test ROSS ora può essere avviato senza l'errore "Invalid regular expression flags".

V12
- Ripristinata la struttura del blocco MRZ della V10, che era funzionante.
- Aggiunta la Tipologia Alloggiato e i campi documento senza modificare il ciclo di avvio del lettore MRZ.
- Ogni ospite mantiene il proprio indice e il proprio pulsante di scansione.
- Per Familiare/Membro gruppo i campi documento sono nascosti e rimossi dal payload.
