import React, { useState, useEffect } from 'react';
import { Globe, ArrowRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export default function UrlChecker({ onCheck, loading, initialData }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'string') {
        setUrl(initialData);
      } else if (initialData.input) {
        setUrl(initialData.input);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onCheck('url', { url: url.trim() });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Fake or Phishing Link Verification
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect website addresses and shortlinks safely before visiting them.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Suspicious Website Address or URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://sbi-kyc-update.top/login or http://paytm-reward99.xyz"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm sm:text-base outline-none transition-all"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero-Execution Guarantee: TrustLens will NOT visit, click, or load remote content from this URL.</span>
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Typosquatting, brand impersonation, suspicious TLDs, IP hosting & deceptive subdomains.
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Inspect Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
