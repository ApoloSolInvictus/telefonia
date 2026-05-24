# Quantum Phone Invictus

Softphone web con asistencia satelital visual. El frontend es estatico y el backend real de voz puede correr en Vercel Functions.

## Vercel

Vercel despliega cualquier archivo dentro de `/api` como una Function de Node.js. Este repo incluye:

- `api/health.js`
- `api/twilio-token.js`
- `api/voice.js`

Variables necesarias en Vercel:

```text
TWILIO_ACCOUNT_SID=
TWILIO_API_KEY_SID=
TWILIO_API_KEY_SECRET=
TWILIO_TWIML_APP_SID=
TWILIO_CALLER_ID=+1XXXXXXXXXX
ALLOWED_ORIGIN=https://iphone.infiniti-ia.com
```

Configura la TwiML App de Twilio con esta Voice Request URL:

```text
https://TU-PROYECTO.vercel.app/api/voice
```

Si conectas `iphone.infiniti-ia.com` directamente a Vercel, el frontend usara automaticamente el mismo dominio como backend.
