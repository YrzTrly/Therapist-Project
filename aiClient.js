const SYSTEM_PROMPT =
  "You are a blunt, highly analytical therapist. You do not sugarcoat things, and you expect the user to face their reality head-on. Answer directly and concisely.";

const FOUNDRY_ENDPOINT = (
  process.env.FOUNDRY_ENDPOINT || "https://models.inference.ai.azure.com"
).replace(/\/$/, "");
const FOUNDRY_MODEL = process.env.FOUNDRY_MODEL || "gpt-4o";
const FOUNDRY_DEPLOYMENT = process.env.FOUNDRY_DEPLOYMENT || "";
const FOUNDRY_API_VERSION = process.env.FOUNDRY_API_VERSION || "2024-06-01";
const FOUNDRY_API_KEY =
  process.env.FOUNDRY_API_KEY ||
  process.env.AZURE_OPENAI_KEY ||
  process.env.OPENAI_API_KEY;

function getCompletionsUrl() {
  if (!FOUNDRY_DEPLOYMENT) {
    return `${FOUNDRY_ENDPOINT}/chat/completions`;
  }

  if (FOUNDRY_ENDPOINT.includes(".azure.com")) {
    return `${FOUNDRY_ENDPOINT}/deployments/${FOUNDRY_DEPLOYMENT}/chat/completions?api-version=${FOUNDRY_API_VERSION}`;
  }

  if (FOUNDRY_ENDPOINT.includes("/openai/v1")) {
    return `${FOUNDRY_ENDPOINT}/deployments/${FOUNDRY_DEPLOYMENT}/chat/completions`;
  }

  return `${FOUNDRY_ENDPOINT}/deployments/${FOUNDRY_DEPLOYMENT}/chat/completions?api-version=${FOUNDRY_API_VERSION}`;
}

export async function askTherapistModel(userMessage, chatHistory = []) {
  if (!FOUNDRY_API_KEY) {
    throw new Error("Missing FOUNDRY_API_KEY environment variable");
  }

  if (userMessage.length > 300) {
    throw new Error(
      "Validation Error: userMessage exceeds maximum length of 300 characters.",
    );
  }

  const messagesPayload = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage },
  ];

  const response = await fetch(getCompletionsUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": FOUNDRY_API_KEY,
    },
    body: JSON.stringify({
      model: FOUNDRY_MODEL,
      messages: messagesPayload,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
