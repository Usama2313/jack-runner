const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAdmin, JWT_SECRET, MASTER_ADMIN_KEYS } = require('../middleware/auth');
const db = require('../db/database');

// POST /api/admin/login (Admin Login with Email/Password or Master Key)
router.post('/login', async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    // Check Master Key login
    if (adminKey && MASTER_ADMIN_KEYS.includes(adminKey.trim())) {
      const token = jwt.sign(
        { id: 1, email: 'admin@jackrunner.com', username: 'JackAdmin', isAdmin: true },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        message: 'Admin authenticated via Master Key',
        token,
        admin: { email: 'admin@jackrunner.com', username: 'JackAdmin' }
      });
    }

    // Check Email & Password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password (or Master Key) are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.getUserByEmail(cleanEmail) || db.findUser(cleanEmail);

    if (!user) {
      // Fallback check for default admin credentials
      if (cleanEmail === 'admin@jackrunner.com' && password === 'admin1234') {
        const token = jwt.sign(
          { id: 1, email: 'admin@jackrunner.com', username: 'JackAdmin', isAdmin: true },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          message: 'Admin logged in successfully',
          token,
          admin: { email: 'admin@jackrunner.com', username: 'JackAdmin' }
        });
      }
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid && !(cleanEmail === 'admin@jackrunner.com' && password === 'admin1234')) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin logged in successfully',
      token,
      admin: { email: user.email, username: user.username }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Unlock levels for a user by User ID, Email, or Username
router.post('/unlock-levels', requireAdmin, (req, res) => {
  const { userId, identifier, levels } = req.body;
  const target = identifier || userId;

  if (!target || !Array.isArray(levels)) {
    return res.status(400).json({ error: 'User Email/ID and levels array required' });
  }
  const cleanLevels = levels.map(l => Number(l)).filter(l => !isNaN(l) && l >= 1 && l <= 30);
  const success = db.setUserUnlockedLevels(target, cleanLevels);
  if (!success) {
    return res.status(404).json({ error: `User '${target}' not found` });
  }
  res.json({
    success: true,
    message: `Unlocked stages [${cleanLevels.join(', ')}] for user '${target}'!`,
    userId: target,
    levels: cleanLevels
  });
});

// Set stage count for a user (e.g. allow 15 stages => unlocks [1..15])
router.post('/set-stage-count', requireAdmin, (req, res) => {
  const { identifier, stageCount } = req.body;
  if (!identifier || typeof stageCount === 'undefined') {
    return res.status(400).json({ error: 'User Email/ID and stageCount are required' });
  }
  const count = Math.max(1, Math.min(30, Number(stageCount) || 1));
  const stages = Array.from({ length: count }, (_, i) => i + 1);
  const success = db.setUserUnlockedLevels(identifier, stages);
  if (!success) {
    return res.status(404).json({ error: `User '${identifier}' not found` });
  }
  res.json({
    success: true,
    message: `Successfully set ${count} stages allowed for '${identifier}' (Stages 1 to ${count})!`,
    identifier,
    unlocked_levels: stages,
    count
  });
});

// Activate or deactivate a user (premium / full game unlock)
router.post('/activate', requireAdmin, (req, res) => {
  const { userId, identifier, activated } = req.body;
  const target = identifier || userId;

  if (typeof target === 'undefined' || typeof activated !== 'boolean') {
    return res.status(400).json({ error: 'User Email/ID and activated boolean required' });
  }
  const success = db.setUserActivated(target, activated);
  if (!success) {
    return res.status(404).json({ error: `User '${target}' not found` });
  }
  res.json({
    success: true,
    message: `User '${target}' VIP status set to: ${activated ? 'ACTIVATED (Full Game Unlocked)' : 'DEACTIVATED'}`,
    userId: target,
    activated
  });
});

// List all registered users
router.get('/users', requireAdmin, (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    email: u.email || 'N/A',
    username: u.username,
    unlocked_levels: u.unlocked_levels || [1],
    is_activated: u.is_activated || false,
    is_admin: u.is_admin || false,
    created_at: u.created_at
  }));
  res.json({ success: true, users, count: users.length });
});

module.exports = router;
