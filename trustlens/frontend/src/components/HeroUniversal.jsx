import React, { useState } from 'react';
import { Search, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export default function HeroUniversal({ onSmartCheck, loading, onSelectCategory }) {
  const [quickInput, setQuickInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onSmartCheck(quickInput.trim());
  };

  const sampleQuickTexts = [
    { label: 'SBI KYC SMS', text: 'Dear SBI customer, your YONO Netbanking account has been suspended today due to pending PAN KYC. Update immediately at http://sbi-pan-kyc.xyz/update or your account will be permanently blocked within 2 hours.' },
    { label: 'OLX UPI Trick', text: 'upi://pay?pa=refund-helpdesk@okhdfcbank&pn=Paytm+Refund+Desk&am=4999&cu=INR' },
    { label: 'CBI Police Call', text: 'Inspector Vijay from CBI Cyber Cell Mumbai: A courier parcel sent from Mumbai Airport containing fake passports and drugs was seized in your name. You are under Digital Arrest.' },
    { label: 'Official Portal', text: 'https://www.onlinesbi.sbi' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-trust-50/40 to-slate-50 border-b border-slate-200 pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-trust-200/30 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-trust-100 text-trust-800 text-xs font-semibold mb-5 border border-trust-200">
          <ShieldAlert className="w-4 h-4 text-trust-600" />
          <span>Zero-Execution Privacy Shield • 7 Scam Defenses</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
          Check suspicious digital interactions <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-trust-600 to-indigo-600">
            before you click, scan, or pay.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Instantly evaluate suspicious links, fake apps, malicious QR codes, AI voice clones, payment requests, scam calls, and phishing messages in plain, simple language.
        </p>

        {/* Universal Smart Scan Input Box */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-3xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-stretch bg-white rounded-2xl shadow-xl shadow-slate-200/60 border-2 border-trust-200 focus-within:border-trust-500 transition-all p-2">
            
            <div className="relative flex-1 flex items-center min-h-[56px] pl-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Paste any link, message, UPI ID, phone number, or QR text to check..."
                className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !quickInput.trim()}
              className="mt-2 sm:mt-0 px-6 py-3.5 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-trust-600/30 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Privacy Notice Pill */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-trust-600" />
            <span>Never enter passwords, PINs, OTPs, or card credentials. Links & files are never executed.</span>
          </div>

          {/* Quick Try Samples */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick test:
            </span>
            {sampleQuickTexts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuickInput(sample.text);
                  onSmartCheck(sample.text);
                }}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-trust-50 text-slate-700 hover:text-trust-700 border border-slate-200 transition-colors shadow-sm font-medium"
              >
                {sample.label}
              </button>
            ))}
          </div>

        </form>

      </div>
    </div>
  );
}
