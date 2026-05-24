import "dotenv/config";
import express from "express";
import cors from "cors";
import twilio from "twilio";

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY_SID,
  TWILIO_API_KEY_SECRET,
  TWILIO_TWIML_APP_SID,
  TWILIO_CALLER_ID,
  ALLOWED_ORIGIN = "https://iphone.infiniti-ia.com",
  PORT = 3000
} = process.env;

const app = express();
const allowedOrigins = ALLOWED_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed"));
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

function isE164(value) {
  return /^\+[1-9]\d{7,14}$/.test(String(value || ""));
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "quantum-phone-voice-backend",
    twilioConfigured: Boolean(TWILIO_ACCOUNT_SID && TWILIO_API_KEY_SID && TWILIO_API_KEY_SECRET && TWILIO_TWIML_APP_SID)
  });
});

app.get("/api/twilio-token", (req, res) => {
  try {
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const identity = String(req.query.identity || "quantum-phone-user").replace(/[^\w.-]/g, "").slice(0, 64) || "quantum-phone-user";
    const token = new AccessToken(
      requireEnv("TWILIO_ACCOUNT_SID", TWILIO_ACCOUNT_SID),
      requireEnv("TWILIO_API_KEY_SID", TWILIO_API_KEY_SID),
      requireEnv("TWILIO_API_KEY_SECRET", TWILIO_API_KEY_SECRET),
      { identity, ttl: 3600 }
    );

    token.addGrant(new VoiceGrant({
      outgoingApplicationSid: requireEnv("TWILIO_TWIML_APP_SID", TWILIO_TWIML_APP_SID),
      incomingAllow: true
    }));

    res.json({ token: token.toJwt(), identity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/voice", (req, res) => {
  const to = req.body.To || req.query.To;
  const response = new twilio.twiml.VoiceResponse();

  if (!isE164(to)) {
    response.say({ language: "es-MX", voice: "Polly.Mia-Neural" }, "Numero invalido. Use formato internacional.");
    res.type("text/xml").send(response.toString());
    return;
  }

  const dial = response.dial({
    callerId: requireEnv("TWILIO_CALLER_ID", TWILIO_CALLER_ID),
    answerOnBridge: true,
    timeout: 30
  });
  dial.number(to);

  res.type("text/xml").send(response.toString());
});

app.use((error, _req, res, _next) => {
  res.status(403).json({ error: error.message });
});

app.listen(Number(PORT), () => {
  console.log(`Quantum Phone voice backend listening on ${PORT}`);
});
