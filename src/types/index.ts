import { ArrowItem, Direction, DependencyGraphResult } from '../solver/puzzleEngine';

export type Language = 'en' | 'bn';

export type SolverMode = 'IDLE' | 'SCANNING' | 'MANUAL' | 'AUTO_RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';

export type TapSpeed = 'SLOW' | 'NORMAL' | 'FAST';

export interface SolverSettings {
  language: Language;
  tapSpeed: TapSpeed;
  tapIntervalMs: number;
  confidenceThreshold: number;
  overlayOpacity: number;
  debugVisualsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  strictVerification: boolean;
}

export interface VerificationLogItem {
  id: string;
  timestamp: string;
  arrowId: string;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  message: string;
  preTapConfidence: number;
  postTapDiff: number;
}

export interface AndroidProjectFile {
  path: string;
  name: string;
  category: 'kotlin' | 'gradle' | 'manifest' | 'res' | 'docs';
  content: string;
}
