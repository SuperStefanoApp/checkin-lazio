# CheckIn Lazio — V31 MRZ/ICAO

Questa versione mantiene tutte le funzioni della V30 e aggiunge un parser MRZ strutturale basato sulle regole ICAO per i documenti di viaggio.

## Correzione principale
- Analisi della struttura ICAO della MRZ, non solo del testo OCR.
- Nei passaporti TD3 viene interpretato il campo nome in posizione fissa.
- `<<` viene usato come separatore prioritario tra cognome e nomi.
- Le singole `<` vengono interpretate come separatori tra più componenti del cognome/nome e come filler.
- Vengono gestiti anche caratteri OCR simili a `<`.
- Se l'OCR sostituisce i separatori `<<` con una doppia spaziatura, viene tentata una ricostruzione prudente del confine cognome/nome.
- Quando la seconda riga è disponibile, vengono letti i campi a posizione fissa ICAO (numero documento, cittadinanza, data di nascita, sesso, Stato emittente).
- Per i campi con check digit vengono usati i controlli ICAO prima di sovrascrivere i dati del parser principale.

## Esempio
Per una MRZ come:

`P<BRAPESSOA<SANTOS<JUNIOR<<CARLOS<ALBERTO<<<`

il parser interpreta:
- Cognome: `PESSOA SANTOS JUNIOR`
- Nome: `CARLOS ALBERTO`

## Deploy
Sostituire i file del progetto GitHub con quelli contenuti nello ZIP e lasciare che Render esegua il deploy automatico.
