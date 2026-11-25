import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  PhoneCall
} from 'lucide-react';

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);

  if (!result) return null;

  const {
    status = 'Unable to check',
    confidence = 0,
    riskScore = 0,
    summary = '',
    reasons = [],
    nextSteps = [],
    privacyAlert = null,
    goldenRule = null,
    securityDisclaimer = 'TrustLens analyzed the interaction heuristically without executing external code or visiting malicious links.',
    detectedType = null,
    details = {}
  } = result;

  // Determine state styling
  let stateConfig = {
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    headerBg: 'from-slate-50 to-slate-100/60',
    border: 'border-slate-300',
    icon: HelpCircle,
    iconColor: 'text-slate-600',
    title: 'Unable to check',
    description: 'We could not reach a definitive conclusion with the provided input.'
  };

  if (status === 'Suspicious') {
    stateConfig = {
      badgeBg: 'bg-red-50 text-red-900 border-red-300 ring-2 ring-red-400/30',
      headerBg: 'from-red-50/80 via-white to-red-50/30',
      border: 'border-red-300',
      icon: AlertOctagon,
      iconColor: 'text-red-600',
      title: 'Suspicious',
      description: 'Strong fraud, phishing, or coercive manipulation patterns detected.'
    };
  } else if (status === 'Use caution') {
    stateConfig = {
      badgeBg: 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/30',
      headerBg: 'from-amber-50/80 via-white to-amber-50/30',
      border: 'border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      title: 'Use caution',
      description: 'Ambiguous or irregular signals found. Heightened vigilance required.'
    };
  } else if (status === 'No obvious warning signs') {
    stateConfig = {
      badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400/30',
      headerBg: 'from-emerald-50/80 via-white to-emerald-50/30',
      border: 'border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      title: 'No obvious warning signs',
      description: 'No overt deceptive or scam signatures found based on heuristic checks.'
    };
  }

  const IconComponent = stateConfig.icon;

  const handleCopyReport = () => {
    const textReport = `TrustLens Verification Report\nStatus: ${status}\nSummary: ${summary}\nRisk Score: ${riskScore}/100\nKey Warnings:\n${reasons.map(r => '• ' + r).join('\n')}\nRecommended Next Steps:\n${nextSteps.map(s => '• ' + s).join('\n')}\nVerified via TrustLens (Zero-Execution Shield)`;
    navigator.clipboard.writeText(textReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`mt-8 bg-white rounded-2xl border-2 ${stateConfig.border} shadow-xl shadow-slate-200/50 overflow-hidden transition-all animate-fadeIn`}>
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 bg-gradient-to-r ${stateConfig.headerBg} border-b border-slate-100`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl bg-white shadow-md border ${stateConfig.border} shrink-0`}>
              <IconComponent className={`w-8 h-8 ${stateConfig.iconColor}`} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${stateConfig.badgeBg}`}>
                  {status}
                </span>
                {detectedType && (
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-semibold uppercase">
                    Type: {detectedType}
                  </span>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  Confidence: {confidence}%
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {summary}
              </h3>
            </div>
          </div>

          {/* Risk Meter Bar */}
          <div className="sm:text-right shrink-0">
            <div className="text-xs font-semibold text-slate-500 mb-1">Assessed Threat Level</div>
            <div className="flex items-center gap-2">
              <div className="w-28 sm:w-36 h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    riskScore >= 50 ? 'bg-red-500' : riskScore >= 25 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(8, riskScore)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-800 min-w-[48px]">
                {riskScore}/100
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Privacy Alert (if sensitive data was masked) */}
        {privacyAlert && (
          <div className="p-4 rounded-xl bg-trust-50 border border-trust-200 text-trust-900 text-xs sm:text-sm flex items-start gap-3">
            <Lock className="w-5 h-5 text-trust-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Privacy Shield Active: </span>
              {privacyAlert}
            </div>
          </div>
        )}

        {/* UPI Golden Rule Banner (if applicable) */}
        {goldenRule && (
          <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold uppercase tracking-wide">The Fundamental UPI Rule: </span>
              {goldenRule}
            </div>
          </div>
        )}

        {/* Reasons & Warning Signs */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <span>Detected Signals & Observations</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
              {reasons.length}
            </span>
          </h4>

          <div className="space-y-2.5">
            {reasons.map((reason, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-trust-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Practical Next Steps */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Recommended Next Steps (Protect Yourself Now)
            </h4>
          </div>

          <div className="space-y-2 text-sm text-slate-200">
            {nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>

          {/* Emergency helpline link */}
          <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Need immediate official cyber fraud assistance?
            </span>
            <a
              href="tel:1930"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Cyber Crime Helpline 1930</span>
            </a>
          </div>
        </div>

        {/* Clean Result Disclaimer */}
        {status === 'No obvious warning signs' && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <span className="font-bold">Important Limitation: </span>
            A clean result does not guarantee absolute safety. Attackers continually craft new domains, spoof identities, and compromise legitimate servers. Always verify independently through official channels.
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Report Copied!' : 'Copy Summary Report'}</span>
            </button>
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <span>{showTechnical ? 'Hide Details' : 'Inspection Metadata'}</span>
              {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            {securityDisclaimer}
          </div>
        </div>

        {/* Collapsible Inspection Details */}
        {showTechnical && (
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
            <div className="text-slate-400 font-bold mb-2">// Raw Verification Details</div>
            <pre>{JSON.stringify(details, null, 2)}</pre>
          </div>
        )}

      </div>
    </div>
  );
}
