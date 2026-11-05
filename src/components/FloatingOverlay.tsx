import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  Scan,
  Compass,
  Zap,
  Minimize2,
  Maximize2,
  GripHorizontal,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { SolverMode, TapSpeed, SolverSettings } from '../types';
import { Translations } from '../i18n/translations';

interface FloatingOverlayProps {
  mode: SolverMode;
  settings: SolverSettings;
  t: Translations;
  totalDetected: number;
  remainingCount: number;
  successfulTaps: number;
  currentStepMessage: string;
  isSolvable: boolean;
  cycleDetected: boolean;
  onScan: () => void;
  onStartManual: () => void;
  onStartAuto: () => void;
  onPause: () => void;
  onResume: () => void;
  onEmergencyStop: () => void;
  onChangeSpeed: (speed: TapSpeed) => void;
}

export const FloatingOverlay: React.FC<FloatingOverlayProps> = ({
  mode,
  settings,
  t,
  totalDetected,
  remainingCount,
  successfulTaps,
  currentStepMessage,
  isSolvable,
  cycleDetected,
  onScan,
  onStartManual,
  onStartAuto,
  onPause,
  onResume,
  onEmergencyStop,
  onChangeSpeed,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 355 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const progressPercent = totalDetected > 0 
    ? Math.round(((totalDetected - remainingCount) / totalDetected) * 100)
    : 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const newX = Math.max(10, Math.min(220, e.clientX - dragStartRef.current.x));
    const newY = Math.max(10, Math.min(480, e.clientY - dragStartRef.current.y));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  if (isMinimized) {
    return (
      <div
        className="absolute z-40 transition-transform cursor-pointer select-none"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => setIsMinimized(false)}
        title={t.overlay.title}
      >
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/90 border-2 border-cyan-400 shadow-2xl backdrop-blur-md text-cyan-400 hover:scale-105 transition-all">
          <Zap className="w-6 h-6 animate-pulse" />
          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
            {progressPercent}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute z-40 w-72 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-xl select-none text-slate-100 transition-shadow"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: `rgba(15, 23, 42, ${settings.overlayOpacity})`,
      }}
    >
      {/* Draggable Title Header */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-700/60 cursor-grab active:cursor-grabbing bg-slate-800/40 rounded-t-2xl"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-cyan-300">
              {t.overlay.title}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700/50"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="p-3.5 space-y-3">
        {/* Status Bar */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>{t.dashboard.progress}:</span>
            <span className="font-semibold text-cyan-400">{progressPercent}%</span>
          </div>
          {/* Progress track */}
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] pt-1">
            <span className="text-slate-400">
              {t.dashboard.remaining}: <strong className="text-white">{remainingCount}</strong>
            </span>
            <span className="text-slate-400">
              {t.dashboard.successfulTaps}: <strong className="text-emerald-400">{successfulTaps}</strong>
            </span>
          </div>

          {/* Current Action / Warning Message */}
          <div className="pt-1 text-[11px] truncate flex items-center gap-1.5">
            {cycleDetected ? (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                {t.emulator.deadlockMessage}
              </span>
            ) : mode === 'COMPLETED' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                {t.emulator.solvedMessage}
              </span>
            ) : (
              <span className="text-slate-300 italic">{currentStepMessage || 'Ready to scan.'}</span>
            )}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Scan Screen */}
          <button
            onClick={onScan}
            disabled={mode === 'SCANNING' || mode === 'AUTO_RUNNING'}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400" />
            {mode === 'SCANNING' ? t.overlay.scanning : t.overlay.scan}
          </button>

          {/* Manual Mode */}
          <button
            onClick={onStartManual}
            disabled={mode === 'SCANNING' || mode === 'AUTO_RUNNING'}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-colors ${
              mode === 'MANUAL'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            {t.overlay.manualMode}
          </button>
        </div>

        {/* Full Auto Solve CTA */}
        {mode !== 'AUTO_RUNNING' && mode !== 'PAUSED' ? (
          <button
            onClick={onStartAuto}
            disabled={cycleDetected || !isSolvable || remainingCount === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            {t.overlay.autoSolve}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {mode === 'AUTO_RUNNING' ? (
              <button
                onClick={onPause}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/50 hover:bg-amber-600/40"
              >
                <Pause className="w-3.5 h-3.5" />
                {t.overlay.pause}
              </button>
            ) : (
              <button
                onClick={onResume}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-600/40"
              >
                <Play className="w-3.5 h-3.5 fill-cyan-300" />
                {t.overlay.resume}
              </button>
            )}

            <button
              onClick={onEmergencyStop}
              className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl bg-rose-600/40 text-rose-300 border border-rose-500/60 hover:bg-rose-600/60"
            >
              <Square className="w-3.5 h-3.5 fill-rose-300" />
              {t.overlay.emergencyStop}
            </button>
          </div>
        )}

        {/* Speed Selector */}
        <div className="pt-1 border-t border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-400 pb-1.5">
            <span>{t.emulator.speed}:</span>
            <span className="text-cyan-300 font-medium">
              {settings.tapSpeed === 'SLOW' ? '1200ms' : settings.tapSpeed === 'NORMAL' ? '600ms' : '300ms'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800">
            {(['SLOW', 'NORMAL', 'FAST'] as TapSpeed[]).map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`py-1 text-[10px] font-medium rounded-md transition-colors ${
                  settings.tapSpeed === spd
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd === 'SLOW' ? 'Slow' : spd === 'NORMAL' ? 'Norm' : 'Fast'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
