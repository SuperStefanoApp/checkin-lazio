# CheckIn Lazio Cloud

Questa è la versione cloud/PWA. Il telefono non deve avere Node.js: Node viene eseguito solo sul server.

## Deploy consigliato: Render

1. Crea un repository GitHub e carica tutti i file di questa cartella.
2. Su Render crea un nuovo Web Service dal repository.
3. Il file `render.yaml` è già predisposto.
4. Imposta le variabili:
   - ADMIN_USER
   - ADMIN_PASSWORD
   - ALLOGGIATI_USER
   - ALLOGGIATI_PASSWORD
   - ALLOGGIATI_WSKEY
   - ROSS_USER
   - ROSS_PASSWORD
   - ROSS_STRUCTURE_CODE
5. Deploy.
6. Apri l'URL HTTPS dal telefono e aggiungilo alla schermata Home.

## Sicurezza

Le credenziali dei servizi pubblici restano sul backend. Non vanno inserite nel JavaScript del telefono.

## Alloggiati Web

Il backend usa il Web Service ufficiale e implementa `GenerateToken`. Prima di abilitare l'invio reale va completata e verificata la mappatura dei campi/schedine della specifica della struttura.

## ROSS 1000 Lazio

Endpoint preconfigurato:
https://lazioturismo.ross1000.it/ws/checkinV2

Il codice struttura e le credenziali WS sono variabili server.

## Nota importante

Questa build è una base cloud realmente deployabile, ma non deve essere usata per trasmissioni reali finché non viene completata la mappatura ufficiale dei campi Alloggiati e del metodo SOAP/XML ROSS 1000 della Regione Lazio. Non sono state inventate chiamate o tracciati per simulare un invio riuscito.
