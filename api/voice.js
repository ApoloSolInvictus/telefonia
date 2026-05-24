import twilio from "twilio";
import { isE164, optionsResponse, xmlResponse } from "../lib/vercel-shared.js";

async function getParams(request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  if (request.method === "GET") {
    return params;
  }

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return { ...params, ...(await request.json()) };
  }

  const body = await request.text();
  return { ...params, ...Object.fromEntries(new URLSearchParams(body).entries()) };
}

function say(response, message) {
  response.say({ language: "es-MX" }, message);
}

async function handleVoice(request) {
  const params = await getParams(request);
  const to = params.To;
  const response = new twilio.twiml.VoiceResponse();

  if (!isE164(to)) {
    say(response, "Numero invalido. Use formato internacional.");
    return xmlResponse(request, response.toString());
  }

  if (!process.env.TWILIO_CALLER_ID) {
    say(response, "Backend sin identificador de llamada configurado.");
    return xmlResponse(request, response.toString());
  }

  const dial = response.dial({
    callerId: process.env.TWILIO_CALLER_ID,
    answerOnBridge: true,
    timeout: 30
  });
  dial.number(to);

  return xmlResponse(request, response.toString());
}

export function OPTIONS(request) {
  return optionsResponse(request);
}

export function GET(request) {
  return handleVoice(request);
}

export function POST(request) {
  return handleVoice(request);
}
