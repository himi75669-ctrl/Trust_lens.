const { sanitizeInput } = require('./sanitizer');
const intelligence = require('../data/intelligence.json');

const URGENCY_TOKENS = intelligence.messageAndVoiceIntelligence.highUrgencyTokens;

const MESSAGE_SCAM_TEMPLATES = [
  {
    category: 'Electricity / Utility Disconnection Scam',
    keywords: ['electricity', 'power', 'disconnected tonight', 'update your bill', 'electricity officer', 'bill unpaid'],
    score: 60,
    explanation: 'Scammers claim power will be cut off tonight at 9:30 PM due to unpaid bills and prompt you to call a personal mobile number or install a helper app.'
  },
  {
    category: 'Bank Account / KYC Deactivation Phishing',
    keywords: ['sbi', 'hdfc', 'yono', 'kyc', 'pan card', 'account blocked', 'suspended', 'immediately update', 'netbanking'],
    score: 60,
    explanation: 'Fake bank security alert claiming your account or debit card has been suspended and forcing you to click an unverified link to submit credentials.'
  },
  {
    category: 'Part-Time Job / Task / Telegram Scam',
    keywords: ['daily income', 'work from home', 'rating hotels', 'liking youtube videos', 'telegram', 'earn 3000', 'part time job', 'daily payout'],
    score: 55,
    explanation: 'Deceptive high-yield recruitment scam that pays small initial amounts to gain trust, then coerces victims into investing huge sums in fake crypto tasks.'
  },
  {
    category: 'Lottery / Prize / KBC Winner Scam',
    keywords: ['lottery', 'winner', 'kbc', 'jio lucky draw', 'won 25 lakhs', 'claim prize', 'congratulations you won'],
    score: 65,
    explanation: 'Classic prize scam demanding payment of taxes or processing fees before receiving a non-existent multi-million prize.'
  },
  {
    category: 'Courier / Package Delivery Issue',
    keywords: ['package', 'courier', 'delivery address incomplete', 'redelivery', 'reschedule fee', 'parcel could not be delivered'],
    score: 45,
    explanation: 'Smishing scam claiming an undelivered parcel with a fake tracking link demanding small card payment to steal CVV numbers.'
  }
];

function checkMessage(input) {
  let sender = '';
  let messageText = '';
  let receivedHour = null;

  if (typeof input === 'string') {
    messageText = input;
  } else if (typeof input === 'object' && input !== null) {
    sender = input.sender || '';
    messageText = input.text || input.message || input.messageText || '';
    receivedHour = input.hour !== undefined ? parseInt(input.hour, 10) : null;
  }

  const { sanitizedText, privacyAlert } = sanitizeInput(`${sender} ${messageText}`);
  const text = sanitizedText.toLowerCase();

  const reasons = [];
  let riskScore = 0;
  const matchedCategories = [];
  const matchedTokens = [];

  // 1. Match extracted urgency tokens from Fake.csv & threat intel
  for (const token of URGENCY_TOKENS) {
    if (text.includes(token)) {
      matchedTokens.push(token);
    }
  }

  if (matchedTokens.length >= 3) {
    riskScore += 35;
    reasons.push(`High concentration of emotional urgency and manipulation triggers: [${matchedTokens.slice(0, 6).join(', ')}].`);
  } else if (matchedTokens.length >= 1) {
    riskScore += 15;
    reasons.push(`Detected urgency keywords: [${matchedTokens.join(', ')}].`);
  }

  // 2. Scam category templates
  for (const tpl of MESSAGE_SCAM_TEMPLATES) {
    let matches = 0;
    for (const kw of tpl.keywords) {
      if (text.includes(kw)) {
        matches++;
      }
    }
    if (matches >= 2) {
      riskScore += tpl.score;
      matchedCategories.push(tpl.category);
      reasons.push(`Matches pattern for ${tpl.category}: ${tpl.explanation}`);
    }
  }

  // 3. Link embedded in SMS
  const hasLink = /https?:\/\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|\.xyz|\.top|\.apk/i.test(messageText);
  if (hasLink) {
    riskScore += 25;
    reasons.push('Contains an embedded web link or APK file inside an unprompted message.');
  }

  // 4. Request to reply with OTP or personal data
  if (text.includes('reply with otp') || text.includes('share otp') || text.includes('send pin') || text.includes('forward this message')) {
    riskScore += 50;
    reasons.push('Explicitly requests credential sharing (OTP/PIN/Forwarding). No genuine institution will EVER ask you to reply with your OTP.');
  }

  // 5. WhatsApp chat hour heuristic (derived from Whatsapp_chat.csv analysis)
  if (receivedHour !== null && (receivedHour >= 0 && receivedHour <= 5)) {
    riskScore += 15;
    reasons.push(`Message received during off-peak hours (${receivedHour}:00 hrs). Scammers frequently initiate contact during late-night or early-morning windows to catch victims while defenses and alertness are lowered.`);
  }

  // 6. Sender header inspection
  if (sender) {
    const cleanSender = sender.trim().toUpperCase();
    // In India, legitimate bank/service SMS have registered 6-character sender headers (e.g. AX-SBIINB, VM-HDFCBK)
    // Personal 10-digit mobile numbers sending bulk bank notices are 100% fake
    if (/^[6-9]\d{9}$/.test(cleanSender.replace(/[^0-9]/g, '')) && (matchedCategories.length > 0 || hasLink)) {
      riskScore += 45;
      reasons.push(`Sender appears to be an ordinary 10-digit personal phone number (${sender}) rather than an official institutional telecom header (such as VK-HDFCBK, AD-SBIPAY). Genuine banks NEVER send customer KYC or billing alerts from regular personal SIM cards.`);
    }
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'No high-risk smishing or manipulation signals detected.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'Severe indicators of scam SMS, smishing, or fraudulent chat message.';
    nextSteps.push('DO NOT click any links, download attachments, or call numbers listed in the message.');
    nextSteps.push('DO NOT reply with "STOP" or personal info — replying confirms your phone number is active to spam networks.');
    nextSteps.push('Report and block the sender directly in your SMS/WhatsApp app.');
    nextSteps.push('Forward the message to 1909 (Do Not Disturb reporting) or report via the Chakshu cyber fraud portal.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'Message contains suspicious urgency or unexpected promotional elements.';
    nextSteps.push('Verify independently via the service’s official app rather than clicking the link.');
    nextSteps.push('Never forward sensitive authentication codes.');
  } else {
    status = 'No obvious warning signs';
    summary = 'Message text does not match common smishing or extortion templates.';
    nextSteps.push('Continue to exercise standard precautions with unverified incoming messages.');
  }

  return {
    status,
    confidence: 88,
    riskScore: Math.min(100, riskScore),
    summary,
    matchedCategories,
    matchedTokens,
    reasons: reasons.length ? reasons : ['No common manipulative urgency patterns detected in message body.', 'No credential-harvesting triggers found.'],
    nextSteps,
    privacyAlert,
    securityDisclaimer: 'TrustLens conducts static NLP pattern matching and never executes embedded shortlinks or scripts.'
  };
}

module.exports = { checkMessage };
