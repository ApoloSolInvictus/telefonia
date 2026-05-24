import twilio from "twilio";
import { jsonResponse, optionsResponse, requireEnv, sanitizeIdentity } from "../lib/vercel-shared.js";

export function OPTIONS(request) {
  return optionsResponse(request);
}

export function GET(request) {
  try {
    const url = new URL(request.url);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const identity = sanitizeIdentity(url.searchParams.get("identity"));

    const token = new AccessToken(
      requireEnv("TWILIO_ACCOUNT_SID"),
      requireEnv("TWILIO_API_KEY_SID"),
      requireEnv("TWILIO_API_KEY_SECRET"),
      { identity, ttl: 3600 }
    );

    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: requireEnv("TWILIO_TWIML_APP_SID"),
      incomingAllow: true
    }));

    return jsonResponse(request, { token: token.toJwt(), identity });
  } catch (error) {
    return jsonResponse(request, { error: error.message }, 500);
  }
}
