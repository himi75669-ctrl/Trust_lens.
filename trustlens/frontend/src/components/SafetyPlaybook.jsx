import React from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  AlertOctagon, 
  ExternalLink, 
  CreditCard, 
  Smartphone, 
  Key,
  CheckCircle2
} from 'lucide-react';

export default function SafetyPlaybook() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fadeIn">
      
      {/* Title Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Practical Defense Guides</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          TrustLens Emergency Safety Playbook
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Clear, practical actions to take immediately if you encounter a scam or accidentally interacted with a fraudulent request.
        </p>
      </div>

      {/* Emergency Hotlines Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-200">
              Immediate Financial Emergency
            </span>
            <PhoneCall className="w-5 h-5 text-red-200 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold mb-1">
            Dial 1930
          </div>
          <p className="text-xs text-red-100 mb-4">
            National Cyber Crime Helpline (India). Calling within the "Golden Hour" allows banks to freeze fraudulent money transfers before cash-out.
          </p>
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition-colors"
          >
            <span>Call 1930 Now</span>
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-trust-700 to-trust-900 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-trust-200">
              National Reporting Portal
            </span>
            <ExternalLink className="w-5 h-5 text-trust-200" />
          </div>
          <div className="text-2xl font-extrabold mb-1">
            cybercrime.gov.in
          </div>
          <p className="text-xs text-trust-100 mb-4">
            Official Government of India portal for lodging cyber fraud, identity theft, and extortion complaints.
          </p>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-trust-800 font-bold text-xs hover:bg-trust-50 transition-colors"
          >
            <span>Open Cyber Crime Portal</span>
          </a>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Report Fake Calls & SMS
            </span>
            <Smartphone className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="text-2xl font-extrabold mb-1">
            Chakshu Portal
          </div>
          <p className="text-xs text-indigo-100 mb-4">
            Department of Telecommunications portal to report suspected fraud phone numbers, WhatsApp accounts, and SMS headers for deactivation.
          </p>
          <a
            href="https://sancharsaathi.gov.in/sfc/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-indigo-800 font-bold text-xs hover:bg-indigo-50 transition-colors"
          >
            <span>Visit Chakshu Portal</span>
          </a>
        </div>

      </div>

      {/* Incident Playbook Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Playbook 1 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-red-100 text-red-700">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              If You Accidental Approved a Fake Payment or Shared OTP
            </h3>
          </div>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span><strong>Call your bank's official 24x7 emergency number immediately</strong> (found on the back of your physical debit/credit card) to block cards and netbanking access.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span><strong>Dial 1930</strong> (Cyber Crime Helpline) and give the transaction UTR number, debit time, and recipient VPA.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span><strong>Change your UPI PIN and Netbanking passwords</strong> from a clean, secure device.</span>
            </li>
          </ol>
        </div>

        {/* Playbook 2 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              If You Sideloaded an Unknown APK or Screen-Share App
            </h3>
          </div>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
              <span><strong>Turn on Airplane Mode immediately</strong> or disconnect Wi-Fi and mobile data to terminate active remote sessions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
              <span>Go to <strong>Settings &gt; Apps &gt; Installed Apps</strong> and uninstall the malicious tool (or AnyDesk / QuickSupport).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
              <span>If uninstallation is blocked, reboot your phone into <strong>Safe Mode</strong> (power off & hold volume down) and delete the app.</span>
            </li>
          </ol>
        </div>

      </div>

    </div>
  );
}
