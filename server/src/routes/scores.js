const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// GET /api/scores/leaderboard
router.get('/leaderboard', (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const topScores = db.getScores(limit);
    res.json({
      leaderboard: topScores,
      count: topScores.length
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

// POST /api/scores (submit game run score)
router.post('/', (req, res) => {
  try {
    const { score, coins = 0, distance = 0, character = 'jake', username } = req.body;
    if (score === undefined || score === null || isNaN(score)) {
      return res.status(400).json({ error: 'Valid score is required' });
    }

    let userId = null;
    let playerName = (username || '').trim() || 'Anonymous Surfer';

    // Check if Authorization header provided
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
        playerName = decoded.username;
      } catch {
        // Continue as guest if token invalid
      }
    }

    const newScore = db.addScore({
      user_id: userId,
      username: playerName,
      score: Number(score),
      coins: Number(coins),
      distance: Number(distance),
      character: character || 'jake'
    });

    const leaderboard = db.getScores(10);
    const rank = leaderboard.findIndex(s => s.id === newScore.id) + 1;

    // Broadcast if io instance is available via req.app
    const io = req.app.get('io');
    if (io) {
      io.emit('leaderboard:update', { leaderboard, latest: newScore });
    }

    res.status(201).json({
      success: true,
      score: newScore,
      rank: rank > 0 ? rank : null,
      leaderboard
    });
  } catch (err) {
    console.error('Error submitting score:', err);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// GET /api/scores/user/:username
router.get('/user/:username', (req, res) => {
  try {
    const { username } = req.params;
    const highscore = db.getUserHighscore(username);
    res.json({ username, highscore });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user highscore' });
  }
});

module.exports = router;
