import React from 'react';
import { X, Lock, ShieldCheck, EyeOff, Server, AlertTriangle } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-trust-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-trust-600/50 border border-trust-400/30 text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">TrustLens Privacy & Security Charter</h3>
              <p className="text-xs text-trust-200">How we protect your identity and data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Zero-Execution Policy</h4>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                TrustLens never navigates to, loads, or executes submitted URLs, APK files, or scripts. Analysis is conducted strictly via static domain syntax, heuristic linguistic models, and signature benchmarking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <EyeOff className="w-5 h-5 text-trust-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Automatic Credential Redaction</h4>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                If payment card numbers, OTPs, PINs, or passwords are inadvertently pasted, our integrated sanitizer redacts them instantly prior to analysis, warning you immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <Server className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900">Zero Audio or Biometric Retention</h4>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Acoustic inputs require your affirmative consent and are processed in volatile memory for fraud patterns. Audio samples are never saved, shared, or indexed for model training.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Transparent Limitation Notice</h4>
              <p className="mt-0.5 leading-relaxed">
                TrustLens cannot reliably guarantee detection of every novel scam. A "No obvious warning signs" result does not prove an interaction is 100% safe. Always verify independently with official institutions.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-trust-600 hover:bg-trust-700 text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
