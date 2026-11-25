import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroUniversal from './components/HeroUniversal';
import CategoryTabs from './components/CategoryTabs';
import DemoToolbar from './components/DemoToolbar';
import ResultCard from './components/ResultCard';
import IntelligenceDashboard from './components/IntelligenceDashboard';
import SafetyPlaybook from './components/SafetyPlaybook';
import PrivacyModal from './components/PrivacyModal';
import Footer from './components/Footer';

import UrlChecker from './components/checkers/UrlChecker';
import AppChecker from './components/checkers/AppChecker';
import QrChecker from './components/checkers/QrChecker';
import VoiceChecker from './components/checkers/VoiceChecker';
import PaymentChecker from './components/checkers/PaymentChecker';
import CallChecker from './components/checkers/CallChecker';
import MessageChecker from './components/checkers/MessageChecker';

export default function App() {
  const [activeView, setActiveView] = useState('check'); // 'check' | 'intelligence' | 'playbook'
  const [activeCategory, setActiveCategory] = useState('url');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [demos, setDemos] = useState(null);

  const resultRef = useRef(null);

  // Fetch demos on load
  useEffect(() => {
    fetch('/api/demos')
      .then(res => res.json())
      .then(data => setDemos(data))
      .catch(err => console.error('Failed to load demo examples:', err));
  }, []);

  // Universal Smart Check
  const handleSmartCheck = async (text) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/check/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text })
      });
      const data = await response.json();
      setResult(data);

      if (data.detectedType) {
        setActiveCategory(data.detectedType);
      }

      // Scroll to result card
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setResult({
        status: 'Unable to check',
        confidence: 0,
        summary: 'Network or server communication error.',
        reasons: ['Could not connect to TrustLens detection backend.'],
        nextSteps: ['Check your internet connection and verify the backend service is running.']
      });
    } finally {
      setLoading(false);
    }
  };

  // Specific Category Check
  const handleCategoryCheck = async (category, payload) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/check/${category}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResult({ ...data, detectedType: category });

      // Scroll to result card
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setResult({
        status: 'Unable to check',
        confidence: 0,
        summary: 'Error contacting analysis engine.',
        reasons: ['Backend service did not return a valid response.'],
        nextSteps: ['Try again in a few moments.']
      });
    } finally {
      setLoading(false);
    }
  };

  // Apply 1-click Demo Sample
  const handleApplySample = (sample) => {
    setInitialData(sample);
    if (sample.input) {
      // Trigger check immediately
      if (typeof sample.input === 'string') {
        handleSmartCheck(sample.input);
      } else {
        handleCategoryCheck(activeCategory, sample.input);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Navigation Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {activeView === 'check' && (
          <>
            {/* Hero & Universal Smart Paste Box */}
            <HeroUniversal
              onSmartCheck={handleSmartCheck}
              loading={loading}
              onSelectCategory={(catId) => {
                setActiveCategory(catId);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
            />

            {/* Demo Bar (when active) */}
            {isDemoMode && (
              <DemoToolbar
                demos={demos}
                activeCategory={activeCategory}
                onApplySample={handleApplySample}
                onCloseDemo={() => setIsDemoMode(false)}
              />
            )}

            {/* 7 Dedicated Category Checkers Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              
              <CategoryTabs
                activeCategory={activeCategory}
                onSelectCategory={(id) => {
                  setActiveCategory(id);
                  setInitialData(null);
                  setResult(null);
                }}
              />

              {/* Active Checker Card */}
              <div className="mt-6">
                {activeCategory === 'url' && (
                  <UrlChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
                {activeCategory === 'app' && (
                  <AppChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
                {activeCategory === 'qr' && (
                  <QrChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
                {activeCategory === 'voice' && (
                  <VoiceChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
                {activeCategory === 'payment' && (
                  <PaymentChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
                {activeCategory === 'call' && (
                  <CallChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
                {activeCategory === 'message' && (
                  <MessageChecker
                    onCheck={handleCategoryCheck}
                    loading={loading}
                    initialData={initialData}
                  />
                )}
              </div>

              {/* Inspection Results Display Card */}
              <div ref={resultRef}>
                {result && (
                  <ResultCard
                    result={result}
                    onReset={() => setResult(null)}
                  />
                )}
              </div>

            </div>
          </>
        )}

        {/* View: Threat Intelligence & Dataset Modeling */}
        {activeView === 'intelligence' && (
          <IntelligenceDashboard />
        )}

        {/* View: Emergency Safety Playbook */}
        {activeView === 'playbook' && (
          <SafetyPlaybook />
        )}

      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        setActiveView={setActiveView}
      />

      {/* Privacy Charter Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

    </div>
  );
}
