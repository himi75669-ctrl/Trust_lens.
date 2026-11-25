import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, Clock, Tag } from 'lucide-react';

export default function MessageChecker({ onCheck, loading, initialData }) {
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [hour, setHour] = useState('14');

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'object') {
        const inp = initialData.input || initialData;
        setSender(inp.sender || '');
        setText(inp.text || inp.message || '');
        if (inp.hour !== undefined) setHour(String(inp.hour));
      } else if (typeof initialData === 'string') {
        setText(initialData);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onCheck('message', {
      sender: sender.trim(),
      text: text.trim(),
      hour: parseInt(hour, 10)
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Scam SMS & Chat Message Inspector
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Analyze smishing texts, fake electricity cutoffs, Telegram part-time job lures, and KYC traps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Sender Header or Phone Number
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. +91-98123-45678 or VK-HDFCBK"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Official Indian banks use 6-character alphabetic headers, never ordinary 10-digit phone numbers.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Time Received (Hour of Day)</span>
            </label>
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm bg-white outline-none"
            >
              <option value="1">01:00 AM (Late night / High Risk Window)</option>
              <option value="2">02:00 AM (Late night / High Risk Window)</option>
              <option value="3">03:00 AM (Early morning / High Risk Window)</option>
              <option value="10">10:00 AM (Standard morning)</option>
              <option value="14">02:00 PM (Standard afternoon)</option>
              <option value="19">07:00 PM (Standard evening)</option>
              <option value="22">10:00 PM (Night)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              WhatsApp corpus reveals heightened off-peak attack vectors between 12 AM - 4 AM.
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Message Body Text
          </label>
          <textarea
            rows="3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Dear customer your electricity power will be disconnected tonight at 9:30 PM call 98xxxxxx immediately to update your bill."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Extracted linguistic urgency patterns (Fake.csv), fake job task rewards, and smishing URLs.
          </div>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Inspect Message</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
