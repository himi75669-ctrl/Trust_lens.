import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowRight, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PaymentChecker({ onCheck, loading, initialData }) {
  const [vpa, setVpa] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [context, setContext] = useState('');

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'object') {
        const inp = initialData.input || initialData;
        setVpa(inp.vpa || inp.upiId || '');
        setAmount(inp.amount || '');
        setRemark(inp.remark || '');
        setContext(inp.context || '');
      } else if (typeof initialData === 'string') {
        setVpa(initialData);
        setContext(initialData);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vpa.trim() && !context.trim()) return;
    onCheck('payment', {
      vpa: vpa.trim(),
      amount: amount.trim(),
      remark: remark.trim(),
      context: context.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Fake Payment Request & UPI Transfer Inspector
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Verify UPI IDs, incoming collect requests, and protect against the reverse payment debit scam.
          </p>
        </div>
      </div>

      {/* UPI Golden Rule Banner */}
      <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border-2 border-amber-400 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold uppercase tracking-wide">The #1 Rule of UPI: </span>
          You <strong>NEVER</strong> enter your UPI PIN to receive money or refunds. Entering your PIN <strong>ALWAYS</strong> debits and sends money from your bank account!
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              UPI ID / VPA Handle
            </label>
            <input
              type="text"
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              placeholder="e.g. refund-desk@okhdfcbank or merchant@paytm"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Requested Amount (₹)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 4999"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Payment Remark / Note
          </label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="e.g. Paytm Cashback Refund - Enter PIN to claim"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Transaction Context or Situation
          </label>
          <textarea
            rows="2"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. An OLX buyer claiming to be an army officer asked me to approve this collect request to receive advance payment."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Fake customer care handles, OLX marketplace buyer tricks, and remote app coercion.
          </div>
          <button
            type="submit"
            disabled={loading || (!vpa.trim() && !context.trim())}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Payment Request</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
