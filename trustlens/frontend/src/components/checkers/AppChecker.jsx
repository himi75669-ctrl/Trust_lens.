import React, { useState, useEffect } from 'react';
import { Smartphone, ArrowRight, ShieldAlert, CheckSquare, Square } from 'lucide-react';

const COMMON_PERMISSIONS = [
  { id: 'android.permission.BIND_ACCESSIBILITY_SERVICE', label: 'Accessibility Service (High Risk)' },
  { id: 'android.permission.READ_SMS', label: 'Read SMS / Intercept OTPs' },
  { id: 'android.permission.SYSTEM_ALERT_WINDOW', label: 'Draw Over Other Apps (Overlay)' },
  { id: 'android.permission.READ_CONTACTS', label: 'Read Contacts' },
  { id: 'android.permission.RECORD_AUDIO', label: 'Microphone Audio Recording' }
];

export default function AppChecker({ onCheck, loading, initialData }) {
  const [appName, setAppName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [source, setSource] = useState('Telegram / WhatsApp APK forward');
  const [permissions, setPermissions] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'object') {
        const inp = initialData.input || initialData;
        setAppName(inp.appName || '');
        setPackageName(inp.packageName || '');
        setSource(inp.source || 'Direct APK');
        setPermissions(inp.permissions || []);
        setDescription(inp.description || '');
      }
    }
  }, [initialData]);

  const togglePermission = (permId) => {
    if (permissions.includes(permId)) {
      setPermissions(permissions.filter(p => p !== permId));
    } else {
      setPermissions([...permissions, permId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appName.trim() && !packageName.trim() && !description.trim()) return;
    onCheck('app', {
      appName: appName.trim(),
      packageName: packageName.trim(),
      source,
      permissions,
      description: description.trim()
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Fake or Impersonating App Checker
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Analyze APK sideloads, fake banking apps, and dangerous accessibility permissions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              App Name or Title
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. WhatsApp Pink or Instant ₹50,000 Loan"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Package Name (if known)
            </label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="e.g. org.whatsapp.pink or com.sbi.kyc.apk"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Download Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm bg-white outline-none"
          >
            <option value="Forwarded APK via Telegram or WhatsApp">Forwarded APK via Telegram or WhatsApp (High Risk)</option>
            <option value="Direct APK Download from unknown website">Direct APK Download from website / social media ad (High Risk)</option>
            <option value="Third-party app repository (APKPure, Aptoide)">Third-party app store (APKPure, Aptoide)</option>
            <option value="Official Google Play Store">Official Google Play Store</option>
            <option value="Official Apple App Store">Official Apple App Store</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Requested High-Risk Permissions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_PERMISSIONS.map(perm => {
              const isChecked = permissions.includes(perm.id);
              return (
                <button
                  type="button"
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs text-left transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-purple-50 text-purple-900 border-purple-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{perm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Context or Experience Description
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Someone on WhatsApp sent me this APK promising free Netflix or instant money refund."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 text-sm outline-none"
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Sideload signatures, trojanized overlay attacks, and privilege escalation risks.
          </div>
          <button
            type="submit"
            disabled={loading || (!appName.trim() && !description.trim())}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Audit App Safety</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
