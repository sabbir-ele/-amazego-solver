import React from 'react';
import {
  Settings,
  Languages,
  Sliders,
  Eye,
  Volume2,
  Vibrate,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { SolverSettings, Language, TapSpeed } from '../types';
import { Translations } from '../i18n/translations';

interface SettingsModalProps {
  settings: SolverSettings;
  t: Translations;
  onUpdateSettings: (newSettings: Partial<SolverSettings>) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  t,
  onUpdateSettings,
  onResetDefaults,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">{t.settings.title}</h2>
          </div>
          <button
            onClick={onResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.settings.resetDefaults}
          </button>
        </div>

        <div className="pt-6 space-y-6 text-sm">
          {/* Language Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <Languages className="w-4 h-4 text-cyan-400" />
                {t.settings.language}
              </label>
              <p className="text-xs text-slate-400">
                Choose interface language (English / বাংলা)
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.language === 'en'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onUpdateSettings({ language: 'bn' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.language === 'bn'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা (Bengali)
              </button>
            </div>
          </div>

          {/* Speed Preset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-slate-800/80">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                {t.settings.tapSpeed}
              </label>
              <p className="text-xs text-slate-400">
                Execution speed between gesture taps
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['SLOW', 'NORMAL', 'FAST'] as TapSpeed[]).map((spd) => (
                <button
                  key={spd}
                  onClick={() =>
                    onUpdateSettings({
                      tapSpeed: spd,
                      tapIntervalMs: spd === 'SLOW' ? 1200 : spd === 'NORMAL' ? 600 : 300,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.tapSpeed === spd
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Tap Interval Slider */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                {t.settings.tapInterval}
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {settings.tapIntervalMs} ms
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={settings.tapIntervalMs}
              onChange={(e) =>
                onUpdateSettings({ tapIntervalMs: parseInt(e.target.value, 10) })
              }
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Confidence Threshold */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                {t.settings.confidenceThreshold}
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {settings.confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="99"
              step="1"
              value={settings.confidenceThreshold}
              onChange={(e) =>
                onUpdateSettings({ confidenceThreshold: parseInt(e.target.value, 10) })
              }
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Overlay Opacity */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">
                {t.settings.overlayTransparency}
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {Math.round(settings.overlayOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={settings.overlayOpacity}
              onChange={(e) =>
                onUpdateSettings({ overlayOpacity: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Visual Debug Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                {t.settings.debugOverlay}
              </label>
              <p className="text-xs text-slate-400">
                Display contour bounding boxes, raycasts, and dependency arrows
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.debugVisualsEnabled}
              onChange={(e) =>
                onUpdateSettings({ debugVisualsEnabled: e.target.checked })
              }
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Sound & Haptics */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                {t.settings.soundEffects}
              </label>
              <p className="text-xs text-slate-400">
                Audio chime on scan, successful solve, and error
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                onUpdateSettings({ soundEnabled: e.target.checked })
              }
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Strict Verification */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <div>
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t.settings.strictVerification}
              </label>
              <p className="text-xs text-slate-400">
                Halt immediately if post-tap screenshot does not show arrow disappearance
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.strictVerification}
              onChange={(e) =>
                onUpdateSettings({ strictVerification: e.target.checked })
              }
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
