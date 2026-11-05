import React from 'react';
import {
  ShieldCheck,
  Activity,
  Layers,
  Hand,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Translations } from '../i18n/translations';
import { VerificationLogItem, SolverMode } from '../types';

interface DashboardProps {
  t: Translations;
  totalDetected: number;
  remainingCount: number;
  successfulTaps: number;
  failedDetections: number;
  solverMode: SolverMode;
  verificationLogs: VerificationLogItem[];
  scanHistory: { id: string; time: string; count: number; solvable: boolean }[];
  onTriggerScan: () => void;
  onOpenCodeHub: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  t,
  totalDetected,
  remainingCount,
  successfulTaps,
  failedDetections,
  solverMode,
  verificationLogs,
  scanHistory,
  onTriggerScan,
  onOpenCodeHub,
}) => {
  const progressPercent = totalDetected > 0
    ? Math.round(((totalDetected - remainingCount) / totalDetected) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            OpenCV & Accessibility Engine
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            {t.appTitle}
          </h2>
          <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
            {t.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onTriggerScan}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25"
            >
              <Activity className="w-4 h-4" />
              {t.overlay.scan}
            </button>
            <button
              onClick={onOpenCodeHub}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
            >
              {t.tabs.codeHub}
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Decorative background orb */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Real-Time Metrics Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          {t.dashboard.statsTitle}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              {t.dashboard.totalDetected}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{totalDetected}</span>
              <span className="text-xs text-cyan-400">items</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              {t.dashboard.remaining}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400">{remainingCount}</span>
              <span className="text-xs text-slate-400">active</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              {t.dashboard.successfulTaps}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{successfulTaps}</span>
              <span className="text-xs text-emerald-400/80">cleared</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium block mb-1">
              {t.dashboard.progress}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-400">{progressPercent}%</span>
              <span className="text-xs text-slate-400">completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Android Permissions Status */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {t.dashboard.permissionsTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                {t.dashboard.permissionOverlay}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Floating assistant overlay
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                {t.dashboard.granted}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                {t.dashboard.permissionAccess}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automated gesture dispatch
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                {t.dashboard.granted}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                {t.dashboard.permissionMedia}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Screen capture & CV frame input
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                {t.dashboard.granted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Logs & Scan History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Logs */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
            <span>{t.dashboard.verificationLog}</span>
            <span className="text-xs font-normal text-slate-400">
              Screenshot Diff Verification
            </span>
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {verificationLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No verifications recorded. Run Auto Solve to view real-time screenshot checks.
              </div>
            ) : (
              verificationLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    {log.status === 'SUCCESS' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-200">
                        Arrow {log.arrowId}
                      </span>
                      <p className="text-[10px] text-slate-400">{log.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] text-cyan-400">
                      Δ {(log.postTapDiff * 100).toFixed(1)}%
                    </span>
                    <span className="block text-[9px] text-slate-500">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scan History */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
            <span>{t.dashboard.scanHistory}</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {scanHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {t.dashboard.noHistory}
              </div>
            ) : (
              scanHistory.map((scan) => (
                <div
                  key={scan.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <div>
                      <span className="font-semibold text-slate-200">
                        {scan.count} Arrows Detected
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {scan.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      scan.solvable
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {scan.solvable ? 'Solvable' : 'Deadlock'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
