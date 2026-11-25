const { sanitizeInput } = require('./sanitizer');

const IMPERSONATION_TARGETS = [
  {
    org: 'Police / CBI / Cyber Crime / ED / NCB',
    keywords: ['cbi', 'police', 'cyber crime', 'cyber cell', 'crime branch', 'narcotics', 'ncb', 'enforcement directorate', 'ed', 'warrant', 'arrest', 'fir', 'digital arrest'],
    severity: 65,
    advice: 'CRITICAL FACT: The concept of "Digital Arrest" DOES NOT EXIST in Indian or international law. Law enforcement agencies NEVER conduct arrests over Skype, WhatsApp, or video calls, and NEVER ask for money transfers.'
  },
  {
    org: 'Customs / FedEx / DHL / International Courier',
    keywords: ['customs', 'fedex', 'dhl', 'parcel', 'courier', 'mumbai airport', 'delhi airport', 'illegal drugs', 'contraband', 'passports', 'taiwan', 'cambodia'],
    severity: 60,
    advice: 'Scammers claim an illegal parcel sent in your name containing drugs or fake passports has been intercepted, then conference you with fake police officers.'
  },
  {
    org: 'TRAI / Department of Telecommunications (DoT)',
    keywords: ['trai', 'telecom', 'dot', 'mobile number will be blocked', 'disconnected in 2 hours', 'sim card illegal activity'],
    severity: 55,
    advice: 'TRAI or DoT never makes automated or direct calls threatening disconnection within 2 hours. This is an intimidation scheme.'
  },
  {
    org: 'State Electricity Department / Power Disconnection',
    keywords: ['electricity', 'power bill', 'light bill', 'disconnected tonight', 'power cut', 'electricity officer'],
    severity: 55,
    advice: 'Power utility companies never dispatch personal WhatsApp messages or calls demanding payment to an officer’s personal phone.'
  },
  {
    org: 'Bank Security / RBI / Card Department',
    keywords: ['rbi', 'reserve bank', 'bank manager', 'card blocked', 'kyc expired', 'security team', 'unauthorized transaction'],
    severity: 50,
    advice: 'Bank staff will never ask you to read back an SMS OTP, CVV, or transfer money to a "safety escrow account".'
  }
];

function checkCall(input) {
  let callerNumber = '';
  let claimedCaller = '';
  let conversationSummary = '';

  if (typeof input === 'string') {
    conversationSummary = input;
    claimedCaller = input;
  } else if (typeof input === 'object' && input !== null) {
    callerNumber = input.callerNumber || '';
    claimedCaller = input.claimedCaller || '';
    conversationSummary = input.conversationSummary || input.description || '';
  }

  const { sanitizedText, privacyAlert } = sanitizeInput(`${callerNumber} ${claimedCaller} ${conversationSummary}`);
  const combined = sanitizedText.toLowerCase();

  const reasons = [];
  let riskScore = 0;
  const detectedOrgs = [];

  // 1. Digital Arrest & Authority Impersonation Check
  for (const target of IMPERSONATION_TARGETS) {
    let matchCount = 0;
    for (const kw of target.keywords) {
      if (combined.includes(kw)) {
        matchCount++;
      }
    }
    if (matchCount >= 2 || (target.org.includes('Police') && combined.includes('digital arrest'))) {
      riskScore += target.severity;
      detectedOrgs.push(target.org);
      reasons.push(`Impersonation of ${target.org}: ${target.advice}`);
    }
  }

  // 2. Coercion tactics
  if (combined.includes('stay on the call') || combined.includes('do not hang up') || combined.includes('room lock') || combined.includes('isolated') || combined.includes('keep it confidential')) {
    riskScore += 25;
    reasons.push('Psychological Isolation Tactic: The caller demanded that you remain connected without hanging up and forbidden you from speaking with family or a lawyer.');
  }

  // 3. Demands for money / Verification account
  if (combined.includes('transfer') || combined.includes('rbi verification account') || combined.includes('security deposit') || combined.includes('clear your name') || combined.includes('bail money')) {
    riskScore += 35;
    reasons.push('Coerced Financial Transfer: Asked you to move money to a "secret government verification account" to prove innocence. Government bodies NEVER hold temporary verification funds.');
  }

  // 4. Caller ID analysis
  if (callerNumber) {
    const cleanNum = callerNumber.trim().replace(/[\s\-()]/g, '');
    if (cleanNum.startsWith('+92') || cleanNum.startsWith('+880') || cleanNum.startsWith('+93')) {
      riskScore += 40;
      reasons.push(`International caller code (${cleanNum.slice(0, 3)}) used for local domestic government claims.`);
    }
    if (cleanNum.startsWith('+1') && combined.includes('cbi')) {
      riskScore += 45;
      reasons.push('US/VoIP number (+1) attempting to pose as Indian police or CBI.');
    }
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'Call details do not match typical extortion, digital arrest, or impersonation patterns.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'Severe impersonation, extortion, or "Digital Arrest" scam call detected.';
    nextSteps.push('DISCONNECT THE CALL IMMEDIATELY. You are not in legal danger.');
    nextSteps.push('Report the incident to the National Cyber Crime Portal (1930 or cybercrime.gov.in).');
    nextSteps.push('Block the caller number and report it on the Government of India Chakshu portal (sancharsaathi.gov.in/sfc).');
    nextSteps.push('Never turn on video calls on Skype/WhatsApp for unknown callers demanding you face a fake police setup.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'Unusual caller demands or unverified authority signals detected.';
    nextSteps.push('Hang up and verify the claim by calling the organization’s published customer support number directly.');
    nextSteps.push('Never disclose your banking credentials, Aadhaar number, or OTPs.');
  } else {
    status = 'No obvious warning signs';
    summary = 'No common scam impersonation signals found in the description.';
    nextSteps.push('Stay vigilant. Official agencies communicate legal matters via formal physical post, not urgent phone calls.');
  }

  return {
    status,
    confidence: 90,
    riskScore: Math.min(100, riskScore),
    summary,
    detectedOrgs,
    reasons: reasons.length ? reasons : ['No high-pressure legal coercion patterns found.', 'No recognized scam authority scripts detected.'],
    nextSteps,
    privacyAlert,
    securityDisclaimer: 'TrustLens analyzed the reported call attributes heuristically without storing personal contact identifiers.'
  };
}

module.exports = { checkCall };
