import React from 'react';
import {
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Translations } from '../i18n/translations';

interface DocumentationViewProps {
  t: Translations;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ t }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-200">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Amaze GO Auto Solver Architecture & Engineering Guide
          </h2>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Comprehensive breakdown of the computer vision pipeline, dependency graph puzzle engine,
          accessibility gesture dispatching, and Android Studio build instructions.
        </p>

        {/* Developer Attribution Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
              Official App Developer & Creator
            </span>
            <span className="text-sm font-extrabold text-white">
              MD. SABBIR RAHMAN
            </span>
            <span className="text-xs text-slate-400 block">
              Project Owner &bull; Developed by MD. SABBIR RAHMAN
            </span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold self-start sm:self-auto">
            Amaze GO Auto Solver &bull; v1.0.0
          </div>
        </div>
      </div>

      {/* 1. Android System Architecture */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          1. System Architecture & Lifecycle
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The app operates as a non-intrusive floating assistant above <em>Amaze GO!</em>. It complies strictly
          with Android sandbox and permission models:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-cyan-400 block mb-1">
              FloatingOverlayService (TYPE_APPLICATION_OVERLAY)
            </strong>
            Runs as a foreground service with a persistent notification. Mounts a draggable WindowManager view,
            allowing the player to trigger scans, toggle Manual/Auto mode, or press Emergency Stop without switching apps.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-indigo-400 block mb-1">
              ScreenCaptureManager (MediaProjection API)
            </strong>
            Uses <code className="text-cyan-300">MediaProjectionManager.createScreenCaptureIntent()</code> to acquire real-time display frames via an <code className="text-cyan-300">ImageReader</code> surface without requiring root access.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-emerald-400 block mb-1">
              AutoTapAccessibilityService
            </strong>
            Dispatches synthetic touch gestures using <code className="text-cyan-300">dispatchGesture(GestureDescription)</code> directly at the exact pixel coordinates calculated by the solver.
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <strong className="text-amber-400 block mb-1">
              GameStateVerifier (Screenshot Diff)
            </strong>
            Captures a post-tap frame after animation delay, extracts the bounding ROI of the tapped arrow, and computes absolute difference to ensure the arrow was cleared before executing the next move.
          </div>
        </div>
      </div>

      {/* 2. Computer Vision Pipeline */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          2. Arrow Detection & Computer Vision Pipeline (OpenCV)
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
          <li>
            <strong className="text-white">Pre-processing:</strong> Convert RGBA to Grayscale, apply 5x5 Gaussian blur to suppress fine UI noise, and perform adaptive thresholding to extract high-contrast silhouettes of puzzle objects.
          </li>
          <li>
            <strong className="text-white">Contour & Moments:</strong> <code className="text-cyan-300">Imgproc.findContours</code> filters out background elements by area thresholds (350 to 40,000 px). Moments calculate the center of mass (Centroid: <code className="text-cyan-300">cx = m10/m00</code>).
          </li>
          <li>
            <strong className="text-white">Arrow Head Tip Detection:</strong> Polygonal approximation (<code className="text-cyan-300">approxPolyDP</code>) identifies the acute vertex farthest from the centroid. The vector from centroid to tip yields the orientation angle.
          </li>
          <li>
            <strong className="text-white">Curved Arrow Tracing:</strong> When an arrow has a 90° bend or S-curve, principal component analysis (PCA) detects the body orientation vs the exit head direction, enabling accurate trajectory modeling.
          </li>
        </ol>
      </div>

      {/* 3. Puzzle Solving Algorithm */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          3. Constraint-Based Topological Solving Algorithm
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The solver models the board as a Directed Acyclic Graph (DAG) <code className="text-cyan-300">G = (V, E)</code> where each arrow is a vertex, and a directed edge <code className="text-cyan-300">B &rarr; A</code> denotes that Arrow B blocks the exit path of Arrow A.
        </p>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-semibold text-emerald-400">Step 1: Trajectory Raycast</span> &mdash;
            For each arrow A, project its exit ray outward to the edge of the board. If the ray intersects another arrow B's occupied space, register B as a blocker of A (in-degree of A increments).
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-semibold text-cyan-400">Step 2: Kahn's Algorithm + Heuristics</span> &mdash;
            Identify all arrows with in-degree = 0 (unblocked). From the unblocked set, select the arrow that unblocks the highest count of downstream arrows.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="font-semibold text-rose-400">Step 3: Deadlock / Cycle Detection</span> &mdash;
            If arrows remain but all have in-degree &gt; 0, a cyclic dependency exists. The engine halts and notifies the user rather than risking arbitrary, erroneous taps.
          </div>
        </div>
      </div>

      {/* 4. Android Studio Build Instructions */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          4. Android Studio Build & Deployment Steps
        </h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300">
            # 1. Download zip from Android Source Files tab and extract<br />
            unzip AmazeGo_AutoSolver_AndroidStudio.zip -d AmazeGoAutoSolver<br />
            cd AmazeGoAutoSolver<br />
            <br />
            # 2. Build Debug APK with Gradle<br />
            ./gradlew assembleDebug<br />
            <br />
            # 3. Install on connected Android device via ADB<br />
            adb install app/build/outputs/apk/debug/app-debug.apk
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <div className="flex items-center gap-2 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              Runtime Permission Setup
            </div>
            When launching for the first time:
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-200/90">
              <li>Enable "Display over other apps" in Settings &gt; Apps &gt; Special app access.</li>
              <li>Enable "Amaze GO Auto Solver" in Settings &gt; Accessibility.</li>
              <li>Tap "Start Floating Assistant" and accept the MediaProjection screen capture prompt.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
