const { sanitizeInput } = require('./sanitizer');
const intelligence = require('../data/intelligence.json');

const SUSPICIOUS_VPA_WORDS = intelligence.paymentIntelligence.suspiciousVpaPatterns;
const LEGIT_PREFIXES = intelligence.paymentIntelligence.legitimateMerchantPrefixes;

function checkPayment(input) {
  let vpa = '';
  let amount = '';
  let remark = '';
  let context = '';

  if (typeof input === 'string') {
    vpa = input;
    context = input;
  } else if (typeof input === 'object' && input !== null) {
    vpa = input.vpa || input.upiId || '';
    amount = input.amount || '';
    remark = input.remark || '';
    context = input.context || '';
  }

  const { sanitizedText, privacyAlert } = sanitizeInput(`${vpa} ${remark} ${context}`);
  const combined = sanitizedText.toLowerCase();

  const reasons = [];
  let riskScore = 0;

  // 1. THE GOLDEN RULE OF UPI FRAUD
  const claimsReceiving = combined.includes('receive') || combined.includes('refund') || combined.includes('cashback') || combined.includes('won') || combined.includes('credit') || combined.includes('reward') || combined.includes('claim');
  const mentionsPin = combined.includes('pin') || combined.includes('enter pin') || combined.includes('passcode') || combined.includes('approve request');

  if (claimsReceiving && mentionsPin) {
    riskScore += 80;
    reasons.push('CRITICAL FRAUD DETECTED: You are being asked to enter your UPI PIN to "receive" money. In UPI architecture, entering your PIN NEVER credits money; it ALWAYS debits money from your account!');
  } else if (claimsReceiving) {
    riskScore += 45;
    reasons.push('Suspicious incoming payment setup: Scammers send "Collect" payment requests disguised as refunds or cashback.');
  }

  // 2. VPA structure analysis
  if (vpa) {
    const vpaTrimmed = vpa.trim().toLowerCase();
    const isVpaFormat = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(vpaTrimmed);

    if (isVpaFormat) {
      const [handle, provider] = vpaTrimmed.split('@');

      // Check if handle mimics official support
      for (const kw of SUSPICIOUS_VPA_WORDS) {
        if (handle.includes(kw)) {
          riskScore += 50;
          reasons.push(`The UPI ID "${vpaTrimmed}" contains the keyword "${kw}". Legitimate customer care or banks NEVER use generic personal UPI handles for refunds or resolution.`);
          break;
        }
      }

      // Check if impersonating major brand
      const brands = ['paytm', 'phonepe', 'gpay', 'sbi', 'hdfc', 'amazon', 'flipkart', 'olx'];
      for (const b of brands) {
        if (handle.includes(b)) {
          // If it's a personal handle claiming to be the brand
          if (!LEGIT_PREFIXES.some(lp => handle.startsWith(lp))) {
            riskScore += 35;
            reasons.push(`The handle claims to be affiliated with "${b.toUpperCase()}", but is registered as an unverified individual identifier.`);
            break;
          }
        }
      }
    }
  }

  // 3. Reverse payment tricks (OLX / Marketplace scam)
  if (combined.includes('olx') || combined.includes('quikr') || combined.includes('buyer') || combined.includes('advance payment') || combined.includes('army officer') || combined.includes('defence person')) {
    if (combined.includes('scan') || combined.includes('qr') || mentionsPin || claimsReceiving) {
      riskScore += 60;
      reasons.push('Classic Marketplace / OLX Army Impersonation Scam: Fraudster claims to be a posted soldier or buyer sending advance payment via QR/collect request.');
    }
  }

  // 4. Remote app coercion
  if (combined.includes('anydesk') || combined.includes('quicksupport') || combined.includes('teamviewer') || combined.includes('rustdesk')) {
    riskScore += 70;
    reasons.push('The sender asked you to install a screen-sharing tool (AnyDesk/QuickSupport) to "verify" or "assist" with the payment. They will drain your bank balance once connected.');
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'No high-risk payment coercion or deceptive collect signals detected.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'Severe payment fraud indicators detected.';
    nextSteps.push('DO NOT enter your UPI PIN. Reject the payment request inside your UPI app.');
    nextSteps.push('Block and report the contact on your payment application and WhatsApp.');
    nextSteps.push('If any amount was accidentally debited, call the National Cyber Crime Helpline immediately at 1930 and contact your bank to freeze your account/cards.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'Ambiguous payment request. Exercise extreme care before authorizing.';
    nextSteps.push('Carefully check the "Pay" screen inside your UPI app — verify whether money will leave your account or arrive.');
    nextSteps.push('Never send a nominal "₹1 or ₹5 test transfer" to an unknown party.');
  } else {
    status = 'No obvious warning signs';
    summary = 'No recognized payment fraud patterns identified.';
    nextSteps.push('Always confirm the merchant name and transaction amount before entering your PIN.');
    nextSteps.push('Remember: UPI PIN is ONLY needed for SENDING money or checking balance.');
  }

  return {
    status,
    confidence: 90,
    riskScore: Math.min(100, riskScore),
    summary,
    reasons: reasons.length ? reasons : ['No high-risk collect requests or reverse payment patterns identified.', 'VPA syntax conforms to standard payment address formats.'],
    nextSteps,
    privacyAlert,
    goldenRule: intelligence.paymentIntelligence.goldenRule,
    datasetInsights: {
      paytmBenchmarkGMV: intelligence.paymentIntelligence.datasetBenchmark.paytmRecordedQuarterlyGMVAvg,
      verifiedMerchantPattern: 'Verified commercial merchants use secure merchant SDKs, not ad-hoc peer collect requests.'
    }
  };
}

module.exports = { checkPayment };
