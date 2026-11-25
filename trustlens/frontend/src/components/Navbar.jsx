import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, PhoneCall, Sparkles, BookOpen, BarChart3 } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, isDemoMode, setIsDemoMode, onOpenPrivacy }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('check')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-trust-600 to-trust-800 flex items-center justify-center text-white shadow-md shadow-trust-600/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Trust<span className="text-trust-600">Lens</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-trust-100 text-trust-800 border border-trust-200">
                  Shield v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Check suspicious digital interactions before you act
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('check')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeView === 'check' 
                  ? 'bg-trust-50 text-trust-700 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Verify Checkers
            </button>
            <button
              onClick={() => setActiveView('intelligence')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'intelligence' 
                  ? 'bg-trust-50 text-trust-700 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-trust-500" />
              Threat Intel & Data
            </button>
            <button
              onClick={() => setActiveView('playbook')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'playbook' 
                  ? 'bg-trust-50 text-trust-700 font-semibold' 
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Safety Playbook
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Mode Toggle */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-semibold transition-all ${
                isDemoMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
              title="Toggle interactive demo mode with prefilled real-world scam scenarios"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isDemoMode ? 'text-amber-600' : 'text-slate-500'}`} />
              <span>Demo Mode</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wider font-bold ${
                isDemoMode ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'
              }`}>
                {isDemoMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Privacy Shield Button */}
            <button
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Learn how TrustLens protects your personal privacy"
            >
              <Lock className="w-3.5 h-3.5 text-trust-600" />
              <span className="hidden sm:inline">Privacy First</span>
            </button>

            {/* Helpline quick dial badge */}
            <a
              href="tel:1930"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
              title="National Cyber Crime Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Helpline: 1930</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
