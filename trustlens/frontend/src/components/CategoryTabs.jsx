import React from 'react';
import { 
  Globe, 
  Smartphone, 
  QrCode, 
  Mic, 
  CreditCard, 
  PhoneCall, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'url',
    title: 'Phishing Links',
    subtitle: 'Typosquatting & fake domains',
    icon: Globe,
    badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
    number: '1'
  },
  {
    id: 'app',
    title: 'Fake Apps & APKs',
    subtitle: 'Sideloads & risky permissions',
    icon: Smartphone,
    badgeColor: 'text-purple-600 bg-purple-50 border-purple-200',
    number: '2'
  },
  {
    id: 'qr',
    title: 'Malicious QR Codes',
    subtitle: 'Reverse UPI debit & rogue Wi-Fi',
    icon: QrCode,
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    number: '3'
  },
  {
    id: 'voice',
    title: 'AI Voice Clones',
    subtitle: 'Kidnap extortion & voice fraud',
    icon: Mic,
    badgeColor: 'text-rose-600 bg-rose-50 border-rose-200',
    number: '4'
  },
  {
    id: 'payment',
    title: 'Payment & UPI Scams',
    subtitle: 'Fake VPAs & reverse collect',
    icon: CreditCard,
    badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
    number: '5'
  },
  {
    id: 'call',
    title: 'Digital Arrest & Calls',
    subtitle: 'CBI, Police & Customs threats',
    icon: PhoneCall,
    badgeColor: 'text-red-600 bg-red-50 border-red-200',
    number: '6'
  },
  {
    id: 'message',
    title: 'Scam SMS & Chats',
    subtitle: 'Power cut, KYC & job offers',
    icon: MessageSquare,
    badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    number: '7'
  }
];

export default function CategoryTabs({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>7 Dedicated Safety Checkers</span>
            <span className="text-[11px] font-normal text-slate-400">Select an area to check</span>
          </h2>
        </div>

        {/* Scrollable on small screens, grid on large */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-trust-50/90 border-trust-500 shadow-sm ring-1 ring-trust-400'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-trust-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    #{cat.number}
                  </span>
                </div>

                <span className={`text-xs font-bold leading-tight ${isActive ? 'text-trust-900' : 'text-slate-900'}`}>
                  {cat.title}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.subtitle}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-trust-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
