import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Gamepad2 } from 'lucide-react';

export const TouchControls = () => {
  const [showDpad, setShowDpad] = useState(false);
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const roll = useGameStore((s) => s.roll);

  return (
    <div className="touch-controls-wrapper">
      {/* Floating Mini Toggle Button */}
      <button
        className={`touch-dpad-toggle-btn ${showDpad ? 'active' : ''}`}
        onClick={() => setShowDpad(!showDpad)}
        title={showDpad ? 'Hide On-Screen D-Pad' : 'Show On-Screen D-Pad'}
      >
        <Gamepad2 size={20} />
      </button>

      {/* D-Pad Buttons (Hidden by default for clean full-screen touch swipes) */}
      {showDpad && (
        <div className="touch-controls-container">
          <div className="touch-dpad">
            <button
              className="touch-btn touch-up"
              onPointerDown={(e) => {
                e.preventDefault();
                jump();
              }}
              title="Jump"
            >
              <ArrowUp size={24} />
              <span>JUMP</span>
            </button>

            <div className="touch-horizontal-row">
              <button
                className="touch-btn touch-left"
                onPointerDown={(e) => {
                  e.preventDefault();
                  moveLeft();
                }}
                title="Move Left"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                className="touch-btn touch-right"
                onPointerDown={(e) => {
                  e.preventDefault();
                  moveRight();
                }}
                title="Move Right"
              >
                <ArrowRight size={24} />
              </button>
            </div>

            <button
              className="touch-btn touch-down"
              onPointerDown={(e) => {
                e.preventDefault();
                roll();
              }}
              title="Slide / Roll"
            >
              <ArrowDown size={24} />
              <span>ROLL</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
