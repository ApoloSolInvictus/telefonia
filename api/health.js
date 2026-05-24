import { jsonResponse, optionsResponse } from "../lib/vercel-shared.js";

export function OPTIONS(request) {
  return optionsResponse(request);
}

export function GET(request) {
  return jsonResponse(request, {
    ok: true,
    service: "quantum-phone-vercel-backend",
    twilioConfigured: Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_API_KEY_SID &&
      process.env.TWILIO_API_KEY_SECRET &&
      process.env.TWILIO_TWIML_APP_SID &&
      process.env.TWILIO_CALLER_ID
    )
  });
}
