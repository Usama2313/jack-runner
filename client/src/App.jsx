import React, { useState } from 'react';
import { GameCanvas } from './components/game/GameCanvas';
import { HUD } from './components/ui/HUD';
import { MainMenu } from './components/ui/MainMenu';
import { GameOver } from './components/ui/GameOver';
import { LevelComplete } from './components/ui/LevelComplete';
import { PauseOverlay } from './components/ui/PauseOverlay';
import { LeaderboardModal } from './components/ui/LeaderboardModal';
import { ShopModal } from './components/ui/ShopModal';
import { AuthModal } from './components/ui/AuthModal';
import { TouchControls } from './components/ui/TouchControls';
import { useGameStore } from './store/gameStore';
import { useInput } from './hooks/useInput';
import { useSocket } from './hooks/useSocket';
import { GAME_STATES } from './utils/constants';

export default function App() {
  const gameState = useGameStore((s) => s.gameState);

  // Initialize input and socket listeners
  useInput();
  useSocket();

  // Modals state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="game-app-root">
      {/* 3D WebGL Canvas always active in background with dynamic camera */}
      <GameCanvas />

      {/* In-Game Heads Up Display */}
      {gameState === GAME_STATES.PLAYING && (
        <>
          <HUD />
          <TouchControls />
        </>
      )}

      {/* Main Menu Screen */}
      {gameState === GAME_STATES.MENU && (
        <MainMenu
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenAuth={() => setShowAuth(true)}
        />
      )}

      {/* Pause Screen */}
      {gameState === GAME_STATES.PAUSED && <PauseOverlay />}

      {/* Level Cleared Screen */}
      {gameState === GAME_STATES.LEVEL_COMPLETE && <LevelComplete />}

      {/* Game Over Screen */}
      {gameState === GAME_STATES.GAME_OVER && (
        <GameOver onOpenLeaderboard={() => setShowLeaderboard(true)} />
      )}

      {/* Modals */}
      {showLeaderboard && (
        <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
      )}

      {showShop && (
        <ShopModal onClose={() => setShowShop(false)} />
      )}

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}
