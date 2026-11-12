# CheckIn Lazio V7

V7 mantiene login, check-in, calcolo notti, MRZ multi-ospite e aggiunge l'integrazione backend con:
- Alloggiati Web: GenerateToken, download tabelle, costruzione tracciato 168 caratteri, Test/Send tramite SOAP.
- ROSS 1000 Lazio: inviaMovimentazione SOAP con Basic Auth e tracciato XML v2.4.

## Variabili Render
Obbligatorie per l'app:
ADMIN_USER
ADMIN_PASSWORD
SESSION_SECRET

Alloggiati:
ALLOGGIATI_USER
ALLOGGIATI_PASSWORD
ALLOGGIATI_WSKEY

ROSS:
ROSS_USER
ROSS_PASSWORD
ROSS_STRUCTURE_CODE
ROSS_ENDPOINT=https://lazioturismo.ross1000.it/ws/checkinV2
ROSS_PRODUCT=CheckIn Lazio
ROSS_TOURISM_DEFAULT=Non Specificato
ROSS_TRANSPORT_DEFAULT=Non specificato
ROSS_CHANNEL_DEFAULT=Non specificato
ROSS_ROOMS_AVAILABLE=1
ROSS_BEDS_AVAILABLE=1

Le credenziali dei servizi restano esclusivamente lato server.
