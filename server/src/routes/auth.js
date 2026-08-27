const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.getUserByUsername(cleanUsername);
    if (existing) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = db.createUser(cleanUsername, hash);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '14d' });

    res.status(201).json({
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const cleanUsername = username.trim();
    const user = db.getUserByUsername(cleanUsername);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '14d' });
    res.json({
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to log in' });
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
    res.json({ user: { id: user.id, username: user.username } });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;
