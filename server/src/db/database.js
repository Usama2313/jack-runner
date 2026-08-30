const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Pre-hashed default password 'admin1234'
const ADMIN_HASH = bcrypt.hashSync('admin1234', 10);
const DEFAULT_HASH = bcrypt.hashSync('runner123', 10);

const SEEDED_SONGS = [
  { id: 'song-1', name: 'Victory Horizon (Main Theme)', type: 'instrumental', price: 0, level: 1, author: 'Epic Synth', is_free: true },
  { id: 'song-2', name: 'Believe in Yourself', type: 'vocal', price: 30, level: 2, author: 'Chamber Grit' },
  { id: 'song-3', name: 'Eye of the Gladiator', type: 'vocal', price: 30, level: 3, author: 'Metal Storm' },
  { id: 'song-4', name: 'Rise Above the Grid', type: 'instrumental', price: 30, level: 4, author: 'Cyber Grid' },
  { id: 'song-5', name: 'Limitless Power', type: 'vocal', price: 30, level: 5, author: 'Future Blast' },
  { id: 'song-6', name: 'Autobahn Speed', type: 'instrumental', price: 30, level: 6, author: 'Kraft Drive' },
  { id: 'song-7', name: 'Neon Dreams', type: 'vocal', price: 30, level: 7, author: 'Retro Arc' },
  { id: 'song-8', name: 'Eiffel Summit', type: 'instrumental', price: 30, level: 8, author: 'Parisian Synth' },
  { id: 'song-9', name: 'Gangnam Run', type: 'vocal', price: 30, level: 9, author: 'Seoul K-Pop' },
  { id: 'song-10', name: 'Sunset Drive', type: 'instrumental', price: 30, level: 10, author: 'California Wave' },
  { id: 'song-11', name: 'Harbour Cyberway', type: 'vocal', price: 30, level: 11, author: 'Sydney Vox' },
  { id: 'song-12', name: 'Solar Flare Fissure', type: 'instrumental', price: 30, level: 12, author: 'Cairo Dunes' },
  { id: 'song-13', name: 'Frost Valley Echo', type: 'vocal', price: 30, level: 13, author: 'Toronto Blizzard' },
  { id: 'song-14', name: 'Coliseum Ascent', type: 'instrumental', price: 30, level: 14, author: 'Rome Gladiator' },
  { id: 'song-15', name: 'Valkyrie Special Run', type: 'vocal', price: 30, level: 15, author: 'Olympic Queen' },
  { id: 'song-16', name: 'Aurora Glade Whisper', type: 'instrumental', price: 30, level: 16, author: 'Reykjavik Ambient' },
  { id: 'song-17', name: 'Alps Thrill Chase', type: 'vocal', price: 30, level: 17, author: 'Swiss Peaks' },
  { id: 'song-18', name: 'Cyberpunk Redline', type: 'instrumental', price: 30, level: 18, author: 'Hong Kong Neon' },
  { id: 'song-19', name: 'Bazaar Run', type: 'vocal', price: 30, level: 19, author: 'Istanbul Sitar' },
  { id: 'song-20', name: 'Rainforest Sprinter', type: 'instrumental', price: 30, level: 20, author: 'Amazon Beat' },
  { id: 'song-21', name: 'Taj Mahal Echoes', type: 'vocal', price: 30, level: 21, author: 'Delhi Beats' },
  { id: 'song-22', name: 'Volcanic Core', type: 'instrumental', price: 30, level: 22, author: 'Magma Core' },
  { id: 'song-23', name: 'Sky High Chase', type: 'vocal', price: 30, level: 23, author: 'Chicago Skyscraper' },
  { id: 'song-24', name: 'Frozen Tundra', type: 'instrumental', price: 30, level: 24, author: 'Siberian Storm' },
  { id: 'song-25', name: 'Carnival Jump', type: 'vocal', price: 30, level: 25, author: 'Rio Samba' },
  { id: 'song-26', name: 'Sahara Heatwaves', type: 'instrumental', price: 30, level: 26, author: 'Desert Wind' },
  { id: 'song-27', name: 'Tower Bridge Chase', type: 'vocal', price: 30, level: 27, author: 'London Punk' },
  { id: 'song-28', name: 'Tokyo Overdrive', type: 'instrumental', price: 30, level: 28, author: 'Shibuya Crossing' },
  { id: 'song-29', name: 'Samba Horizon', type: 'vocal', price: 30, level: 29, author: 'Rio Sunset' },
  { id: 'song-30', name: 'Ultimate Apex Champion', type: 'instrumental', price: 30, level: 30, author: 'Valkyrie Theme' }
];

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
      unlocked_songs: SEEDED_SONGS.map(s => s.id),
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
      unlocked_songs: ['song-1'],
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
      unlocked_songs: ['song-1'],
      created_at: new Date().toISOString()
    }
  ],
  scores: [
    { id: 1, user_id: 1, username: 'JackAdmin', score: 98500, coins: 1450, distance: 8900, character: 'jack', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, user_id: 2, username: 'JakeSpeed', score: 48920, coins: 342, distance: 4120, character: 'neon', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, user_id: 3, username: 'TrickyRunner', score: 32450, coins: 215, distance: 2890, character: 'blitz', created_at: new Date(Date.now() - 10800000).toISOString() },
    { id: 4, user_id: null, username: 'SubwayPro99', score: 15400, coins: 95, distance: 1420, character: 'jack', created_at: new Date(Date.now() - 14400000).toISOString() },
    { id: 5, user_id: null, username: 'HoverSurfer', score: 9800, coins: 72, distance: 880, character: 'blitz', created_at: new Date(Date.now() - 18000000).toISOString() }
  ],
  songs: SEEDED_SONGS,
  payments: []
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
    }

    // Safety checks for new features
    if (!parsed.songs) {
      parsed.songs = SEEDED_SONGS;
    }
    if (!parsed.payments) {
      parsed.payments = [];
    }
    parsed.users.forEach(user => {
      if (!user.unlocked_songs) {
        user.unlocked_songs = user.is_admin ? SEEDED_SONGS.map(s => s.id) : ['song-1'];
      }
    });

    writeDb(parsed);
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
      unlocked_songs: ['song-1'],
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
  },

  getSongs: () => {
    const data = readDb();
    return data.songs || SEEDED_SONGS;
  },

  addSong: ({ name, type, price, level, author }) => {
    const data = readDb();
    data.songs = data.songs || [];
    const newId = `song-${(data.songs.length ? Math.max(...data.songs.map(s => {
      const match = s.id.match(/\d+/);
      return match ? Number(match[0]) : 0;
    })) : 0) + 1}`;
    const newSong = {
      id: newId,
      name: String(name),
      type: String(type || 'vocal'),
      price: Number(price) || 30,
      level: Number(level) || 1,
      author: String(author || 'Unknown')
    };
    data.songs.push(newSong);
    writeDb(data);
    return newSong;
  },

  deleteSong: (songId) => {
    const data = readDb();
    data.songs = data.songs || [];
    const index = data.songs.findIndex(s => s.id === songId);
    if (index === -1) return false;
    data.songs.splice(index, 1);
    writeDb(data);
    return true;
  },

  getPayments: () => {
    const data = readDb();
    return data.payments || [];
  },

  createPayment: ({ email, itemType, itemId, amount, tid }) => {
    const data = readDb();
    data.payments = data.payments || [];
    const newId = (data.payments.length ? Math.max(...data.payments.map(p => p.id)) : 0) + 1;
    const newPayment = {
      id: newId,
      email: String(email).trim().toLowerCase(),
      itemType: String(itemType), // 'stage' | 'song' | 'vip'
      itemId: itemId,
      amount: Number(amount) || 0,
      tid: String(tid).trim(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    data.payments.push(newPayment);
    writeDb(data);
    return newPayment;
  },

  approvePayment: (paymentId) => {
    const data = readDb();
    data.payments = data.payments || [];
    const payment = data.payments.find(p => p.id === Number(paymentId));
    if (!payment) return { success: false, error: 'Payment not found' };
    
    payment.status = 'approved';
    
    const user = data.users.find(u => u.email && u.email.toLowerCase() === payment.email.toLowerCase());
    if (user) {
      if (payment.itemType === 'vip') {
        user.is_activated = true;
      } else if (payment.itemType === 'stage') {
        user.unlocked_levels = user.unlocked_levels || [1];
        const stageNum = Number(payment.itemId);
        if (!user.unlocked_levels.includes(stageNum)) {
          user.unlocked_levels.push(stageNum);
          user.unlocked_levels.sort((a, b) => a - b);
        }
      } else if (payment.itemType === 'song') {
        user.unlocked_songs = user.unlocked_songs || ['song-1'];
        const songId = String(payment.itemId);
        if (!user.unlocked_songs.includes(songId)) {
          user.unlocked_songs.push(songId);
        }
      }
    }
    
    writeDb(data);
    return { success: true, payment };
  },

  rejectPayment: (paymentId) => {
    const data = readDb();
    data.payments = data.payments || [];
    const payment = data.payments.find(p => p.id === Number(paymentId));
    if (!payment) return { success: false, error: 'Payment not found' };
    payment.status = 'rejected';
    writeDb(data);
    return { success: true, payment };
  }
};

module.exports = db;
module.exports.db = db;

