import React from 'react';
import { Sparkles, AlertOctagon, CheckCircle2, Info, X } from 'lucide-react';

export default function DemoToolbar({ demos, activeCategory, onApplySample, onCloseDemo }) {
  if (!demos || !demos.categories) return null;

  const currentCategoryDemos = demos.categories.find(c => c.id === activeCategory);
  if (!currentCategoryDemos) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-y border-amber-200/80 p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Demo Mode Active: {currentCategoryDemos.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold">
                  Try 1-Click Samples
                </span>
              </div>
              <p className="text-xs text-amber-800">
                Click a sample scenario below to test the detection engine instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-700/80 hidden sm:inline flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Demo Limitation: Local Heuristics & Dataset Intelligence
            </span>
            <button
              onClick={onCloseDemo}
              className="p-1 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-200/60 transition-colors"
              title="Close demo bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1-Click Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentCategoryDemos.samples.map((sample, idx) => {
            const isScam = sample.type === 'scam';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onApplySample(sample)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                  isScam
                    ? 'bg-white hover:bg-red-50 text-red-950 border-red-200 hover:border-red-400'
                    : 'bg-white hover:bg-emerald-50 text-emerald-950 border-emerald-200 hover:border-emerald-400'
                }`}
              >
                {isScam ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>{sample.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  isScam ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {sample.type}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
