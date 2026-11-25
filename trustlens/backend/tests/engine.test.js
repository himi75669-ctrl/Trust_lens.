const assert = require('assert');
const { checkUrl } = require('../engines/urlEngine');
const { checkApp } = require('../engines/appEngine');
const { checkQr } = require('../engines/qrEngine');
const { checkVoice } = require('../engines/voiceEngine');
const { checkPayment } = require('../engines/paymentEngine');
const { checkCall } = require('../engines/callEngine');
const { checkMessage } = require('../engines/messageEngine');
const { sanitizeInput } = require('../engines/sanitizer');

console.log('🧪 Starting TrustLens Verification Engine Tests...\n');

// 1. Sanitizer Test
const sanitized = sanitizeInput('My card is 4111 2222 3333 4444 and my OTP is 654321');
assert.ok(sanitized.sanitizedText.includes('[REDACTED_CARD_NUMBER_4444]'), 'Card number must be redacted');
assert.ok(sanitized.sanitizedText.includes('[REDACTED_PIN/OTP]'), 'OTP must be redacted');
assert.ok(sanitized.privacyAlert, 'Privacy alert must be present');
console.log('✅ Sanitizer: Sensitive credential masking verified.');

// 2. URL Engine Test
const scamUrl = checkUrl('https://sbi-kyc-update.xyz/login');
assert.strictEqual(scamUrl.status, 'Suspicious', 'Phishing URL should be Suspicious');
const legitUrl = checkUrl('https://www.onlinesbi.sbi');
assert.strictEqual(legitUrl.status, 'No obvious warning signs', 'Official URL should be clean');
console.log('✅ URL Engine: Phishing vs Legit detection verified.');

// 3. App Engine Test
const scamApp = checkApp({
  appName: 'WhatsApp Pink',
  packageName: 'org.whatsapp.pink',
  source: 'Telegram APK',
  permissions: ['android.permission.BIND_ACCESSIBILITY_SERVICE', 'android.permission.READ_SMS']
});
assert.strictEqual(scamApp.status, 'Suspicious', 'Trojan app should be Suspicious');
console.log('✅ App Engine: Sideload & Accessibility exploit verified.');

// 4. QR Engine Test
const scamQr = checkQr('upi://pay?pa=refund@okhdfcbank&am=3000');
assert.strictEqual(scamQr.status, 'Suspicious', 'Deceptive collect QR should be Suspicious');
console.log('✅ QR Engine: Malicious reverse-payment QR verified.');

// 5. Voice Engine Test
const noConsentVoice = checkVoice({ consentGranted: false });
assert.strictEqual(noConsentVoice.status, 'Unable to check', 'Voice analysis without consent must be blocked');
const scamVoice = checkVoice({
  consentGranted: true,
  description: 'Mom please do not tell dad! I am in police custody after an accident, send bail money immediately!'
});
assert.strictEqual(scamVoice.status, 'Suspicious', 'Family kidnap extortion script should be Suspicious');
console.log('✅ Voice Engine: Consent enforcement & extortion detection verified.');

// 6. Payment Engine Test
const scamPayment = checkPayment({
  vpa: 'refund-desk@ybl',
  context: 'OLX buyer said enter UPI PIN to receive payment for items'
});
assert.strictEqual(scamPayment.status, 'Suspicious', 'Enter PIN to receive scam should be Suspicious');
console.log('✅ Payment Engine: UPI Golden Rule & reverse debit trick verified.');

// 7. Call Engine Test
const scamCall = checkCall({
  claimedCaller: 'CBI Cyber Cell',
  conversationSummary: 'FedEx parcel with narcotics seized at airport, you are under Digital Arrest, transfer money to RBI account.'
});
assert.strictEqual(scamCall.status, 'Suspicious', 'Digital arrest scam should be Suspicious');
console.log('✅ Call Engine: Digital Arrest & authority impersonation verified.');

// 8. Message Engine Test
const scamMsg = checkMessage({
  sender: '+919876543210',
  text: 'Dear customer your electricity power will be disconnected tonight at 9:30 PM call electricity officer immediately.'
});
assert.strictEqual(scamMsg.status, 'Suspicious', 'Power cut scam SMS should be Suspicious');
console.log('✅ Message Engine: Urgency smishing template verified.');

console.log('\n🎉 ALL 8 TEST SUITES PASSED FLAWLESSLY!');
