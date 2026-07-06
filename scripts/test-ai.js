import dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.FOUNDRY_ENDPOINT;
const model = process.env.FOUNDRY_MODEL;
const apiKey =
  process.env.FOUNDRY_API_KEY ||
  process.env.AZURE_OPENAI_KEY ||
  process.env.OPENAI_API_KEY;
const deployment = process.env.FOUNDRY_DEPLOYMENT;
const apiVersion = process.env.FOUNDRY_API_VERSION || "2024-12-01";

if (!endpoint) {
  console.error("Missing FOUNDRY_ENDPOINT environment variable.");
  process.exit(1);
}

if (!model) {
  console.error("Missing FOUNDRY_MODEL environment variable.");
  process.exit(1);
}

if (!apiKey) {
  console.error(
    "Missing FOUNDRY_API_KEY, AZURE_OPENAI_KEY, or OPENAI_API_KEY environment variable.",
  );
  process.exit(1);
}

const baseEndpoint = endpoint.replace(/\/$/, "");
const completionsUrl = deployment
  ? baseEndpoint.includes("/openai/v1")
    ? `${baseEndpoint}/deployments/${deployment}/chat/completions`
    : `${baseEndpoint}/deployments/${deployment}/chat/completions?api-version=${apiVersion}`
  : `${baseEndpoint}/chat/completions`;

console.log(`Testing AI endpoint: ${completionsUrl}`);
console.log(`Using model: ${model}`);

console.log(`Testing AI endpoint: ${endpoint}`);
console.log(`Using model: ${model}`);

try {
  const response = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 50,
      temperature: 0.7,
    }),
  });

  const body = await response.text();
  console.log("Status:", response.status, response.statusText);
  console.log("Response body:");
  console.log(body);
} catch (error) {
  console.error("Fetch error:", error.message || error);
}
