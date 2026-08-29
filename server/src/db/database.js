const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Pre-hashed default password 'admin1234'
const ADMIN_HASH = bcrypt.hashSync('admin1234', 10);
const DEFAULT_HASH = bcrypt.hashSync('runner123', 10);

const defaultData = {
  users: [
    {
      id: 1,
      email: 'admin@jackrunner.com',
      username: 'JackAdmin',
      password_hash: ADMIN_HASH,
      is_admin: true,
      is_activated: true,
      unlocked_levels: Array.from({ length: 30 }, (_, i) => i + 1),
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'jake@speed.com',
      username: 'JakeSpeed',
      password_hash: DEFAULT_HASH,
      is_admin: false,
      is_activated: false,
      unlocked_levels: [1],
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'tricky@runner.com',
      username: 'TrickyRunner',
      password_hash: DEFAULT_HASH,
      is_admin: false,
      is_activated: false,
      unlocked_levels: [1, 2],
      created_at: new Date().toISOString()
    }
  ],
  scores: [
    { id: 1, user_id: 1, username: 'JackAdmin', score: 98500, coins: 1450, distance: 8900, character: 'jack', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, user_id: 2, username: 'JakeSpeed', score: 48920, coins: 342, distance: 4120, character: 'neon', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, user_id: 3, username: 'TrickyRunner', score: 32450, coins: 215, distance: 2890, character: 'blitz', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 4, user_id: null, username: 'SubwayPro99', score: 15400, coins: 95, distance: 1420, character: 'jack', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, user_id: null, username: 'HoverSurfer', score: 9800, coins: 72, distance: 880, character: 'blitz', created_at: new Date(Date.now() - 18000000).toISOString() }
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
    const parsed = JSON.parse(raw);
    
    // Ensure admin user exists
    if (!parsed.users || !parsed.users.some(u => u.email === 'admin@jackrunner.com')) {
      parsed.users = parsed.users || [];
      parsed.users.unshift(defaultData.users[0]);
      writeDb(parsed);
    }
    return parsed;
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
    if (!username) return null;
    const users = readDb().users || [];
    return users.find(u => u.username && u.username.toLowerCase() === String(username).toLowerCase().trim());
  },

  getUserByEmail: (email) => {
    if (!email) return null;
    const users = readDb().users || [];
    return users.find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase().trim());
  },

  getUserById: (id) => {
    const users = readDb().users || [];
    return users.find(u => u.id === Number(id));
  },

  findUser: (identifier) => {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();
    const users = readDb().users || [];
    return users.find(u => 
      String(u.id) === clean ||
      (u.email && u.email.toLowerCase() === clean) ||
      (u.username && u.username.toLowerCase() === clean)
    );
  },

  createUser: (email, username, password_hash) => {
    const data = readDb();
    const newId = (data.users.length ? Math.max(...data.users.map(u => u.id)) : 0) + 1;
    const newUser = {
      id: newId,
      email: email ? String(email).trim().toLowerCase() : `${username.toLowerCase()}@runner.game`,
      username: String(username).trim(),
      password_hash,
      is_admin: false,
      is_activated: false,
      unlocked_levels: [1],
      created_at: new Date().toISOString()
    };
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

  addScore: ({ user_id = null, username, score, coins = 0, distance = 0, character = 'jack' }) => {
    const data = readDb();
    const newId = (data.scores.length ? Math.max(...data.scores.map(s => s.id)) : 0) + 1;
    const newScore = {
      id: newId,
      user_id: user_id ? Number(user_id) : null,
      username: username || 'Anonymous Surfer',
      score: Number(score) || 0,
      coins: Number(coins) || 0,
      distance: Number(distance) || 0,
      character: character || 'jack',
      created_at: new Date().toISOString()
    };
    data.scores.push(newScore);
    writeDb(data);
    return newScore;
  },

  getUserHighscore: (username) => {
    const data = readDb();
    const userScores = (data.scores || []).filter(s => s.username && s.username.toLowerCase() === String(username).toLowerCase());
    if (!userScores.length) return null;
    return userScores.reduce((max, s) => s.score > max.score ? s : max, userScores[0]);
  },

  setUserUnlockedLevels: (identifier, levelsArray) => {
    const data = readDb();
    const user = data.users.find(u => 
      String(u.id) === String(identifier) ||
      (u.email && u.email.toLowerCase() === String(identifier).toLowerCase()) ||
      (u.username && u.username.toLowerCase() === String(identifier).toLowerCase())
    );
    if (!user) return false;
    user.unlocked_levels = levelsArray;
    writeDb(data);
    return true;
  },

  setUserActivated: (identifier, activated) => {
    const data = readDb();
    const user = data.users.find(u => 
      String(u.id) === String(identifier) ||
      (u.email && u.email.toLowerCase() === String(identifier).toLowerCase()) ||
      (u.username && u.username.toLowerCase() === String(identifier).toLowerCase())
    );
    if (!user) return false;
    user.is_activated = activated;
    writeDb(data);
    return true;
  }
};

module.exports = db;
module.exports.db = db;
