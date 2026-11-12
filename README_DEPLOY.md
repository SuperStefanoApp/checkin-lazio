# CheckIn Lazio Cloud V4

Questa versione corregge due aspetti della V3:

1. **Calcolo date**: il calcolo usa date di calendario locali e non `toISOString()`, evitando lo spostamento di un giorno dovuto al fuso orario. Esempio: arrivo 12/11 + 3 notti = partenza 15/11.
2. **Lettura documento**: sostituito l'OCR generico della fotografia con un lettore MRZ dedicato (`web-mrz-reader`), progettato per MRZ TD1/TD2/TD3. La lettura e il parsing avvengono sul dispositivo; i check digit della MRZ vengono usati per rifiutare letture incoerenti. Il browser deve avere accesso alla fotocamera e deve essere in HTTPS.

## Deploy

Il progetto mantiene la stessa struttura e lo stesso servizio Render. Caricare tutti i file nella repository GitHub esistente `checkin-lazio` e fare commit. Render eseguirà automaticamente il nuovo deploy se `autoDeploy` è attivo.

## Nota importante sulla MRZ

La MRZ non è il chip NFC del documento. Questa versione legge la **zona a lettura ottica** stampata sul documento. La lettura del chip elettronico NFC richiede una tecnologia diversa e, in particolare su iPhone/Safari, non è disponibile come semplice funzione Web standard. Se in seguito vorremo leggere anche il chip NFC, servirà valutare un'app nativa/SDK dedicato.
