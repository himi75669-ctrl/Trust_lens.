const express = require('express');
const router = express.Router();

const { checkUrl } = require('../engines/urlEngine');
const { checkApp } = require('../engines/appEngine');
const { checkQr } = require('../engines/qrEngine');
const { checkVoice } = require('../engines/voiceEngine');
const { checkPayment } = require('../engines/paymentEngine');
const { checkCall } = require('../engines/callEngine');
const { checkMessage } = require('../engines/messageEngine');

const demoExamples = require('../data/demoExamples.json');
const intelligence = require('../data/intelligence.json');
const adapters = require('../adapters/externalAdapters');

// 1. URL Check
router.post('/check/url', (req, res) => {
  const url = req.body.url || req.body.input || '';
  const result = checkUrl(url);
  return res.json(result);
});

// 2. App Check
router.post('/check/app', (req, res) => {
  const result = checkApp(req.body);
  return res.json(result);
});

// 3. QR Check
router.post('/check/qr', (req, res) => {
  const payload = req.body.payload || req.body.qrContent || req.body.input || '';
  const result = checkQr(payload);
  return res.json(result);
});

// 4. Voice Check
router.post('/check/voice', (req, res) => {
  const result = checkVoice(req.body);
  return res.json(result);
});

// 5. Payment Check
router.post('/check/payment', (req, res) => {
  const result = checkPayment(req.body);
  return res.json(result);
});

// 6. Call Check
router.post('/check/call', (req, res) => {
  const result = checkCall(req.body);
  return res.json(result);
});

// 7. Message Check
router.post('/check/message', (req, res) => {
  const result = checkMessage(req.body);
  return res.json(result);
});

// Universal Auto-Detector endpoint: automatically detects input type
router.post('/check/auto', (req, res) => {
  const raw = (req.body.text || req.body.input || '').trim();
  if (!raw) {
    return res.status(400).json({ error: 'No input provided' });
  }

  // Type classification heuristics:
  // URL check
  if (/^https?:\/\//i.test(raw) || /^[a-zA-Z0-9-]+\.(com|org|net|xyz|top|in|co|io|biz|site)[^\s]*$/i.test(raw)) {
    const resUrl = checkUrl(raw);
    return res.json({ detectedType: 'url', ...resUrl });
  }

  // UPI VPA check
  if (/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(raw) || raw.toLowerCase().includes('upi://')) {
    const resPayment = checkPayment({ vpa: raw, context: raw });
    return res.json({ detectedType: 'payment', ...resPayment });
  }

  // QR Code format (WIFI:, upi://, MECARD:)
  if (raw.startsWith('WIFI:') || raw.startsWith('MECARD:') || raw.startsWith('intent://')) {
    const resQr = checkQr(raw);
    return res.json({ detectedType: 'qr', ...resQr });
  }

  // Caller phone number pattern (+91, +92, etc. standalone)
  if (/^\+?[0-9\s\-()]{7,18}$/.test(raw) && !raw.includes(' ')) {
    const resCall = checkCall({ callerNumber: raw, conversationSummary: 'User submitted standalone phone number for verification.' });
    return res.json({ detectedType: 'call', ...resCall });
  }

  // Default to Message / SMS / Call text analysis
  if (raw.toLowerCase().includes('call') || raw.toLowerCase().includes('officer') || raw.toLowerCase().includes('digital arrest')) {
    const resCall = checkCall(raw);
    return res.json({ detectedType: 'call', ...resCall });
  }

  const resMsg = checkMessage(raw);
  return res.json({ detectedType: 'message', ...resMsg });
});

// Demo examples endpoint
router.get('/demos', (req, res) => {
  return res.json(demoExamples);
});

// Threat intelligence data endpoint
router.get('/intelligence', (req, res) => {
  return res.json(intelligence);
});

// Adapters endpoint
router.get('/adapters', (req, res) => {
  return res.json({
    safeBrowsing: adapters.safeBrowsingAdapter.getMetadata(),
    playIntegrity: adapters.playIntegrityAdapter.getMetadata(),
    upiValidation: adapters.upiVpaValidationAdapter.getMetadata(),
    deepfakeVoice: adapters.deepfakeVoiceAdapter.getMetadata(),
    callerId: adapters.callerIdReputationAdapter.getMetadata()
  });
});

module.exports = router;
