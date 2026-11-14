# CheckIn Lazio — V16

## Modifiche principali
- Dati generali: data di arrivo, numero pernottamenti e data di partenza calcolata automaticamente.
- Ospite 1: tipologia, cittadinanza, luogo di nascita, cognome, nome, data di nascita, sesso, tipologia documento, luogo di rilascio e numero documento.
- Ospiti successivi: tipologia automatica, cittadinanza, luogo di nascita, cognome, nome, data di nascita e sesso. I campi documento non vengono mostrati.
- Se Ospite 1 è Capo famiglia, gli ospiti successivi diventano automaticamente Familiari.
- Se Ospite 1 è Capo gruppo, gli ospiti successivi diventano automaticamente Membri gruppo.
- Ogni ospite ha il proprio pulsante di scansione e una schermata dedicata alla fotocamera.
- Scansione disponibile in modalità MRZ e OCR CIE.
- Il luogo di nascita viene precompilato con la cittadinanza finché l'utente non lo modifica manualmente.

## Deploy
1. Estrai lo ZIP.
2. Carica/sostituisci i file nel repository GitHub `SuperStefanoApp/checkin-lazio`.
3. Commit changes.
4. Attendi il redeploy automatico di Render.
5. Apri il link Render e verifica prima il login, poi un nuovo check-in.


## Alloggiati Web - Gestione Appartamenti
Se l'utenza Alloggiati è di categoria Gestione Appartamenti, impostare su Render la variabile `ALLOGGIATI_ID_APPARTAMENTO` con l'ID numerico dell'appartamento attivo visibile in Alloggiati Web > Appartamenti > Elenco.

## V23 — Cittadinanza da tabella ufficiale Alloggiati Web
La cittadinanza è ora un selettore interno all'app, con ricerca e elenco, non un campo di testo libero. Dopo l'accesso l'app carica la tabella `Nazioni` tramite il Web Service ufficiale Alloggiati Web usando le credenziali server già configurate. Ogni selezione conserva nome dello Stato e codice Alloggiati associato (`cittadinanza_code`). Il campo non accetta valori liberi non presenti nell'elenco. L'elenco viene memorizzato in cache sul server per 6 ore.
