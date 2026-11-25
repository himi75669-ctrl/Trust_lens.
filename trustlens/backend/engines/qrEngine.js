const { sanitizeInput } = require('./sanitizer');
const { checkUrl } = require('./urlEngine');

function checkQr(rawQrContent) {
  const { sanitizedText, privacyAlert } = sanitizeInput(rawQrContent);
  const trimmed = sanitizedText.trim();

  if (!trimmed) {
    return {
      status: 'Unable to check',
      confidence: 0,
      summary: 'No QR code payload or destination was provided.',
      reasons: ['Please scan or enter the text encoded inside the QR code.'],
      nextSteps: ['Use your device camera or TrustLens image scanner to read the QR code safely without opening it.'],
      privacyAlert
    };
  }

  const reasons = [];
  let riskScore = 0;
  let qrType = 'Unknown';
  let details = { rawPayload: trimmed };

  // 1. UPI Payment QR check
  if (trimmed.startsWith('upi://') || trimmed.includes('pay?pa=') || /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(trimmed)) {
    qrType = 'UPI Payment Intent';
    riskScore += 25; // Default caution because of rampant "scan to receive" scam
    reasons.push('CRITICAL RULE: Scanning a QR code is ONLY used to SEND (pay) money. A QR code can NEVER deposit or credit money into your bank account.');

    // Parse UPI parameters if present
    const upiMatch = trimmed.match(/pa=([^&]+)/i);
    const payeeAddress = upiMatch ? decodeURIComponent(upiMatch[1]) : '';
    const nameMatch = trimmed.match(/pn=([^&]+)/i);
    const payeeName = nameMatch ? decodeURIComponent(nameMatch[1]) : '';
    const amountMatch = trimmed.match(/am=([^&]+)/i);
    const amount = amountMatch ? amountMatch[1] : '';

    details.payeeAddress = payeeAddress;
    details.payeeName = payeeName;
    details.amount = amount;

    if (amount) {
      riskScore += 30;
      reasons.push(`This QR code is pre-configured to DEBIT ₹${amount} from your account immediately upon PIN confirmation.`);
    }

    if (payeeAddress) {
      const suspiciousVpaKeywords = ['refund', 'support', 'helpdesk', 'cashback', 'reward', 'care', 'customer'];
      for (const kw of suspiciousVpaKeywords) {
        if (payeeAddress.toLowerCase().includes(kw)) {
          riskScore += 40;
          reasons.push(`Payee VPA contains "${kw}", a frequent pattern in fake customer service and cashback impersonation.`);
          break;
        }
      }
    }
  }
  // 2. Wi-Fi Configuration QR check
  else if (trimmed.startsWith('WIFI:')) {
    qrType = 'Wi-Fi Network Configuration';
    riskScore += 30;
    reasons.push('This QR code attempts to automatically connect your device to an external Wi-Fi network.');
    reasons.push('Rogue Wi-Fi hotspots can intercept unencrypted internet traffic and perform man-in-the-middle credential harvesting.');
  }
  // 3. Web URL QR check
  else if (/^https?:\/\//i.test(trimmed) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(trimmed)) {
    qrType = 'Web URL Destination';
    const urlAnalysis = checkUrl(trimmed);
    riskScore = urlAnalysis.riskScore;
    reasons.push(...urlAnalysis.reasons);
    details.urlAnalysis = urlAnalysis;
  }
  // 4. Intent / Deep link / APK
  else if (trimmed.includes('.apk') || trimmed.startsWith('intent://') || trimmed.startsWith('market://')) {
    qrType = 'App Sideload / Package Intent';
    riskScore += 55;
    reasons.push('The QR code contains a direct app download or application execution intent that bypasses browser sandboxing.');
  } else {
    qrType = 'Plain Text / Data';
    riskScore = 15;
    reasons.push('The QR code contains unstructured plain text or identifier strings.');
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'QR destination does not exhibit overt fraud or auto-exploit triggers.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'Dangerous QR code payload detected (risk of unauthorized payment or malware download).';
    nextSteps.push('DO NOT proceed or authenticate this QR code.');
    nextSteps.push('If a buyer on OLX/Marketplace told you to "scan this QR to receive advance money", it is 100% a scam. Block the sender.');
    nextSteps.push('Never enter your UPI PIN after scanning an unsolicited QR code.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'QR code requires explicit user scrutiny before action.';
    nextSteps.push('Verify the exact recipient name and payable amount on your payment app before entering any credentials.');
    nextSteps.push('If this QR is placed on a physical sticker (e.g. at a fuel pump or parking meter), check if a scammer pasted their own sticker over the merchant’s official code.');
  } else {
    status = 'No obvious warning signs';
    summary = 'No immediate warning signs detected in the QR code payload.';
    nextSteps.push('Always check that the decoded destination matches what you expected.');
    nextSteps.push('Remember: Scanning never credits your balance.');
  }

  return {
    status,
    confidence: 85,
    riskScore: Math.min(100, riskScore),
    summary,
    reasons,
    nextSteps,
    privacyAlert,
    securityDisclaimer: 'TrustLens decoded the QR structure without visiting web targets or executing intent triggers.',
    details: {
      qrType,
      ...details
    }
  };
}

module.exports = { checkQr };
