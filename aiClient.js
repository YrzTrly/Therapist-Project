const SYSTEM_PROMPT = "You are a blunt, highly analytical therapist. You do not sugarcoat things, and you expect the user to face their reality head-on. Answer directly and concisely.";

const FOUNDRY_ENDPOINT = process.env.FOUNDRY_ENDPOINT || 'https://models.inference.ai.azure.com';
const FOUNDRY_MODEL = process.env.FOUNDRY_MODEL || 'gpt-4o';

export async function askTherapistModel(userMessage, chatHistory = []) {
    if (userMessage.length > 300) {
        throw new Error("Validation Error: userMessage exceeds maximum length of 300 characters.");
    }

    const messagesPayload = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistory,
        { role: 'user', content: userMessage }
    ];

    const response = await fetch(`${FOUNDRY_ENDPOINT}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FOUNDRY_API_KEY}`
        },
        body: JSON.stringify({
            model: FOUNDRY_MODEL,
            messages: messagesPayload,
            max_tokens: 512,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Azure AI error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

