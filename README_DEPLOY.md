# CheckIn Lazio V33

## V33 – MRZ ICAO fallback
- The ICAO parser now runs even when `web-mrz-reader` returns no parsed object.
- Raw OCR MRZ lines can populate the guest fields through the internal ICAO parser.
- A failed third-party validation/check digit no longer prevents structurally recognized MRZ data from being inserted.
- Existing MRZ, country, document and municipality logic is preserved.

Deploy the contents of this folder in the repository root and let Render redeploy.
