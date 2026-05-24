const DEFAULT_ALLOWED_ORIGINS = [
  "https://iphone.infiniti-ia.com",
  "http://127.0.0.1:3000",
  "http://localhost:3000"
];

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function isE164(value) {
  return /^\+[1-9]\d{7,14}$/.test(String(value || ""));
}

export function sanitizeIdentity(value) {
  return String(value || "quantum-phone-user").replace(/[^\w.-]/g, "").slice(0, 64) || "quantum-phone-user";
}

export function allowedOrigins() {
  return (process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const origins = allowedOrigins();
  const allowAll = origins.includes("*");
  const allowedOrigin = allowAll ? (origin || "*") : (origin && origins.includes(origin) ? origin : origins[0]);

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

export function optionsResponse(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request)
  });
}

export function jsonResponse(request, data, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders(request)
  });
}

export function xmlResponse(request, xml, status = 200) {
  return new Response(xml, {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "text/xml; charset=utf-8"
    }
  });
}
