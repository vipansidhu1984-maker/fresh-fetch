import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  Smartphone, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  HeartHandshake,
  ArrowRight
} from 'lucide-react';

export default function PWAInstallModal() {
  const { 
    showInstallModal, 
    setShowInstallModal, 
    deferredInstallPrompt, 
    installPWA, 
    isAppInstalled, 
    t 
  } = useApp();

  const [isIOS, setIsIOS] = useState(false);
  const [showIOSDetails, setShowIOSDetails] = useState(false);

  useEffect(() => {
    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);
    if (isAppleDevice && !deferredInstallPrompt) {
      setShowIOSDetails(true);
    }
  }, [deferredInstallPrompt]);

  if (!showInstallModal || isAppInstalled) {
    return null;
  }

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('freshfetch_pwa_dismissed', 'true');
    } catch {
      // Ignore
    }
    setShowInstallModal(false);
  };

  const handleInstallClick = () => {
    if (deferredInstallPrompt) {
      installPWA();
    } else if (isIOS) {
      setShowIOSDetails(true);
    } else {
      // General browser fallback tip
      installPWA();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-slide-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Gradient */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 w-full" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* App Header Branding */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 flex-shrink-0 border-2 border-white dark:border-stone-800">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white leading-tight">
                  Fresh Fetch
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified PWA
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                {t('pwaInstallBadge') || 'Official Web App • Fast & 100% Free'}
              </p>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mb-5">
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              {t('pwaInstallTitle') || 'Install Fresh Fetch App'}
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {t('pwaInstallSubtitle') || 'Direct farm shopping from Hanumangarh & Sri Ganganagar directly from your phone home screen!'}
            </p>
          </div>

          {/* Key Value Benefits Grid */}
          <div className="space-y-2.5 mb-6 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200">
                {t('pwaFeature1') || 'Instant 1-Tap Home Screen Access'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200">
                {t('pwaFeature2') || 'Real-time Direct Chat with Local Farmers'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-400 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200">
                {t('pwaFeature3') || 'Ultra Lightweight (< 2 MB) & Zero Battery Drain'}
              </span>
            </div>
          </div>

          {/* iOS Step-by-Step Accordion / Card */}
          {isIOS && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-center justify-between font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200 mb-2">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  {t('pwaIosInstructionsTitle') || 'How to Install on iPhone / iPad:'}
                </span>
              </div>
              <ul className="text-xs text-amber-800 dark:text-amber-300/90 space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400">1.</span>
                  <span>{t('pwaIosStep1') || 'Tap the Share icon (⎋ / [↑]) in Safari toolbar.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400">2.</span>
                  <span>{t('pwaIosStep2') || "Scroll down & tap 'Add to Home Screen' (➕)."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400">3.</span>
                  <span>{t('pwaIosStep3') || "Tap 'Add' in top-right corner to finish."}</span>
                </li>
              </ul>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-2.5">
            {deferredInstallPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-pulse"
              >
                <Download className="w-5 h-5" />
                <span>{t('pwaInstallBtn') || '📲 Install Fresh Fetch App'}</span>
              </button>
            ) : isIOS ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm text-center shadow-md">
                👆 {t('pwaIosInstructionsTitle') || 'Follow the 3 quick steps above to add to home screen'}
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5" />
                <span>{t('pwaInstallBtn') || '📲 Install Fresh Fetch App'}</span>
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors text-center"
            >
              {t('pwaContinueBrowser') || 'Continue in Browser'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
