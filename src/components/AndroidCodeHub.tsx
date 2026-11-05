import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  FileCode,
  Download,
  Copy,
  Check,
  FolderGit2,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { Translations } from '../i18n/translations';

interface AndroidCodeHubProps {
  t: Translations;
}

export const AndroidCodeHub: React.FC<AndroidCodeHubProps> = ({ t }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('AmazeGoAutoSolver') || zip;

      // Add all project files
      for (const file of ANDROID_PROJECT_FILES) {
        rootFolder.file(file.path, file.content);
      }

      // Generate additional standard gradle wrapper files
      rootFolder.file('settings.gradle.kts', `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "AmazeGoAutoSolver"
include(":app")
`);

      rootFolder.file('build.gradle.kts', `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`);

      // Gradlew shell script
      rootFolder.file('gradlew', `#!/bin/sh
APP_BASE_NAME=\`basename "$0"\`
DIRNAME=\`dirname "$0"\`
[ -z "$DIRNAME" ] && DIRNAME="."
APP_HOME=\`cd "$DIRNAME" && pwd\`
CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
JAVA_EXE="java"
if [ -n "$JAVA_HOME" ] ; then
    JAVA_EXE="$JAVA_HOME/bin/java"
fi
exec "$JAVA_EXE" -Dorg.gradle.appname="$APP_BASE_NAME" -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'AmazeGo_AutoSolver_AndroidStudio.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Download CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">{t.codeHub.title}</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            {t.codeHub.subtitle} &bull; Developed by <strong className="text-cyan-300">MD. SABBIR RAHMAN</strong>
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4" />
          {isZipping ? t.codeHub.downloading : t.codeHub.downloadZip}
        </button>
      </div>

      {/* Cloud-Based APK Build (No Computer / Mobile Workflow) Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              100% Cloud APK Build &bull; No Computer / No Android Studio Required
            </div>
            <h3 className="text-lg font-bold text-white">
              Build &amp; Download APK Directly on Android Phone via GitHub Actions
            </h3>
            <p className="text-xs text-slate-400">
              Follow these simple steps using Chrome on your Android phone to build a signed APK in the cloud.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs mb-2">
              1
            </span>
            <strong className="text-white block mb-1">Download Project ZIP</strong>
            <p className="text-slate-400 text-[11px]">
              Tap <strong>Download Project (.zip)</strong> above. It contains all code plus the pre-configured <code className="text-cyan-300">.github/workflows/build-apk.yml</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs mb-2">
              2
            </span>
            <strong className="text-white block mb-1">Create GitHub Repo in Chrome</strong>
            <p className="text-slate-400 text-[11px]">
              Open Chrome on your phone, go to <strong className="text-cyan-300">github.com/new</strong>, name it <code className="text-cyan-300">amazego-solver</code>, and tap "uploading an existing file".
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs mb-2">
              3
            </span>
            <strong className="text-white block mb-1">Cloud Builds &amp; Signs APK</strong>
            <p className="text-slate-400 text-[11px]">
              GitHub Actions automatically launches an Ubuntu cloud runner with JDK 17 &amp; Android SDK 35, compiles <code className="text-cyan-300">assembleDebug</code>, and signs the APK in ~2 min.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs mb-2">
              4
            </span>
            <strong className="text-white block mb-1">Download &amp; Install on Phone</strong>
            <p className="text-slate-400 text-[11px]">
              In GitHub on Chrome, tap the <strong>Actions</strong> tab &gt; tap latest run &gt; tap the artifact <strong className="text-emerald-400">AmazeGO-AutoSolver-v1.0.0-signed.apk</strong> to download and install!
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
            <Cpu className="w-4 h-4" />
            1. ScreenCaptureManager
          </div>
          <p className="text-[11px] text-slate-400">
            MediaProjection API & ImageReader for low-latency bitmap buffers.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            2. ArrowDetector (OpenCV)
          </div>
          <p className="text-[11px] text-slate-400">
            Adaptive thresholding, contour moments, and PCA arrow head vector extraction.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <Layers className="w-4 h-4" />
            3. PuzzleSolver Engine
          </div>
          <p className="text-[11px] text-slate-400">
            Kahn's topological sort, collision raycasting, and cycle deadlock prevention.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
            <FolderGit2 className="w-4 h-4" />
            4. AutoTapController
          </div>
          <p className="text-[11px] text-slate-400">
            AccessibilityService gesture dispatch with post-tap verification loops.
          </p>
        </div>
      </div>

      {/* Code Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File List Tree */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {t.codeHub.files} ({ANDROID_PROJECT_FILES.length})
          </h3>
          <div className="space-y-1 max-h-[550px] overflow-y-auto pr-1">
            {ANDROID_PROJECT_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                  selectedFileIndex === idx
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  <span className="truncate">{file.name}</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                  {file.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Source Code Viewer */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          {/* File Tab Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
            <span className="font-mono text-xs text-slate-300 truncate">
              {currentFile.path}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t.codeHub.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.codeHub.copyCode}</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Content */}
          <div className="p-4 overflow-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed bg-slate-950/90 selection:bg-cyan-500/30">
            <pre className="whitespace-pre">{currentFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
