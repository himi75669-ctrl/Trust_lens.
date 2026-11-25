import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Database, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function IntelligenceDashboard() {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/intelligence')
      .then(res => res.json())
      .then(data => {
        setIntel(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fadeIn">
      
      {/* Title Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-trust-100 text-trust-800 text-xs font-semibold mb-3 border border-trust-200">
          <Database className="w-4 h-4 text-trust-600" />
          <span>Empirical Data Modeling • Research Corpora</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Research Datasets Power TrustLens
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          TrustLens detection heuristics are grounded in real-world transaction benchmarks, communication frequency patterns, and linguistic manipulation markers extracted from extensive datasets.
        </p>
      </div>

      {/* 4 Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        
        {/* 1. Paytm Payment Benchmark */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-trust-600">
                Payment Benchmark
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                paytm_ir.csv
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              ₹31.9 Lakh Cr
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Paytm quarterly transaction scale baseline used to model verified merchant infrastructure vs deceptive personal VPAs.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>15 recorded quarters analyzed</span>
          </div>
        </div>

        {/* 2. WhatsApp Interaction Hours */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Temporal Anomalies
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Whatsapp_chat.csv
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              12 AM – 4 AM
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Identified heightened susceptibility windows where scammers trigger urgent threats while victim vigilance is diminished.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>8,000+ interactions sampled</span>
          </div>
        </div>

        {/* 3. Amazon Brand & Review Baseline */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                E-Commerce Heuristics
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                amazon.csv
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              &gt; 85% Fake Discount
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Standard commercial pricing baseline for brands (Apple, boAt, Samsung). Phishing links claiming 90%+ discounts trigger red flags.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600 shrink-0" />
            <span>1,000+ catalog pricing benchmarks</span>
          </div>
        </div>

        {/* 4. Fake vs True News Linguistic Corpus */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Manipulation Lexicon
              </span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Fake.csv / True.csv
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              50,000+ Corpus
            </div>
            <p className="text-xs text-slate-500 mb-4">
              NLP token frequency analysis extracted high-urgency keywords used in extortion scripts and smishing lures.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-rose-600 shrink-0" />
            <span>High-frequency token index</span>
          </div>
        </div>

      </div>

      {/* Psychological Coercion Framework */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-10">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          The 4 Psychological Manipulation Triggers
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Across all 7 digital scam vectors, attackers exploit four consistent human vulnerabilities:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: '1. Fear & Artificial Time Panic',
              desc: 'Imposes short deadlines ("in 2 hours", "tonight at 9:30 PM") so victims act impulsively before checking facts.',
              example: 'Electricity power cutoff; arrest warrant issued; bank account suspended.'
            },
            {
              title: '2. Unearned Reward & Greed',
              desc: 'Promises free money, high lottery prizes, or effortless tasks to lure victims into paying processing fees.',
              example: 'KBC ₹25 Lakh lottery; ₹5,000/day YouTube like task; free scratch card.'
            },
            {
              title: '3. False Authority & Intimidation',
              desc: 'Impersonates prestigious bodies (CBI, Police, Customs, RBI) using fake uniforms, badges, or letterheads.',
              example: 'Digital Arrest over Skype; narcotics parcel intercepted in Mumbai Airport.'
            },
            {
              title: '4. Family Crisis & Secrecy Demands',
              desc: 'Fabricates life-or-death emergencies combined with strict demands to keep the situation hidden from others.',
              example: 'Child in hospital after car crash; urgent bail money transfer.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-600 mb-2">{item.desc}</p>
              <div className="text-[11px] font-mono text-trust-800 bg-trust-50 p-2 rounded border border-trust-200">
                Pattern: "{item.example}"
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
