import React, { useState, useEffect } from 'react';
import { QrCode, ArrowRight, ShieldCheck, AlertTriangle, FileCode } from 'lucide-react';

export default function QrChecker({ onCheck, loading, initialData }) {
  const [payload, setPayload] = useState('');

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'string') {
        setPayload(initialData);
      } else if (initialData.input) {
        setPayload(typeof initialData.input === 'string' ? initialData.input : JSON.stringify(initialData.input));
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!payload.trim()) return;
    onCheck('qr', { payload: payload.trim() });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Malicious QR Code Inspection
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Safely inspect the decoded string of a QR code without triggering payments or opening dangerous links.
          </p>
        </div>
      </div>

      {/* Safety Alert for QR Scams */}
      <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Crucial Safety Rule: </span>
          Scanning a QR code will <strong>NEVER credit money</strong> into your account. If someone tells you to scan a QR code to "receive an advance payment or lottery reward", it is 100% a fraud attempt to debit your bank account.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Decoded QR Text, Intent, or UPI String
          </label>
          <textarea
            rows="3"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="e.g. upi://pay?pa=refund@bank&am=3000 or WIFI:S:Free_WiFi;T:WPA;P:password;; or https://unknown-destination.xyz"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm font-mono outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Reverse UPI collect fraud, rogue Wi-Fi hijacking, and hidden intent triggers.
          </div>
          <button
            type="submit"
            disabled={loading || !payload.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Inspect QR Payload</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
