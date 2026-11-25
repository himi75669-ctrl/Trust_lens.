import React, { useState, useEffect } from 'react';
import { Mic, ArrowRight, ShieldCheck, Lock, AlertTriangle, Activity, Volume2 } from 'lucide-react';

export default function VoiceChecker({ onCheck, loading, initialData }) {
  const [description, setDescription] = useState('');
  const [consentGranted, setConsentGranted] = useState(false);
  const [anomalies, setAnomalies] = useState({
    unnaturalCadence: false,
    flatTone: false,
    lackOfBreathing: false,
    audioGlitch: false,
    backgroundMismatch: false
  });

  useEffect(() => {
    if (initialData) {
      if (typeof initialData === 'object') {
        const inp = initialData.input || initialData;
        setDescription(inp.description || (typeof inp === 'string' ? inp : ''));
        setConsentGranted(inp.consentGranted !== undefined ? inp.consentGranted : true);
        if (inp.acousticAnomalies) {
          setAnomalies(inp.acousticAnomalies);
        }
      } else if (typeof initialData === 'string') {
        setDescription(initialData);
        setConsentGranted(true);
      }
    }
  }, [initialData]);

  const toggleAnomaly = (key) => {
    setAnomalies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onCheck('voice', {
      description: description.trim(),
      consentGranted,
      acousticAnomalies: anomalies
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
          <Mic className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            AI-Cloned Voice & Audio Message Auditor
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Detect synthesized family emergency calls, mock kidnapping extortion, and deepfake voice coercion.
          </p>
        </div>
      </div>

      {/* Explicit Consent Requirement Banner */}
      <div className="mb-4 p-4 rounded-xl bg-trust-50/80 border border-trust-200 text-xs text-trust-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-trust-950">
          <Lock className="w-4 h-4 text-trust-600 shrink-0" />
          <span>Privacy & Explicit Consent Guarantee</span>
        </div>
        <p className="text-trust-800 leading-relaxed">
          TrustLens never retains voice audio recordings or personal biometric identifiers. Audio transcripts are parsed solely in transient memory for fraud heuristics and discarded immediately.
        </p>
        <label className="flex items-center gap-2.5 pt-1 cursor-pointer font-semibold text-slate-900 select-none">
          <input
            type="checkbox"
            checked={consentGranted}
            onChange={(e) => setConsentGranted(e.target.checked)}
            className="w-4 h-4 text-trust-600 rounded border-slate-300 focus:ring-trust-500"
          />
          <span>I consent to evaluating this audio description/transcript for scam indicators.</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Voice Message Transcript or Call Description
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Someone claiming to be my son called in extreme panic saying he was in a car crash and needed ₹35,000 sent immediately to an attorney to avoid jail."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-trust-500 focus:ring-2 focus:ring-trust-200 text-sm outline-none"
          />
        </div>

        {/* Acoustic Anomaly Cues */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>Observed Acoustic / Sound Oddities (Optional)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'unnaturalCadence', label: 'Robotic / Stiff rhythm' },
              { id: 'flatTone', label: 'Flat emotional inflection' },
              { id: 'lackOfBreathing', label: 'No organic breathing pauses' },
              { id: 'audioGlitch', label: 'Metallic distortion / clipping' },
              { id: 'backgroundMismatch', label: 'Unnatural dead silence background' }
            ].map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => toggleAnomaly(item.id)}
                className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  anomalies[item.id]
                    ? 'bg-rose-50 text-rose-900 border-rose-300 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Checks: Cloned voice emotional distress, family safe word protocol, and mock kidnapping scripts.
          </div>
          <button
            type="submit"
            disabled={loading || !description.trim() || !consentGranted}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-trust-600 hover:bg-trust-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-trust-600/20 transition-all cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Analyze Voice Scam Risk</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
