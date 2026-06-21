const SYSTEM_PROMPT = "You are a blunt, highly analytical therapist. You do not sugarcoat things, and you expect the user to face their reality head-on. Answer directly and concisely.";

// TODO: Replace with real @azure-rest/ai-inference SDK call once keys arrive

export async function askTherapistModel(userMessage, chatHistory = []) {
    // 3. Strict budget guardrail: limit 300 chars on the user message
    if (userMessage.length > 300) {
        throw new Error("Validation Error: userMessage exceeds maximum length of 300 characters.");
    }

    // Directive 3.2: Lock the Anchor Persona Index
    // Enforce an unalterable structural sequence.
    const messagesPayload = [
        { role: 'system', content: SYSTEM_PROMPT }, // messages[0] MUST be explicitly populated with the permanent blunt therapist System Prompt
        ...chatHistory,                             // messages[1] through messages[n-1] must contain the 15 sliced history turns
        { role: 'user', content: userMessage }      // messages[n] must contain the brand new incoming user question or transcription
    ];

    // 4. Mock 1-second timeout simulating network delay against the external model
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`[Mock AI Response] I hear what you are saying about: '${userMessage}'. The array length passed to the model was ${messagesPayload.length} objects. Tell me more.`);
        }, 1000);
    });
}
