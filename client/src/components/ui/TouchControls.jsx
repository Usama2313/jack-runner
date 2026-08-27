import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

export const TouchControls = () => {
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const roll = useGameStore((s) => s.roll);

  return (
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
          <ArrowUp size={28} />
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
            <ArrowLeft size={28} />
          </button>

          <button
            className="touch-btn touch-right"
            onPointerDown={(e) => {
              e.preventDefault();
              moveRight();
            }}
            title="Move Right"
          >
            <ArrowRight size={28} />
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
          <ArrowDown size={28} />
          <span>ROLL</span>
        </button>
      </div>
    </div>
  );
};
