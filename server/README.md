# Quantum Phone Voice Backend

Backend minimo para que `https://iphone.infiniti-ia.com` funcione como softphone real con Twilio Voice.

## Endpoints

- `GET /health`: confirma que el servicio esta vivo.
- `GET /api/twilio-token`: entrega un Access Token temporal para `Twilio.Device`.
- `POST /voice`: TwiML App Voice URL; marca numeros reales con `<Dial><Number>`.

## Configuracion

1. Copia `.env.example` a `.env`.
2. Completa las variables de Twilio.
3. En Twilio Console, crea una TwiML App y apunta la Voice Request URL a:

```text
https://TU-BACKEND.com/voice
```

4. Despliega este folder en Heroku, Render, Railway, Fly.io o cualquier Node host con HTTPS.
5. En el Quantum Phone, guarda la URL base del backend, por ejemplo:

```text
https://TU-BACKEND.com
```

El frontend valida numeros E.164 como `+50688888888` antes de intentar llamar.
