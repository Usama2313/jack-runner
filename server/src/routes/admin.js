const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const db = require('../db/database');

// Unlock levels for a user
router.post('/unlock-levels', requireAdmin, (req, res) => {
  const { userId, levels } = req.body;
  if (!userId || !Array.isArray(levels)) {
    return res.status(400).json({ error: 'userId and levels array required' });
  }
  const success = db.setUserUnlockedLevels(userId, levels);
  if (!success) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'Levels unlocked', userId, levels });
});

// Activate or deactivate a user (premium)
router.post('/activate', requireAdmin, (req, res) => {
  const { userId, activated } = req.body;
  if (typeof userId === 'undefined' || typeof activated !== 'boolean') {
    return res.status(400).json({ error: 'userId and activated boolean required' });
  }
  const success = db.setUserActivated(userId, activated);
  if (!success) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ message: 'User activation updated', userId, activated });
});

// List all users (basic info)
router.get('/users', requireAdmin, (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    username: u.username,
    unlocked_levels: u.unlocked_levels || [],
    is_activated: u.is_activated || false,
    created_at: u.created_at
  }));
  res.json({ users });
});

module.exports = router;
