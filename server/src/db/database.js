const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const defaultData = {
  users: [
    { id: 1, username: 'JakeSpeed', password_hash: '$2a$10$76aQxPq6Z8s2xZk3T2nOvei4h2E9oZ5k7B8c9d0e1f2a3b4c5d6e', created_at: new Date().toISOString() },
    { id: 2, username: 'TrickyRunner', password_hash: '$2a$10$76aQxPq6Z8s2xZk3T2nOvei4h2E9oZ5k7B8c9d0e1f2a3b4c5d6e', created_at: new Date().toISOString() },
    { id: 3, username: 'FreshKing', password_hash: '$2a$10$76aQxPq6Z8s2xZk3T2nOvei4h2E9oZ5k7B8c9d0e1f2a3b4c5d6e', created_at: new Date().toISOString() }
  ],
  scores: [
    { id: 1, user_id: 1, username: 'JakeSpeed', score: 48920, coins: 342, distance: 4120, character: 'jake', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, user_id: 2, username: 'TrickyRunner', score: 32450, coins: 215, distance: 2890, character: 'tricky', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, user_id: 3, username: 'FreshKing', score: 21100, coins: 180, distance: 1950, character: 'fresh', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 4, user_id: null, username: 'SubwayPro99', score: 15400, coins: 95, distance: 1420, character: 'jake', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, user_id: null, username: 'HoverSurfer', score: 9800, coins: 72, distance: 880, character: 'ninja', created_at: new Date(Date.now() - 18000000).toISOString() }
  ]
};

function readDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, using in-memory default:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

const db = {
  getUsers: () => readDb().users || [],
  getUserByUsername: (username) => {
    const users = readDb().users || [];
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },
  getUserById: (id) => {
    const users = readDb().users || [];
    return users.find(u => u.id === Number(id));
  },
  createUser: (username, password_hash) => {
    const data = readDb();
    const newId = (data.users.length ? Math.max(...data.users.map(u => u.id)) : 0) + 1;
    const newUser = { id: newId, username, password_hash, created_at: new Date().toISOString() };
    data.users.push(newUser);
    writeDb(data);
    return newUser;
  },
  getScores: (limit = 20) => {
    const data = readDb();
    return [...(data.scores || [])]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
  addScore: ({ user_id = null, username, score, coins = 0, distance = 0, character = 'jake' }) => {
    const data = readDb();
    const newId = (data.scores.length ? Math.max(...data.scores.map(s => s.id)) : 0) + 1;
    const newScore = {
      id: newId,
      user_id: user_id ? Number(user_id) : null,
      username: username || 'Anonymous Surfer',
      score: Number(score) || 0,
      coins: Number(coins) || 0,
      distance: Number(distance) || 0,
      character: character || 'jake',
      created_at: new Date().toISOString()
    };
    data.scores.push(newScore);
    writeDb(data);
    return newScore;
  },
  getUserHighscore: (username) => {
    const data = readDb();
    const userScores = (data.scores || []).filter(s => s.username.toLowerCase() === username.toLowerCase());
    if (!userScores.length) return null;
    return userScores.reduce((max, s) => s.score > max.score ? s : max, userScores[0]);
  },
  setUserUnlockedLevels: (userId, levelsArray) => {
    const data = readDb();
    const user = data.users.find(u => u.id === Number(userId));
    if (!user) return false;
    user.unlocked_levels = levelsArray;
    writeDb(data);
    return true;
  },
  setUserActivated: (userId, activated) => {
    const data = readDb();
    const user = data.users.find(u => u.id === Number(userId));
    if (!user) return false;
    user.is_activated = activated;
    writeDb(data);
    return true;
  }
};

module.exports = db;
module.exports.db = db;
