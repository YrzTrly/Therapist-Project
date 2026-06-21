import { askTherapistModel } from './aiClient.js';

async function runTests() {
    console.log("Starting stress tests...\n");

    // Test 1: Valid message and sliding window
    console.log("Test 1: Valid message and sliding window (8 messages in history)");
    const chatHistory = [1, 2, 3, 4, 5, 6, 7, 8].map(i => `Message ${i}`);
    try {
        const start = Date.now();
        const response = await askTherapistModel("Hello there!", chatHistory);
        const end = Date.now();
        console.log(`Response: ${response}`);
        console.log(`Time taken: ${end - start}ms`);
        console.log("Test 1 passed.\n");
    } catch (e) {
        console.error("Test 1 failed:", e.message);
    }

    // Test 2: Budget guardrail (message > 300 characters)
    console.log("Test 2: Budget guardrail (message > 300 characters)");
    const longMessage = "a".repeat(301);
    try {
        await askTherapistModel(longMessage, []);
        console.error("Test 2 failed: Expected an error but got none.");
    } catch (e) {
        console.log(`Caught expected error: ${e.message}`);
        console.log("Test 2 passed.\n");
    }

    console.log("All tests completed.");
}

runTests();
