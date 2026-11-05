import { Language } from '../types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  tabs: {
    emulator: string;
    dashboard: string;
    codeHub: string;
    settings: string;
    docs: string;
    about: string;
  };
  emulator: {
    phoneTitle: string;
    levelSelect: string;
    customLevel: string;
    resetBoard: string;
    level: string;
    arrowCount: string;
    solvedMessage: string;
    deadlockMessage: string;
    clearBoard: string;
    randomLevel: string;
    speed: string;
    slow: string;
    normal: string;
    fast: string;
  };
  overlay: {
    title: string;
    scan: string;
    scanning: string;
    manualMode: string;
    autoSolve: string;
    pause: string;
    resume: string;
    stop: string;
    emergencyStop: string;
    minimizedBadge: string;
    nextTap: string;
    solved: string;
    blocked: string;
    unblocked: string;
    confidence: string;
    dragToMove: string;
  };
  dashboard: {
    permissionsTitle: string;
    permissionMedia: string;
    permissionOverlay: string;
    permissionAccess: string;
    granted: string;
    required: string;
    statsTitle: string;
    totalDetected: string;
    remaining: string;
    successfulTaps: string;
    failedDetections: string;
    progress: string;
    verificationLog: string;
    scanHistory: string;
    noHistory: string;
    preTap: string;
    postTap: string;
    diffConfidence: string;
  };
  settings: {
    title: string;
    language: string;
    tapSpeed: string;
    tapInterval: string;
    confidenceThreshold: string;
    overlayTransparency: string;
    debugOverlay: string;
    soundEffects: string;
    hapticFeedback: string;
    strictVerification: string;
    save: string;
    resetDefaults: string;
  };
  codeHub: {
    title: string;
    subtitle: string;
    downloadZip: string;
    downloading: string;
    copyCode: string;
    copied: string;
    files: string;
    architectureOverview: string;
  };
  about: {
    title: string;
    subtitle: string;
    developerTitle: string;
    developerName: string;
    roleTitle: string;
    roleValue: string;
    appTitle: string;
    appValue: string;
    versionTitle: string;
    versionValue: string;
    attribution: string;
    creditsTitle: string;
    creditsText: string;
    privacyTitle: string;
    privacyText: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Amaze GO Auto Solver',
    appSubtitle: 'Universal Arrow Puzzle Computer Vision & Automation Assistant',
    tagline: 'Intelligent screen scanner, arrow trajectory analyzer, and autonomous puzzle solver for Android.',
    tabs: {
      emulator: 'Game & Overlay Studio',
      dashboard: 'Solver Dashboard',
      codeHub: 'Android Source Files',
      settings: 'Settings',
      docs: 'Architecture & Guide',
      about: 'About Developer',
    },
    emulator: {
      phoneTitle: 'Amaze GO! Game Environment',
      levelSelect: 'Select Puzzle Preset:',
      customLevel: 'Level Creator',
      resetBoard: 'Reset Puzzle',
      level: 'Level',
      arrowCount: 'Arrows',
      solvedMessage: 'Puzzle Solved Successfully! All arrows cleared.',
      deadlockMessage: 'Deadlock Detected! Cyclic block prevents completion.',
      clearBoard: 'Clear All',
      randomLevel: 'Generate Random Maze',
      speed: 'Tap Speed',
      slow: 'Slow (Safe - 1200ms)',
      normal: 'Normal (600ms)',
      fast: 'Fast (300ms)',
    },
    overlay: {
      title: 'Amaze GO Assistant',
      scan: 'Scan Screen',
      scanning: 'Analyzing CV...',
      manualMode: 'Manual Guide',
      autoSolve: 'Full Auto Solve',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      emergencyStop: 'Emergency Stop',
      minimizedBadge: 'AmazeGO',
      nextTap: 'Tap Arrow #',
      solved: 'Cleared',
      blocked: 'Blocked',
      unblocked: 'Ready',
      confidence: 'Confidence',
      dragToMove: 'Drag anywhere',
    },
    dashboard: {
      permissionsTitle: 'Android System Permissions',
      permissionMedia: 'Screen Capture (MediaProjection API)',
      permissionOverlay: 'Draw Over Other Apps (SYSTEM_ALERT_WINDOW)',
      permissionAccess: 'Accessibility Service (Gesture Dispatcher)',
      granted: 'Active & Authorized',
      required: 'Required for Auto-Solve',
      statsTitle: 'Real-Time Solving Metrics',
      totalDetected: 'Detected Arrows',
      remaining: 'Remaining on Board',
      successfulTaps: 'Successful Taps',
      failedDetections: 'Detection Errors',
      progress: 'Solving Progress',
      verificationLog: 'State Verification Log',
      scanHistory: 'Recent Scan Sessions',
      noHistory: 'No scans recorded yet. Click Scan Screen to start.',
      preTap: 'Pre-Tap State',
      postTap: 'Post-Tap State',
      diffConfidence: 'CV Match Score',
    },
    settings: {
      title: 'Solver Configuration',
      language: 'Interface Language',
      tapSpeed: 'Execution Speed Preset',
      tapInterval: 'Tap Interval Delay (ms)',
      confidenceThreshold: 'OpenCV Confidence Threshold (%)',
      overlayTransparency: 'Floating Window Opacity',
      debugOverlay: 'Visual Debug Raycast & Vectors',
      soundEffects: 'Sound Feedback',
      hapticFeedback: 'Vibration / Haptic Feedback',
      strictVerification: 'Strict Post-Tap Screenshot Verification',
      save: 'Save Preferences',
      resetDefaults: 'Reset to Defaults',
    },
    codeHub: {
      title: 'Android Studio Project Repository',
      subtitle: 'Complete production-grade Kotlin, OpenCV, and Accessibility Service source code.',
      downloadZip: 'Download Android Studio Project (.zip)',
      downloading: 'Compressing Package...',
      copyCode: 'Copy Source Code',
      copied: 'Copied to Clipboard!',
      files: 'Project Tree',
      architectureOverview: 'System Architecture',
    },
    about: {
      title: 'About the Developer',
      subtitle: 'Official developer information, project ownership, and application credits.',
      developerTitle: 'Official Developer',
      developerName: 'MD. SABBIR RAHMAN',
      roleTitle: 'Project Role',
      roleValue: 'App Developer, Creator & Project Owner',
      appTitle: 'Application',
      appValue: 'Amaze GO Auto Solver',
      versionTitle: 'App Version',
      versionValue: '1.0.0 (Release Build)',
      attribution: 'Developed by MD. SABBIR RAHMAN',
      creditsTitle: 'Project Credits & Architecture',
      creditsText: 'Amaze GO Auto Solver was designed, engineered, and built by MD. SABBIR RAHMAN. Featuring custom computer vision algorithms for arrow extraction, dependency graph topological solving, and Android Accessibility Service gesture automation.',
      privacyTitle: 'Privacy & Security Guarantee',
      privacyText: 'This application operates strictly locally on your device. Screen capture frames from MediaProjection are processed entirely on-device and never stored or transmitted to external servers. Accessibility gestures are dispatched solely for puzzle execution upon explicit user instruction.',
    },
  },
  bn: {
    appTitle: 'অ্যামেজ গো অটো সলভার',
    appSubtitle: 'ইউনিভার্সাল অ্যারো পাজল কম্পিউটার ভিশন ও অটোমেশন সহকারী',
    tagline: 'অ্যান্ড্রয়েডের জন্য বুদ্ধিমান স্ক্রিন স্ক্যানার, তীর পাথ বিশ্লেষক ও স্বয়ংক্রিয় পাজল সমাধানকারী।',
    tabs: {
      emulator: 'গেম ও ফ্লোটিং স্টুডিও',
      dashboard: 'সলভার ড্যাশবোর্ড',
      codeHub: 'অ্যান্ড্রয়েড সোর্স কোড',
      settings: 'সেটিংস',
      docs: 'আর্কিটেকচার ও নির্দেশিকা',
      about: 'ডেভেলপার পরিচিতি',
    },
    emulator: {
      phoneTitle: 'অ্যামেজ গো! গেম এনভায়রনমেন্ট',
      levelSelect: 'পাজল লেভেল নির্বাচন করুন:',
      customLevel: 'লেভেল ক্রিয়েটর',
      resetBoard: 'পাজল রিসেট করুন',
      level: 'লেভেল',
      arrowCount: 'তীর সংখ্যা',
      solvedMessage: 'অভিনন্দন! পাজল সম্পূর্ণভাবে সমাধান হয়েছে।',
      deadlockMessage: 'ডেডলক সনাক্ত হয়েছে! তীরগুলো একে অপরকে ব্লক করছে।',
      clearBoard: 'সব মুছুন',
      randomLevel: 'র‍্যান্ডম পাজল তৈরি করুন',
      speed: 'ট্যাপের গতি',
      slow: 'ধীর (নিরাপদ - ১২০০ মি.সে.)',
      normal: 'স্বাভাবিক (৬০০ মি.সে.)',
      fast: 'দ্রুত (৩০০ মি.সে.)',
    },
    overlay: {
      title: 'অ্যামেজ গো অ্যাসিস্ট্যান্ট',
      scan: 'স্ক্রিন স্ক্যান করুন',
      scanning: 'সিভি বিশ্লেষণ চলছে...',
      manualMode: 'ম্যানুয়াল গাইড',
      autoSolve: 'ফুল অটো সলভ',
      pause: 'বিরতি',
      resume: 'পুনরায় চালু',
      stop: 'থামুন',
      emergencyStop: 'জরুরী বিরতি',
      minimizedBadge: 'অ্যামেজ গো',
      nextTap: 'তীর চাপুন #',
      solved: 'সম্পন্ন',
      blocked: 'ব্লকড',
      unblocked: 'প্রস্তুত',
      confidence: 'নির্ভুলতা',
      dragToMove: 'যেকোনো স্থানে সরান',
    },
    dashboard: {
      permissionsTitle: 'অ্যান্ড্রয়েড সিস্টেম অনুমতিসমূহ',
      permissionMedia: 'স্ক্রিন ক্যাপচার (MediaProjection API)',
      permissionOverlay: 'অন্যান্য অ্যাপের উপর প্রদর্শন (SYSTEM_ALERT_WINDOW)',
      permissionAccess: 'অ্যাক্সেসিবিলিটি সার্ভিস (Gesture Dispatcher)',
      granted: 'অনুমোদিত ও সক্রিয়',
      required: 'অটো সলভের জন্য আবশ্যক',
      statsTitle: 'লাইভ সমাধান পরিসংখ্যান',
      totalDetected: 'শনাক্তকৃত তীর',
      remaining: 'বোর্ডে অবশিষ্ট',
      successfulTaps: 'সফল ট্যাপ',
      failedDetections: 'শনাক্তকরণ ত্রুটি',
      progress: 'সমাধান অগ্রগতি',
      verificationLog: 'স্টেট ভেরিফিকেশন লগ',
      scanHistory: 'সাম্প্রতিক স্ক্যান সেশন',
      noHistory: 'কোনো স্ক্যান তথ্য নেই। শুরু করতে স্ক্রিন স্ক্যান করুন।',
      preTap: 'ট্যাপের পূর্ববর্তী অবস্থা',
      postTap: 'ট্যাপের পরবর্তী অবস্থা',
      diffConfidence: 'সিভি স্কোর',
    },
    settings: {
      title: 'সলভার সেটিংস',
      language: 'ইন্টারফেস ভাষা',
      tapSpeed: 'ট্যাপ গতির প্রিসেট',
      tapInterval: 'ট্যাপ বিরতি সময় (মি.সে.)',
      confidenceThreshold: 'ওপেনসিভি থ্রেশহোল্ড (%)',
      overlayTransparency: 'ফ্লোটিং উইন্ডোর স্বচ্ছতা',
      debugOverlay: 'ভিজ্যুয়াল রে-কাস্ট ও ভেক্টর ডিবাগ',
      soundEffects: 'শব্দ সংকেত',
      hapticFeedback: 'ভাইব্রেশন ও হ্যাপটিক ফিডব্যাক',
      strictVerification: 'কঠোর স্ক্রিনশট যাচাইকরণ',
      save: 'সংরক্ষণ করুন',
      resetDefaults: 'ডিফল্টে ফিরুন',
    },
    codeHub: {
      title: 'অ্যান্ড্রয়েড স্টুডিও প্রজেক্ট রিপোজিটরি',
      subtitle: 'সম্পূর্ণ প্রডাকশন-গ্রেড কোটলিন, ওপেনসিভি এবং অ্যাক্সেসিবিলিটি সার্ভিস সোর্স কোড।',
      downloadZip: 'অ্যান্ড্রয়েড স্টুডিও প্রজেক্ট ডাউনলোড (.zip)',
      downloading: 'প্যাকেজ তৈরি হচ্ছে...',
      copyCode: 'সোর্স কোড কপি করুন',
      copied: 'ক্লিপবোর্ডে কপি করা হয়েছে!',
      files: 'প্রজেক্ট ফাইলসমূহ',
      architectureOverview: 'সিস্টেম আর্কিটেকচার',
    },
    about: {
      title: 'ডেভেলপার পরিচিতি ও প্রোফাইল',
      subtitle: 'অফিসিয়াল ডেভেলপার তথ্য, প্রজেক্ট মালিকানা এবং অ্যাপ্লিকেশন ক্রেডিট।',
      developerTitle: 'অফিসিয়াল ডেভেলপার',
      developerName: 'মো: সাব্বির রহমান (MD. SABBIR RAHMAN)',
      roleTitle: 'প্রজেক্ট ভূমিকা',
      roleValue: 'অ্যাপ ডেভেলপার, ক্রিয়েটর ও প্রজেক্ট ওনার',
      appTitle: 'অ্যাপ্লিকেশন',
      appValue: 'Amaze GO Auto Solver',
      versionTitle: 'অ্যাপ সংস্করণ',
      versionValue: '১.০.০ (রিলিজ বিল্ড)',
      attribution: 'ডেভেলপ করেছেন মো: সাব্বির রহমান (Developed by MD. SABBIR RAHMAN)',
      creditsTitle: 'প্রজেক্ট ক্রেডিট ও সিস্টেম আর্কিটেকচার',
      creditsText: 'অ্যামেজ গো অটো সলভার অ্যাপ্লিকেশনটি ডিজাইন, ডেভেলপ ও প্রস্তুত করেছেন মো: সাব্বির রহমান (MD. SABBIR RAHMAN)। এটি ওপেনসিভি কম্পিউটার ভিশন, অ্যারো ট্রাজেক্টরি অ্যানালাইসিস এবং ডিপেন্ডেন্সি গ্রাফ ভিত্তিক টপোলজিক্যাল সলভার নিয়ে তৈরি।',
      privacyTitle: 'গোপনীয়তা ও নিরাপত্তা গ্যারান্টি',
      privacyText: 'এই অ্যাপ্লিকেশনটি সম্পূর্ণ স্থানীয়ভাবে আপনার ডিভাইসেই চলে। মিডিয়া প্রজেকশনের মাধ্যমে স্ক্রিন ক্যাপচার ফ্রেমসমূহ শুধুমাত্র অন-ডিভাইস বিশ্লেষিত হয় এবং কোনো তথ্য বহিরাগত সার্ভারে পাঠানো হয় না।',
    },
  },
};

