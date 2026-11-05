import React, { useState, useEffect } from 'react';
import {
  ArrowItem,
  Direction,
  getDirectionVector,
  getExitDirection,
  DependencyGraphResult,
} from '../solver/puzzleEngine';
import { SolverMode, SolverSettings } from '../types';
import { Translations } from '../i18n/translations';
import { VisualDebugOverlay } from './VisualDebugOverlay';
import { FloatingOverlay } from './FloatingOverlay';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';

interface PhoneSimulatorProps {
  arrows: ArrowItem[];
  graph: DependencyGraphResult;
  boardSize: number;
  mode: SolverMode;
  settings: SolverSettings;
  t: Translations;
  totalDetected: number;
  remainingCount: number;
  successfulTaps: number;
  currentStepMessage: string;
  isScanning: boolean;
  highlightedArrowId: string | null;
  onArrowClick: (arrow: ArrowItem) => void;
  onScan: () => void;
  onStartManual: () => void;
  onStartAuto: () => void;
  onPause: () => void;
  onResume: () => void;
  onEmergencyStop: () => void;
  onChangeSpeed: (speed: any) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  arrows,
  graph,
  boardSize,
  mode,
  settings,
  t,
  totalDetected,
  remainingCount,
  successfulTaps,
  currentStepMessage,
  isScanning,
  highlightedArrowId,
  onArrowClick,
  onScan,
  onStartManual,
  onStartAuto,
  onPause,
  onResume,
  onEmergencyStop,
  onChangeSpeed,
}) => {
  const [shakingArrowId, setShakingArrowId] = useState<string | null>(null);
  const [flyingArrowIds, setFlyingArrowIds] = useState<string[]>([]);
  const [tapRipple, setTapRipple] = useState<{ x: number; y: number } | null>(null);

  // Tile dimension in pixels within the phone container
  const tileSize = 52;
  const boardPx = boardSize * tileSize;

  const handleArrowTap = (arrow: ArrowItem, e: React.MouseEvent) => {
    // Show tap ripple
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTapRipple({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => setTapRipple(null), 400);

    const isFree = graph.freeArrowIds.includes(arrow.id);
    if (isFree) {
      setFlyingArrowIds((prev) => [...prev, arrow.id]);
      setTimeout(() => {
        onArrowClick(arrow);
        setFlyingArrowIds((prev) => prev.filter((id) => id !== arrow.id));
      }, 350);
    } else {
      setShakingArrowId(arrow.id);
      setTimeout(() => setShakingArrowId(null), 500);
    }
  };

  return (
    <div className="relative flex justify-center items-center py-4 select-none">
      {/* Phone Hardware Mockup Frame */}
      <div className="relative w-[380px] h-[720px] rounded-[48px] bg-slate-950 p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ring-1 ring-slate-800" />
          <div className="w-2 h-2 rounded-full bg-slate-800" />
        </div>

        {/* Phone Status Bar */}
        <div className="relative z-30 pt-3 pb-2 px-6 flex justify-between items-center text-[11px] text-slate-300 font-medium">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Viewport */}
        <div className="relative flex-1 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 rounded-[36px] overflow-hidden flex flex-col border border-slate-800/80">
          
          {/* Game Header Bar */}
          <div className="px-4 py-2 flex items-center justify-between bg-slate-900/60 backdrop-blur-md border-b border-slate-800/50 z-10">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                AMAZE GO!
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {t.emulator.level} 42
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-semibold text-slate-200">{arrows.length}</span>
            </div>
          </div>

          {/* Game Board Playing Area */}
          <div className="relative flex-1 flex flex-col items-center justify-start pt-3 px-3 overflow-hidden">
            {/* Background Grid Pattern */}
            <div
              className="relative rounded-2xl bg-slate-900/40 p-1 border border-slate-800/60 shadow-inner"
              style={{
                width: `${boardPx}px`,
                height: `${boardPx}px`,
              }}
            >
              {/* Subtle Grid Dots */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none rounded-2xl"
                style={{
                  backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                  backgroundSize: `${tileSize}px ${tileSize}px`,
                }}
              />

              {/* Laser Scanning Animation Effect */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-2xl">
                  <div className="w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_1.5s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[0.5px]" />
                </div>
              )}

              {/* Visual Computer Vision Debug Layer */}
              <VisualDebugOverlay
                arrows={arrows}
                graph={graph}
                boardSize={boardSize}
                tileSize={tileSize}
                enabled={settings.debugVisualsEnabled}
              />

              {/* Render Puzzle Arrows */}
              {arrows.map((arrow) => {
                const isFree = graph.freeArrowIds.includes(arrow.id);
                const isHighlighted = highlightedArrowId === arrow.id;
                const isFlying = flyingArrowIds.includes(arrow.id);
                const isShaking = shakingArrowId === arrow.id;
                const exitDir = getExitDirection(arrow);
                const [dx, dy] = getDirectionVector(exitDir);

                // Flight translation offset
                const flyTransform = isFlying
                  ? `translate(${dx * 350}px, ${dy * 350}px) scale(0.6)`
                  : 'none';

                return (
                  <div
                    key={arrow.id}
                    onClick={(e) => handleArrowTap(arrow, e)}
                    className={`absolute flex items-center justify-center cursor-pointer transition-all ${
                      isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
                    }`}
                    style={{
                      left: `${arrow.x * tileSize}px`,
                      top: `${arrow.y * tileSize}px`,
                      width: `${tileSize}px`,
                      height: `${tileSize}px`,
                      transform: flyTransform,
                      opacity: isFlying ? 0 : 1,
                      transitionDuration: isFlying ? '350ms' : '200ms',
                      zIndex: isHighlighted ? 25 : 15,
                    }}
                  >
                    {/* Highlight Ring for Recommended Next Move */}
                    {isHighlighted && (
                      <div className="absolute -inset-1.5 rounded-2xl border-2 border-emerald-400 animate-ping opacity-75 pointer-events-none" />
                    )}

                    {/* Arrow Graphic Body */}
                    <div
                      className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-transform hover:scale-110 shadow-md ${
                        isHighlighted
                          ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-105'
                          : ''
                      }`}
                      style={{
                        backgroundColor: arrow.color || '#3b82f6',
                      }}
                    >
                      {/* Arrow Icon with Direction Rotation */}
                      <RenderArrowGraphic arrow={arrow} />

                      {/* Direction Pip */}
                      <span className="sr-only">{arrow.direction}</span>
                    </div>

                    {/* Manual Mode Next Badge */}
                    {isHighlighted && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-400 text-slate-950 shadow-md tracking-wider">
                        TAP
                      </div>
                    )}
                  </div>
                );
              })}

              {/* All Cleared Message */}
              {arrows.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {t.emulator.solvedMessage}
                  </h4>
                  <p className="text-xs text-slate-400">
                    All puzzle objects successfully resolved.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Simulated Floating Overlay (Within the Phone screen boundaries) */}
          <FloatingOverlay
            mode={mode}
            settings={settings}
            t={t}
            totalDetected={totalDetected}
            remainingCount={remainingCount}
            successfulTaps={successfulTaps}
            currentStepMessage={currentStepMessage}
            isSolvable={graph.isSolvable}
            cycleDetected={graph.cycleDetected}
            onScan={onScan}
            onStartManual={onStartManual}
            onStartAuto={onStartAuto}
            onPause={onPause}
            onResume={onResume}
            onEmergencyStop={onEmergencyStop}
            onChangeSpeed={onChangeSpeed}
          />

          {/* Simulated Gesture Ripple */}
          {tapRipple && (
            <div
              className="fixed pointer-events-none z-50 w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-cyan-400 bg-cyan-400/30 animate-ping"
              style={{ left: `${tapRipple.x}px`, top: `${tapRipple.y}px` }}
            />
          )}

          {/* Phone Bottom Home Indicator */}
          <div className="relative z-30 py-2 flex justify-center">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper to render straight or curved arrow glyphs
 */
const RenderArrowGraphic: React.FC<{ arrow: ArrowItem }> = ({ arrow }) => {
  const getRotation = (dir: Direction): number => {
    switch (dir) {
      case 'UP': return -90;
      case 'RIGHT': return 0;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
      case 'UP_RIGHT': return -45;
      case 'DOWN_RIGHT': return 45;
      case 'DOWN_LEFT': return 135;
      case 'UP_LEFT': return -135;
      default: return 0;
    }
  };

  const rot = getRotation(arrow.direction);

  if (arrow.isCurved) {
    // 90 degree curved turn path
    const isClockwise = arrow.curveTurn === 'CLOCKWISE';
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 text-white drop-shadow"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        <path
          d={
            isClockwise
              ? 'M 5 19 L 5 12 Q 5 7 10 7 L 16 7 M 13 4 L 17 7 L 13 10'
              : 'M 5 5 L 5 12 Q 5 17 10 17 L 16 17 M 13 14 L 17 17 L 13 20'
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Straight arrow
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-white drop-shadow"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <path
        d="M 4 12 L 18 12 M 13 6 L 19 12 L 13 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
