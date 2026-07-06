import express from "express";
import multer from "multer";
import { query } from "../db/database.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { askTherapistModel } from "../aiClient.js";
import fs from "fs";
import path from "path";
import os from "os"; // 1. Added os module import

// 2. Updated upload directory to use the serverless safe temporary directory
const uploadDir = path.join(os.tmpdir(), "therapist-uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
const router = express.Router();

// Simple in-memory guest tracking by client key (IP or forwarded address)
const guestAttempts = new Map();
const GUEST_LIMIT = 3;
const GUEST_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function clientKey(req) {
  return (
    req.ip ||
    req.headers["x-forwarded-for"] ||
    (req.connection && req.connection.remoteAddress) ||
    "unknown"
  );
}

function checkAndRecordGuestAttempt(req) {
  const key = clientKey(req);
  const now = Date.now();
  let entry = guestAttempts.get(key);
  if (!entry || now - entry.first > GUEST_WINDOW_MS) {
    entry = { count: 0, first: now };
  }

  if (entry.count >= GUEST_LIMIT) {
    guestAttempts.set(key, entry);
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  guestAttempts.set(key, entry);
  return { allowed: true, remaining: GUEST_LIMIT - entry.count };
}

router.use(authenticateToken);

// POST /api/chat — text message handler
router.post("/chat", async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    if (message.length > 300) {
      return res
        .status(400)
        .json({ error: "Message length exceeds 300 characters" });
    }

    // If no authenticated user, enforce guest attempt limits by IP/session
    if (!userId) {
      const { allowed, remaining } = checkAndRecordGuestAttempt(req);
      if (!allowed) {
        return res.status(403).json({ error: "Guest message limit reached" });
      }
    } else {
      // Persist authenticated user's message
      await query(
        'INSERT INTO messages ("userId", role, content) VALUES ($1, $2, $3)',
        [userId, "user", message],
      );
    }

    // Load chat history only for authenticated users
    let chatHistory = [];
    if (userId) {
      const historyResult = await query(
        'SELECT role, content FROM messages WHERE "userId" = $1 ORDER BY timestamp DESC LIMIT 15',
        [userId],
      );
      chatHistory = historyResult.rows
        .reverse()
        .map((row) => ({ role: row.role, content: row.content }));
    }

    const aiText = await askTherapistModel(message, chatHistory);

    if (userId) {
      await query(
        'INSERT INTO messages ("userId", role, content) VALUES ($1, $2, $3)',
        [userId, "assistant", aiText],
      );
    }

    res.json({ reply: aiText });
  } catch (error) {
    if (error.message.includes("Validation Error")) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// Directive 2.1: Implement Production Speech-to-Text (STT) - Placeholder
async function mockSpeechToText(audioFilePath) {
  return new Promise((resolve) => {
    // Simulate piping actual file stream to Whisper SDK
    setTimeout(() => {
      resolve(
        "This is the transcribed string literal from the simulated Whisper STT engine.",
      );
    }, 800);
  });
}

// Directive 2.2: Implement Production Text-to-Speech (TTS) - Placeholder
async function mockTextToSpeech(responseString) {
  return new Promise((resolve) => {
    // Module 1.1: Reconfigure TTS Engine Parameters
    const ttsParams = {
      voiceProfile: "en-US-BrianNeural", // Deeply resonant bass-baritone
      pacing: "0.85x", // Slower, deliberate delivery (~110 WPM)
    };

    // Module 1.2: Implement Audio Post-Processing (Low-Pass Filter)
    const postProcessing = {
      lowPassFilter: true, // Smooths out synthetic digital crackle
      clarityAdjustment: -0.1, // Warmer, less "sharp" digital edge
    };

    console.log(
      `[TTS] Synthesizing speech with voice: ${ttsParams.voiceProfile}, pacing: ${ttsParams.pacing}`,
    );
    console.log(
      `[TTS] Applied post-processing: Low-Pass Filter: ${postProcessing.lowPassFilter}, Clarity: ${postProcessing.clarityAdjustment}`,
    );

    // Simulate sending response string to neural vocalization service
    setTimeout(() => {
      resolve("https://mock-neural-vocalizer.azure.com/tts/temp_12345.mp3");
    }, 600);
  });
}

router.get("/history", async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    if (!userId) {
      return res.json({ history: [] });
    }
    const result = await query(
      'SELECT role, content, timestamp FROM messages WHERE "userId" = $1 ORDER BY timestamp ASC',
      [userId],
    );
    res.json({ history: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/voice-chat", upload.single("audio"), async (req, res, next) => {
  try {
    const userId = req.user ? req.user.userId : null;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    // Intercept binary payload and run simulated STT pipeline
    const transcribedText = await mockSpeechToText(audioFile.path);

    // Validate message length guardrail
    if (transcribedText.length > 300) {
      return res
        .status(400)
        .json({ error: "Message length exceeds 300 characters" });
    }

    if (!userId) {
      const { allowed } = checkAndRecordGuestAttempt(req);
      if (!allowed) {
        return res.status(403).json({ error: "Guest message limit reached" });
      }
    } else {
      // Persist authenticated user's message
      await query(
        'INSERT INTO messages ("userId", role, content) VALUES ($1, $2, $3)',
        [userId, "user", transcribedText],
      );
    }

    // Directive 3.1: Enforce a Sliding-Window Query Limit
    // Read only the most recent 15 entries for authenticated users
    let chatHistory = [];
    if (userId) {
      const historyResult = await query(
        'SELECT role, content FROM messages WHERE "userId" = $1 ORDER BY timestamp DESC LIMIT 15',
        [userId],
      );
      chatHistory = historyResult.rows
        .reverse()
        .map((row) => ({ role: row.role, content: row.content }));
    }

    // Call the mock AI model using structured anchor persona index array
    const aiResponse = await askTherapistModel(transcribedText, chatHistory);

    // Run simulated TTS pipeline on the response string
    const audioUrl = await mockTextToSpeech(aiResponse);

    if (userId) {
      // Save AI response to DB for authenticated users
      await query(
        'INSERT INTO messages ("userId", role, content) VALUES ($1, $2, $3)',
        [userId, "assistant", aiResponse],
      );
    }

    // Return text string and audio file link back to client interface
    res.json({
      userMessage: transcribedText,
      aiResponse: aiResponse,
      audioUrl: audioUrl,
    });
  } catch (error) {
    if (error.message.includes("Validation Error")) {
      return res.status(400).json({ error: error.message });
    }
    next(error); // Delegate anomalies to global error handler
  } finally {
    // Cleanup uploaded file
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temporary audio file:", err);
      });
    }
  }
});

export default router;
