import React from 'react';
import { Shield, Lock, ExternalLink, Heart, AlertCircle } from 'lucide-react';

export default function Footer({ onOpenPrivacy, setActiveView }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-trust-600 text-white flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">
                Trust<span className="text-trust-600">Lens</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm text-xs leading-relaxed">
              An innovative, privacy-first digital verification shield helping individuals check suspicious links, fake apps, malicious QR codes, AI voice clones, payment requests, and scam calls before they act.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-trust-600" /> Zero Execution
              </span>
              <span>•</span>
              <span>Client-Side Privacy</span>
              <span>•</span>
              <span>7 Scam Defenses</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Navigation & Guides
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setActiveView('check')} className="hover:text-trust-600 transition-colors">
                  All 7 Scam Checkers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('intelligence')} className="hover:text-trust-600 transition-colors">
                  Threat Intelligence & Data
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('playbook')} className="hover:text-trust-600 transition-colors">
                  Emergency Safety Playbook
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-trust-600 transition-colors">
                  Privacy Charter & Limitations
                </button>
              </li>
            </ul>
          </div>

          {/* Official Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Emergency Contacts
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="tel:1930" className="text-red-600 font-bold hover:underline flex items-center gap-1">
                  <span>Cyber Crime Helpline: 1930</span>
                </a>
              </li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-trust-600 flex items-center gap-1">
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://sancharsaathi.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-trust-600 flex items-center gap-1">
                  <span>Sanchar Saathi / Chakshu</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Limitation Notice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 text-[11px] leading-relaxed mb-6">
          <strong className="text-slate-700">Legal & Technical Disclaimer: </strong>
          TrustLens provides heuristic and pattern-based scam advisory based on academic research corpora and known fraud tactics. It does not replace professional law enforcement investigation or bank dispute resolution. A clean check is not an absolute warranty that an interaction is free from danger.
        </div>

        {/* Copyright bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TrustLens Open Security Initiative. Free & Accessible for all.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for public safety and digital resilience</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
