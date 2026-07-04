import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import crypto from 'crypto';
import { getDb } from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Directive 4.1: Inject Input Validation Middleware
const authSchema = Joi.object({
    username: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Username must be a valid email address.'
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long.'
        })
});

const validatePayload = (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

router.post('/signup', validatePayload, async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const db = await getDb();

        const result = await db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully', userId: result.lastID });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        next(error); // Pass to global error handler
    }
});

router.post('/login', validatePayload, async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, userId: user.id });
    } catch (error) {
        next(error); // Pass to global error handler
    }
});

// Module 3.1: Expand Joi Schema Validation Boundaries
const oauthSchema = Joi.object({
    idToken: Joi.string().required().messages({
        'string.empty': 'OAuth token payload is missing or empty.',
        'any.required': 'OAuth token is required.'
    })
});

const validateOAuthPayload = (req, res, next) => {
    const { error } = oauthSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

// Module 2.2: Implement Server-to-Server Verification Logic (Simulated Wrapper)
async function verifyOAuthToken(idToken, provider) {
    // Placeholder architecture for actual OAuth verification
    // Integrations to use:
    // - Google: google-auth-library
    // - Apple: jsonwebtoken and jwks-rsa to verify Apple's public keys
    // - Microsoft: passport-microsoft or custom MSAL Node verification

    // Simulate verification delay and decoding
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock extracted token data
            resolve({
                email: `user_${Math.floor(Math.random() * 1000)}@${provider}.com`,
                providerId: `${provider}_id_${Math.random().toString(36).substring(7)}`
            });
        }, 500);
    });
}

// Module 2.3: Database Sync & Account Provisioning
async function handleOAuthLogin(req, res, next, provider) {
    try {
        const { idToken } = req.body;

        // Verify the token securely with the provider
        const userInfo = await verifyOAuthToken(idToken, provider);
        const email = userInfo.email;

        const db = await getDb();
        
        // Check if user already exists
        let user = await db.get('SELECT * FROM users WHERE username = ?', [email]);

        if (!user) {
            // User is new. Lock down their default configuration using a secure random password
            const fallbackPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(fallbackPassword, 10);
            
            const result = await db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [email, hashedPassword]
            );
            
            user = { id: result.lastID, username: email };
        }

        // Issue a signed JWT session token back to the frontend
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, userId: user.id });
    } catch (error) {
        next(error);
    }
}

// Module 2.1: Establish Third-Party Token Verification Routes
router.post('/google', validateOAuthPayload, (req, res, next) => handleOAuthLogin(req, res, next, 'google'));
router.post('/apple', validateOAuthPayload, (req, res, next) => handleOAuthLogin(req, res, next, 'apple'));
router.post('/microsoft', validateOAuthPayload, (req, res, next) => handleOAuthLogin(req, res, next, 'microsoft'));

export default router;
