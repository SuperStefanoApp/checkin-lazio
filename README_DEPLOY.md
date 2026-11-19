# CheckIn Lazio V37 - Tabelle ufficiali Alloggiati + IDsWH ROSS persistenti

Questa build mantiene la V37 con:
- tabelle ufficiali Alloggiati Web;
- cronologia soggiorni e trasmissioni;
- MRZ/OCR/ICAO del frontend invariati;
- ROSS 1000 invariato nella struttura SOAP e nei campi già presenti.

## Correzione IDsWH ROSS 1000

Gli IDsWH non vengono più ricavati dall'ID SQLite del soggiorno.

Ora:
- al salvataggio del check-in viene assegnato un ID diverso a ogni ospite;
- per esempio, un soggiorno con 3 ospiti può ricevere `CL20261-1`, `CL20261-2`, `CL20261-3`;
- il soggiorno successivo riceve una nuova progressione, ad esempio `CL20262-1`, `CL20262-2`;
- la sequenza viene salvata nel database e quindi non viene ricreata da `1` a ogni riavvio del processo;
- se una vecchia comunicazione ROSS è già presente nello storico ma non aveva ancora `ross_ids_json`, gli IDsWH vengono recuperati dal payload XML già trasmesso;
- nelle rettifiche/modifiche gli IDsWH della comunicazione precedente vengono mantenuti.

## Nota sulla persistenza

La sequenza è persistita nel database SQLite usato dall'applicazione. Per mantenere lo storico e la progressione anche dopo la ricreazione completa del container Render, il percorso `DB_PATH` deve essere su storage persistente di Render.

Deploy: sostituire i file del repository con quelli presenti in questo archivio e lasciare che Render effettui il deploy.
