import React, { useState, useEffect } from 'react';
import { PhoneCall, ArrowRight, ShieldAlert, AlertOctagon, PhoneIncoming } from 'lucide-react';

export default function CallChecker({ onCheck, loading, initialData }) {
  const [callerNumber, setCallerNumber] = useState('');
  const [claimedCaller, setClaimedCaller] = useState('');
  const [conversationSummary, setConversationSummary] = useState('');

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'object') {
        const inp = initialData.input || initialData;
        setCallerNumber(inp.callerNumber || '');
        setClaimedCaller(inp.claimedCaller || '');
        setConversationSummary(inp.conversationSummary || inp.description || '');
      } else if (typeof initialData === 'string') {
        setConversationSummary(initialData);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!claimedCaller.trim() && !conversationSummary.trim() && !callerNumber.trim()) return;
    onCheck('call', {
      callerNumber: callerNumber.trim(),
      claimedCaller: claimedCaller.trim(),
      conversationSummary: conversationSummary.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-red-50 text-red-600">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Impersonation & "Digital Arrest" Call Detector
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit threats from callers claiming to be police, CBI, customs, or electricity officials.
          </p>
        </div>
      </div>

      {/* Critical Law Warning */}
      <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-950 text-xs sm:text-sm flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase tracking-wide">Government Law Fact: </span>
          The concept of <strong>"Digital Arrest" DOES NOT EXIST</strong> in law. Neither the Police, CBI, ED, nor the Supreme Court conduct arrests over WhatsApp/Skype or demand money transfers to clear criminal cases.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Caller Phone Number (if shown)
            </label>
            <input
              type="text"
              value={callerNumber}
              onChange={(e) => setCallerNumber(e.target.value)}
              placeholder="e.g. +92-300-1234567 or +91-98765-43210"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Claimed Organization or Identity
            </label>
            <input
              type="text"
              value={claimedCaller}
              onChange={(e) => setClaimedCaller(e.target.value)}
              placeholder="e.g. CBI Cyber Crime, Mumbai Customs, FedEx, or Electricity Officer"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            What did the caller say or demand?
          </label>
          <textarea
            rows="3"
            value={conversationSummary}
            onChange={(e) => setConversationSummary(e.target.value)}
            placeholder="e.g. They claimed an illegal parcel in my name with passports and drugs was seized, placed me under digital arrest, and told me to stay in a locked room on video call."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Psychological isolation, fake warrants, foreign country codes, and coercion scripts.
          </div>
          <button
            type="submit"
            disabled={loading || (!claimedCaller.trim() && !conversationSummary.trim())}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Inspect Call Threat</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
