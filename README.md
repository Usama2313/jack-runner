# Jack Runner (Subway Surfers 3D Online)

A multiplayer 3D endless runner game built with React Three Fiber, Socket.IO, and Express.

## 🎮 Features
- 3D endless runner gameplay
- Real-time multiplayer leaderboard via Socket.IO
- Authentication (register / login)
- Coin collection, obstacles, and character selection
- Global leaderboard with live updates

## 🏗 Project Structure

```
game/
├── client/   # Vite + React + React Three Fiber frontend
└── server/   # Express + Socket.IO backend
```

## 🚀 Getting Started

### Backend (server)
```bash
cd server
npm install
npm start
```

### Frontend (client)
```bash
cd client
npm install
npm run dev
```

## 🌐 Environment Variables

### Client (`client/.env`)
```
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

### Server (`server/.env`)
```
PORT=3001
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## 🔧 Health Check

`GET /api/health` — returns server status, uptime, and timestamp.

## 🚢 Deployment

- **Frontend**: Vercel (auto-detects Vite, root = `client/`)
- **Backend**: Render / Railway / any Node.js host (root = `server/`)
