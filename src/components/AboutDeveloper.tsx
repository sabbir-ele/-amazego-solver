import React from 'react';
import {
  UserCheck,
  ShieldCheck,
  Award,
  Sparkles,
  Smartphone,
  Cpu,
  Layers,
  Code2,
  Lock,
} from 'lucide-react';
import { Translations } from '../i18n/translations';

interface AboutDeveloperProps {
  t: Translations;
}

export const AboutDeveloper: React.FC<AboutDeveloperProps> = ({ t }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Developer Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar / Badge */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/20 text-slate-950 font-black text-3xl">
            SR
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
              <UserCheck className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Verified Official Developer Profile
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {t.about.developerName}
            </h2>
            <p className="text-sm md:text-base font-semibold text-cyan-300">
              {t.about.roleValue}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              {t.about.attribution}
            </p>
          </div>

          {/* Quick Version Pill */}
          <div className="px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t.about.versionTitle}
            </span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              {t.about.versionValue}
            </span>
          </div>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Official Developer Details Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            {t.about.developerTitle}
          </div>
          <div className="text-base font-bold text-white">
            {t.about.developerName}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lead architect, author, and creator of the Amaze GO Universal Arrow Puzzle Auto Solver project.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            {t.about.appTitle}
          </div>
          <div className="text-base font-bold text-white">
            {t.about.appValue}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Native Android assistant incorporating MediaProjection screen capture, OpenCV arrow feature extraction, and accessibility gestures.
          </p>
        </div>
      </div>

      {/* Project Credits & Architecture */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          {t.about.creditsTitle}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {t.about.creditsText}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-cyan-400 block mb-0.5">Computer Vision</strong>
            OpenCV contours, moments, and directional raycasting.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-emerald-400 block mb-0.5">Constraint Solver</strong>
            Topological sorting & cycle deadlock prevention.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-amber-400 block mb-0.5">Android Automation</strong>
            AccessibilityService gesture dispatch & verification.
          </div>
        </div>
      </div>

      {/* Privacy & User Safety Statement */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-400" />
          {t.about.privacyTitle}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {t.about.privacyText}
        </p>
        <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          100% On-Device Execution &bull; Zero External Network Telemetry &bull; User Governed
        </div>
      </div>

      {/* Prominent Official Footer Attribution Badge */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
        <span className="text-xs md:text-sm font-bold text-cyan-300">
          Developed by MD. SABBIR RAHMAN &bull; Official Creator & Project Owner
        </span>
      </div>
    </div>
  );
};
