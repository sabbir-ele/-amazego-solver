/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowItem,
  buildDependencyGraph,
  DependencyGraphResult,
} from './solver/puzzleEngine';
import { SAMPLE_LEVELS, LevelDefinition } from './data/sampleLevels';
import {
  SolverMode,
  TapSpeed,
  SolverSettings,
  VerificationLogItem,
  Language,
} from './types';
import { translations } from './i18n/translations';
import { PhoneSimulator } from './components/PhoneSimulator';
import { Dashboard } from './components/Dashboard';
import { AndroidCodeHub } from './components/AndroidCodeHub';
import { SettingsModal } from './components/SettingsModal';
import { DocumentationView } from './components/DocumentationView';
import { AboutDeveloper } from './components/AboutDeveloper';
import {
  Gamepad2,
  LayoutDashboard,
  Code2,
  Settings as SettingsIcon,
  BookOpen,
  RotateCcw,
  Sparkles,
  Shuffle,
  Volume2,
  VolumeX,
  UserCheck,
} from 'lucide-react';

export default function App() {
  // Settings State
  const [settings, setSettings] = useState<SolverSettings>({
    language: 'en',
    tapSpeed: 'SLOW',
    tapIntervalMs: 1200,
    confidenceThreshold: 94,
    overlayOpacity: 0.95,
    debugVisualsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    strictVerification: true,
  });

  const t = translations[settings.language];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'emulator' | 'dashboard' | 'codeHub' | 'settings' | 'docs' | 'about'>('emulator');

  // Level & Board State
  const [selectedLevelId, setSelectedLevelId] = useState<string>('lvl-1');
  const activeLevel = useMemo(() => {
    return SAMPLE_LEVELS.find((lvl) => lvl.id === selectedLevelId) || SAMPLE_LEVELS[0];
  }, [selectedLevelId]);

  const [arrows, setArrows] = useState<ArrowItem[]>(() => [...activeLevel.arrows]);
  const [boardSize, setBoardSize] = useState<number>(activeLevel.boardSize);

  // Solver Engine State
  const graph: DependencyGraphResult = useMemo(() => {
    return buildDependencyGraph(arrows, boardSize);
  }, [arrows, boardSize]);

  const [solverMode, setSolverMode] = useState<SolverMode>('IDLE');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentStepMessage, setCurrentStepMessage] = useState<string>('Ready to scan screen');
  const [highlightedArrowId, setHighlightedArrowId] = useState<string | null>(null);

  // Metrics
  const [totalDetected, setTotalDetected] = useState<number>(activeLevel.arrows.length);
  const [successfulTaps, setSuccessfulTaps] = useState<number>(0);
  const [failedDetections, setFailedDetections] = useState<number>(0);

  // Logs & History
  const [verificationLogs, setVerificationLogs] = useState<VerificationLogItem[]>([]);
  const [scanHistory, setScanHistory] = useState<
    { id: string; time: string; count: number; solvable: boolean }[]
  >([
    { id: 'scan-init', time: '10:00:15', count: activeLevel.arrows.length, solvable: true },
  ]);

  // Audio synthesizer for feedback (no external assets needed)
  const playSound = (type: 'scan' | 'tap' | 'complete' | 'error') => {
    if (!settings.soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'scan') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'tap') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'complete') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // AudioContext may be restricted by browser policy before first user gesture
    }
  };

  // Reset Board to current level preset
  const handleResetLevel = (level?: LevelDefinition) => {
    const target = level || activeLevel;
    setArrows([...target.arrows]);
    setBoardSize(target.boardSize);
    setTotalDetected(target.arrows.length);
    setSuccessfulTaps(0);
    setSolverMode('IDLE');
    setHighlightedArrowId(null);
    setCurrentStepMessage(`Loaded ${target.name}`);
  };

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    const lvl = SAMPLE_LEVELS.find((l) => l.id === levelId);
    if (lvl) handleResetLevel(lvl);
  };

  // Generate Random Solvable Maze
  const handleGenerateRandom = () => {
    const size = 6;
    const directions: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const colors = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#ec4899', '#06b6d4'];
    const newArrows: ArrowItem[] = [];

    const positions: [number, number][] = [
      [1, 1], [3, 1], [1, 3], [3, 3], [2, 4], [4, 2], [2, 2]
    ];

    positions.forEach(([x, y], idx) => {
      newArrows.push({
        id: `rnd_${idx + 1}`,
        x,
        y,
        direction: directions[idx % directions.length],
        color: colors[idx % colors.length],
        label: `R${idx + 1}`,
        isCurved: idx === 2 || idx === 5,
        curveTurn: idx % 2 === 0 ? 'CLOCKWISE' : 'COUNTER_CLOCKWISE',
      });
    });

    setArrows(newArrows);
    setBoardSize(size);
    setTotalDetected(newArrows.length);
    setSuccessfulTaps(0);
    setSolverMode('IDLE');
    setHighlightedArrowId(null);
    setCurrentStepMessage('Generated new random puzzle maze');
    playSound('scan');
  };

  // Handle Scanning trigger
  const handleScan = () => {
    setIsScanning(true);
    setSolverMode('SCANNING');
    setCurrentStepMessage(t.overlay.scanning);
    playSound('scan');

    setTimeout(() => {
      setIsScanning(false);
      setTotalDetected(arrows.length);
      const solvable = graph.isSolvable;
      setSolverMode('IDLE');
      setCurrentStepMessage(
        solvable
          ? `CV Scan Complete: ${arrows.length} arrows detected (${graph.freeArrowIds.length} ready)`
          : 'CV Scan Complete: Deadlock loop detected!'
      );

      // Record in Scan History
      setScanHistory((prev) => [
        {
          id: `scan-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          count: arrows.length,
          solvable,
        },
        ...prev.slice(0, 9),
      ]);
    }, 900);
  };

  // Manual Mode: highlight next unblocked arrow
  const handleStartManual = () => {
    if (graph.freeArrowIds.length > 0) {
      const nextId = graph.recommendedSequence[0] || graph.freeArrowIds[0];
      setSolverMode('MANUAL');
      setHighlightedArrowId(nextId);
      setCurrentStepMessage(`${t.overlay.nextTap} ${nextId}`);
      playSound('scan');
    } else {
      setCurrentStepMessage(t.emulator.deadlockMessage);
      playSound('error');
    }
  };

  // Handle Arrow Click (User Tap or Automated Tap)
  const handleArrowTap = (arrow: ArrowItem) => {
    const isFree = graph.freeArrowIds.includes(arrow.id);
    if (!isFree) {
      playSound('error');
      setCurrentStepMessage(`Blocked! Arrow ${arrow.id} cannot escape yet.`);
      return;
    }

    playSound('tap');

    // Simulate Post-Tap Screenshot State Verification
    const diffScore = 0.24 + Math.random() * 0.15; // > 0.18 threshold
    const logItem: VerificationLogItem = {
      id: `verif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      arrowId: arrow.id,
      status: 'SUCCESS',
      message: `Verified arrow ${arrow.id} departed screen`,
      preTapConfidence: 0.95,
      postTapDiff: diffScore,
    };
    setVerificationLogs((prev) => [logItem, ...prev.slice(0, 19)]);

    // Remove the cleared arrow from board
    const remaining = arrows.filter((a) => a.id !== arrow.id);
    setArrows(remaining);
    setSuccessfulTaps((prev) => prev + 1);

    if (remaining.length === 0) {
      setSolverMode('COMPLETED');
      setHighlightedArrowId(null);
      setCurrentStepMessage(t.emulator.solvedMessage);
      playSound('complete');
    } else if (solverMode === 'MANUAL') {
      // Update next recommended arrow
      const nextGraph = buildDependencyGraph(remaining, boardSize);
      const nextId = nextGraph.recommendedSequence[0] || nextGraph.freeArrowIds[0];
      setHighlightedArrowId(nextId || null);
      setCurrentStepMessage(nextId ? `${t.overlay.nextTap} ${nextId}` : 'No unblocked arrows');
    }
  };

  // Auto Solver State Machine Runner
  const autoSolveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartAuto = () => {
    if (!graph.isSolvable || graph.freeArrowIds.length === 0) {
      setCurrentStepMessage('Cannot auto-solve: Deadlock or no free arrows.');
      playSound('error');
      return;
    }

    setSolverMode('AUTO_RUNNING');
    setCurrentStepMessage('Auto Solver active: Executing sequence...');
  };

  const handlePause = () => {
    setSolverMode('PAUSED');
    setCurrentStepMessage('Auto Solver Paused');
    if (autoSolveTimerRef.current) clearTimeout(autoSolveTimerRef.current);
  };

  const handleResume = () => {
    setSolverMode('AUTO_RUNNING');
    setCurrentStepMessage('Resuming Auto Solver...');
  };

  const handleEmergencyStop = () => {
    if (autoSolveTimerRef.current) clearTimeout(autoSolveTimerRef.current);
    setSolverMode('IDLE');
    setHighlightedArrowId(null);
    setCurrentStepMessage('Emergency STOP triggered. All operations halted.');
    playSound('error');
  };

  // Auto solver step effect
  useEffect(() => {
    if (solverMode !== 'AUTO_RUNNING') {
      if (autoSolveTimerRef.current) clearTimeout(autoSolveTimerRef.current);
      return;
    }

    if (arrows.length === 0) {
      setSolverMode('COMPLETED');
      setCurrentStepMessage(t.emulator.solvedMessage);
      playSound('complete');
      return;
    }

    if (graph.cycleDetected || graph.freeArrowIds.length === 0) {
      setSolverMode('ERROR');
      setCurrentStepMessage('Safety Halt: Deadlock cycle encountered during auto-solve.');
      playSound('error');
      return;
    }

    // Identify next target arrow from recommended sequence
    const nextArrowId = graph.recommendedSequence[0] || graph.freeArrowIds[0];
    const targetArrow = arrows.find((a) => a.id === nextArrowId);

    if (!targetArrow) return;

    setHighlightedArrowId(nextArrowId);
    setCurrentStepMessage(`Auto tapping Arrow ${nextArrowId}...`);

    autoSolveTimerRef.current = setTimeout(() => {
      handleArrowTap(targetArrow);
    }, settings.tapIntervalMs);

    return () => {
      if (autoSolveTimerRef.current) clearTimeout(autoSolveTimerRef.current);
    };
  }, [solverMode, arrows, graph, settings.tapIntervalMs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Application Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base lg:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  Amaze GO Auto Solver
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Android CV Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Developed by <strong className="text-cyan-300 font-bold">MD. SABBIR RAHMAN</strong> &bull; Universal Arrow Puzzle Automation
              </p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('emulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'emulator'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tabs.emulator}</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tabs.dashboard}</span>
            </button>

            <button
              onClick={() => setActiveTab('codeHub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'codeHub'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tabs.codeHub}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tabs.settings}</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tabs.docs}</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'about'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.tabs.about}</span>
            </button>
          </nav>

          {/* Language Switcher & Audio toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  language: prev.language === 'en' ? 'bn' : 'en',
                }))
              }
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
              title="Toggle Language (English / বাংলা)"
            >
              {settings.language === 'en' ? 'বাংলা' : 'English'}
            </button>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
              }
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={settings.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        {activeTab === 'emulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Level Controller & Actions */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {t.emulator.levelSelect}
                  </h3>
                  <button
                    onClick={() => handleResetLevel()}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.emulator.resetBoard}
                  </button>
                </div>

                {/* Level Preset Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  {SAMPLE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => handleSelectLevel(lvl.id)}
                      className={`w-full p-3 rounded-xl text-left border transition-all ${
                        selectedLevelId === lvl.id
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs">{lvl.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            lvl.difficulty === 'Easy'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : lvl.difficulty === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400'
                              : lvl.difficulty === 'Hard'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {lvl.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{lvl.description}</p>
                    </button>
                  ))}
                </div>

                {/* Random Maze Generator */}
                <button
                  onClick={handleGenerateRandom}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                  {t.emulator.randomLevel}
                </button>
              </div>

              {/* Solving Guidance Card */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Dependency Graph Insights
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Unblocked Exit Arrows:</span>
                    <strong className="text-emerald-400 font-mono">
                      {graph.freeArrowIds.length}
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Puzzle Solvability:</span>
                    <strong
                      className={`font-bold ${
                        graph.isSolvable ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {graph.isSolvable ? 'Solvable (DAG Valid)' : 'Deadlock Cycle'}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Recommended Sequence:</span>
                    <div className="flex flex-wrap gap-1 mt-1 font-mono">
                      {graph.recommendedSequence.length > 0 ? (
                        graph.recommendedSequence.map((id, idx) => (
                          <span
                            key={id}
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              idx === 0
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {idx + 1}. {id}
                          </span>
                        ))
                      ) : (
                        <span className="italic text-slate-500">None available</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Phone Simulator hosting Amaze GO & Floating Overlay */}
            <div className="lg:col-span-7 flex justify-center">
              <PhoneSimulator
                arrows={arrows}
                graph={graph}
                boardSize={boardSize}
                mode={solverMode}
                settings={settings}
                t={t}
                totalDetected={totalDetected}
                remainingCount={arrows.length}
                successfulTaps={successfulTaps}
                currentStepMessage={currentStepMessage}
                isScanning={isScanning}
                highlightedArrowId={highlightedArrowId}
                onArrowClick={handleArrowTap}
                onScan={handleScan}
                onStartManual={handleStartManual}
                onStartAuto={handleStartAuto}
                onPause={handlePause}
                onResume={handleResume}
                onEmergencyStop={handleEmergencyStop}
                onChangeSpeed={(spd: TapSpeed) =>
                  setSettings((prev) => ({
                    ...prev,
                    tapSpeed: spd,
                    tapIntervalMs: spd === 'SLOW' ? 1200 : spd === 'NORMAL' ? 600 : 300,
                  }))
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            t={t}
            totalDetected={totalDetected}
            remainingCount={arrows.length}
            successfulTaps={successfulTaps}
            failedDetections={failedDetections}
            solverMode={solverMode}
            verificationLogs={verificationLogs}
            scanHistory={scanHistory}
            onTriggerScan={() => {
              setActiveTab('emulator');
              handleScan();
            }}
            onOpenCodeHub={() => setActiveTab('codeHub')}
          />
        )}

        {activeTab === 'codeHub' && <AndroidCodeHub t={t} />}

        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            t={t}
            onUpdateSettings={(newVals) =>
              setSettings((prev) => ({ ...prev, ...newVals }))
            }
            onResetDefaults={() =>
              setSettings({
                language: 'en',
                tapSpeed: 'SLOW',
                tapIntervalMs: 1200,
                confidenceThreshold: 94,
                overlayOpacity: 0.95,
                debugVisualsEnabled: true,
                soundEnabled: true,
                vibrationEnabled: true,
                strictVerification: true,
              })
            }
          />
        )}

        {activeTab === 'docs' && <DocumentationView t={t} />}

        {activeTab === 'about' && <AboutDeveloper t={t} />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/60 px-4 py-4 text-center text-xs text-slate-500">
        <p>
          Amaze GO Auto Solver &bull; Developed by <strong className="text-slate-300">MD. SABBIR RAHMAN</strong> (App Developer &amp; Creator) &bull; Native Android OpenCV &amp; Accessibility Engine
        </p>
      </footer>
    </div>
  );
}
