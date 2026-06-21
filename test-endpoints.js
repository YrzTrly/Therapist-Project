import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('--- Starting API Endpoint Tests ---');
    const timestamp = Date.now();
    const username = `testuser_${timestamp}@example.com`;
    const password = 'Test!@Password1';

    let token = '';

    // 1. Signup
    console.log(`\n1. Testing Signup for ${username}...`);
    try {
        const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const signupData = await signupRes.json();
        console.log('Signup Response:', signupData);
        if (!signupRes.ok) throw new Error('Signup failed');
    } catch (e) {
        console.error('Error in Signup:', e);
        return;
    }

    // 2. Login
    console.log(`\n2. Testing Login for ${username}...`);
    try {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);
        if (!loginRes.ok || !loginData.token) throw new Error('Login failed');
        token = loginData.token;
    } catch (e) {
        console.error('Error in Login:', e);
        return;
    }

    // 3. Voice Chat (Simulated)
    console.log(`\n3. Testing Voice Chat Simulation...`);
    try {
        const dummyAudioPath = path.join(__dirname, 'dummy.wav');
        fs.writeFileSync(dummyAudioPath, 'dummy audio content');

        const fileStream = fs.createReadStream(dummyAudioPath);
        
        const formData = new FormData();
        const blob = new Blob([fs.readFileSync(dummyAudioPath)], { type: 'audio/wav' });
        formData.append('audio', blob, 'dummy.wav');

        const chatRes = await fetch(`${BASE_URL}/api/voice-chat`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const chatData = await chatRes.json();
        console.log('Voice Chat Response:', chatData);
        
        fs.unlinkSync(dummyAudioPath); // Cleanup
        if (!chatRes.ok) throw new Error('Voice chat failed');
    } catch (e) {
        console.error('Error in Voice Chat:', e);
        return;
    }

    // 4. Get History
    console.log(`\n4. Testing Chat History...`);
    try {
        const historyRes = await fetch(`${BASE_URL}/api/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const historyData = await historyRes.json();
        console.log('History Response:', JSON.stringify(historyData, null, 2));
        if (!historyRes.ok) throw new Error('History fetch failed');
    } catch (e) {
        console.error('Error in History:', e);
        return;
    }

    console.log('\n--- All Tests Completed Successfully ---');
}

runTests();
