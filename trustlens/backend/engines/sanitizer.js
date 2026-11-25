/**
 * Privacy & Security Sanitizer
 * Automatically strips passwords, PINs, OTPs, full credit card numbers, and Aadhaar numbers.
 * Warns the user and prevents sensitive credential leaks.
 */

function sanitizeInput(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { sanitizedText: '', detectedRedactions: [], privacyAlert: null };
  }

  let text = rawText;
  const detectedRedactions = [];

  // 1. Credit / Debit card patterns (13 to 19 digits with optional hyphens or spaces)
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  if (cardRegex.test(text)) {
    text = text.replace(cardRegex, (match) => {
      const digitsOnly = match.replace(/\D/g, '');
      if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
        detectedRedactions.push('Payment Card Number');
        return `[REDACTED_CARD_NUMBER_${digitsOnly.slice(-4)}]`;
      }
      return match;
    });
  }

  // 2. 6-digit OTP or PIN indicators
  const otpRegex = /(?:otp|pin|code|passcode|one[- ]time password)\s*(?:is|:|=)?\s*(\b\d{4,8}\b)/gi;
  if (otpRegex.test(text)) {
    text = text.replace(otpRegex, (match, code) => {
      detectedRedactions.push('One-Time Password / PIN');
      return match.replace(code, '[REDACTED_PIN/OTP]');
    });
  }

  // 3. Indian Aadhaar 12-digit number (4-4-4)
  const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
  if (aadhaarRegex.test(text)) {
    text = text.replace(aadhaarRegex, () => {
      detectedRedactions.push('National Identity Number');
      return '[REDACTED_ID_NUMBER]';
    });
  }

  // 4. Plain password fields
  const passRegex = /(?:password|pwd|secret)\s*[:=]\s*([^\s,;]+)/gi;
  if (passRegex.test(text)) {
    text = text.replace(passRegex, (match, pwd) => {
      detectedRedactions.push('Plaintext Password');
      return match.replace(pwd, '[REDACTED_PASSWORD]');
    });
  }

  let privacyAlert = null;
  if (detectedRedactions.length > 0) {
    privacyAlert = `Privacy Notice: Detected and automatically masked ${[...new Set(detectedRedactions)].join(', ')}. TrustLens strictly protects your privacy — never submit real passwords, OTPs, or payment credentials.`;
  }

  return {
    sanitizedText: text,
    detectedRedactions: [...new Set(detectedRedactions)],
    privacyAlert
  };
}

module.exports = { sanitizeInput };
