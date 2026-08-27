const { db } = require('../db/database');

const setupSocketHandlers = (io) => {
  let activePlayers = 0;

  io.on('connection', (socket) => {
    activePlayers++;
    console.log(`[Socket] Player connected: ${socket.id} (Active: ${activePlayers})`);

    // Send initial leaderboard and active players count
    socket.emit('leaderboard:initial', {
      leaderboard: db.getScores(10),
      activePlayers
    });
    io.emit('players:count', { activePlayers });

    // Live score heartbeat during runs
    socket.on('player:run_update', (data) => {
      socket.broadcast.emit('player:live_activity', {
        username: data.username || 'A Runner',
        score: data.score,
        distance: data.distance
      });
    });

    // Score submission over socket
    socket.on('score:submit', (data) => {
      try {
        const newScore = db.addScore({
          user_id: data.user_id || null,
          username: data.username || 'Anonymous Surfer',
          score: data.score,
          coins: data.coins,
          distance: data.distance,
          character: data.character || 'jake'
        });

        const leaderboard = db.getScores(10);
        io.emit('leaderboard:update', { leaderboard, latest: newScore });
        socket.emit('score:submitted', { success: true, score: newScore });
      } catch (err) {
        socket.emit('score:error', { error: 'Failed to record score' });
      }
    });

    socket.on('disconnect', () => {
      activePlayers = Math.max(0, activePlayers - 1);
      console.log(`[Socket] Player disconnected: ${socket.id} (Active: ${activePlayers})`);
      io.emit('players:count', { activePlayers });
    });
  });
};

module.exports = { setupSocketHandlers };
