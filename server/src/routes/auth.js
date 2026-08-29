const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register (Email + Username + Password)
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (cleanUsername.length < 2 || cleanUsername.length > 20) {
      return res.status(400).json({ error: 'Username must be between 2 and 20 characters' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (db.getUserByEmail(cleanEmail)) {
      return res.status(409).json({ error: 'Email already registered. Please log in.' });
    }
    if (db.getUserByUsername(cleanUsername)) {
      return res.status(409).json({ error: 'Username already taken. Please choose another.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = db.createUser(cleanEmail, cleanUsername, hash);
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, isAdmin: !!user.is_admin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_activated: user.is_activated || false,
        unlocked_levels: user.unlocked_levels || [1]
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create player account' });
  }
});

// POST /api/auth/login (Email or Username + Password)
router.post('/login', async (req, res) => {
  try {
    const { email, username, identifier, password } = req.body;
    const loginTarget = (identifier || email || username || '').trim();

    if (!loginTarget || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    const user = db.findUser(loginTarget);
    if (!user) {
      return res.status(401).json({ error: 'Account not found. Please check your email/username.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, isAdmin: !!user.is_admin },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_activated: user.is_activated || false,
        unlocked_levels: user.unlocked_levels || [1]
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login service failed' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUserById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        is_activated: user.is_activated || false,
        unlocked_levels: user.unlocked_levels || [1]
      }
    });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
