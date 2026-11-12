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

V11
- Ogni ospite ha una Tipologia Alloggiato: Ospite singolo, Capo famiglia, Capo gruppo, Familiare, Membro gruppo.
- La scansione MRZ è disponibile per ogni ospite, indipendentemente dalla tipologia, e compila automaticamente i dati leggibili.
- Per Familiare/Membro gruppo i tre campi documento vengono nascosti e rimossi dal payload della schedina Alloggiati.
- Per gli ospiti con documento richiesto sono presenti Tipologia documento, Luogo di rilascio e Numero documento.
- Il luogo di rilascio non viene ricavato dalla MRZ perché la MRZ non contiene il comune/luogo di rilascio: resta compilabile manualmente.
