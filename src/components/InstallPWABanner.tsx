import { useState, useEffect } from "react";

const STORAGE_KEY = "histalytics-pwa-dismissed";

/**
 * Detects if the user is on iOS Safari (the only browser that supports Add to Home Screen on iPhone)
 * and NOT already in standalone (PWA) mode. Excludes DuckDuckGo which also matches Safari UA patterns.
 */
function shouldShowBanner(): "safari" | "other-ios" | false {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isDuckDuckGo = /duckduckgo/i.test(ua);

  if (isStandalone) return false;
  if (isDuckDuckGo) return false;
  if (isSafari && isIOS) return "safari";
  if (isIOS) return "other-ios";
  return false;
}

export function InstallPWABanner() {
  const [visible, setVisible] = useState(false);
  const [bannerType, setBannerType] = useState<"safari" | "other-ios">("safari");

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const result = shouldShowBanner();
      if (result) {
        setBannerType(result);
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <div className="relative rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 shadow-2xl border border-brand-500/30">
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Icon + Content */}
          <div className="flex items-start gap-4 pr-6">
            {/* App icon */}
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white">
                Install Histalytics
              </h3>
              <p className="mt-1.5 text-sm text-brand-200 leading-relaxed">
                Add to your home screen for a better experience — faster access, offline support, and full-screen mode.
              </p>

              {/* iOS-specific instructions */}
              {bannerType === "safari" ? (
                <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5">
                  <span className="text-sm text-brand-100 leading-snug">
                    Tap the <strong className="text-white">Share button</strong> <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/20"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg></span> in Safari, then scroll down and tap{" "}
                    <strong className="text-white">"Add to Home Screen"</strong>
                  </span>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-brand-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm text-brand-100 leading-snug">
                    Open this page in <strong className="text-white">Safari</strong> to add it to your home screen — other browsers on iPhone don't support app installs.{" "}
                    <span className="text-brand-300">Tap Safari's Share button, then "Add to Home Screen."</span>
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={dismiss}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/15 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
                >
                  Got it
                </button>
                <button
                  onClick={dismiss}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-brand-300 hover:text-white transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
