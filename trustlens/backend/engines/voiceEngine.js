const { sanitizeInput } = require('./sanitizer');

const AI_VOICE_SCAM_SCENARIOS = [
  {
    type: 'Family Emergency / Mock Kidnapping',
    keywords: ['dad', 'mom', 'accident', 'hospital', 'police station', 'arrested', 'bail', 'kidnapped', 'in trouble', 'urgent money', 'don\'t tell'],
    score: 65,
    note: 'Extreme emotional distress combined with secrecy demands ("don’t tell anyone, transfer immediately") is the hallmark of AI voice clone extortion.'
  },
  {
    type: 'Executive / CEO Urgent Wire Fraud',
    keywords: ['boss', 'ceo', 'director', 'wire transfer', 'urgent gift card', 'confidential meeting', 'acquisition', 'pay immediately', 'vendor payment'],
    score: 55,
    note: 'Simulated voice of company executives demanding immediate out-of-band wire transfers or gift cards.'
  },
  {
    type: 'Government / Police Interrogation',
    keywords: ['cyber cell', 'cbi', 'customs', 'narcotics', 'warrant', 'digital arrest', 'bank account freeze', 'clear funds'],
    score: 60,
    note: 'Robotic or synthesized law enforcement threats intended to coerce instant compliance.'
  }
];

function checkVoice(input) {
  // Check explicit consent requirement
  const hasConsent = input && input.consentGranted === true;
  if (!hasConsent) {
    return {
      status: 'Unable to check',
      confidence: 0,
      requiresConsent: true,
      summary: 'Explicit user consent required before analyzing voice or audio content.',
      reasons: ['TrustLens requires affirmative user consent before processing acoustic descriptions or audio recordings to protect personal privacy.'],
      nextSteps: ['Review the consent notice and grant permission to proceed with the voice check.'],
      privacyAlert: 'Zero Audio Retention Guarantee: Audio and acoustic transcripts are never saved, shared, or used to train third-party AI models.'
    };
  }

  const rawDescription = (input && input.description) || (typeof input === 'string' ? input : '');
  const { sanitizedText, privacyAlert } = sanitizeInput(rawDescription);
  const text = sanitizedText.toLowerCase();

  const reasons = [];
  let riskScore = 0;
  const detectedScenarios = [];

  // Check acoustic anomaly indicators if user provided them
  if (input.acousticAnomalies) {
    const { unnaturalCadence, flatTone, lackOfBreathing, audioGlitch, backgroundMismatch } = input.acousticAnomalies;
    if (unnaturalCadence) {
      riskScore += 25;
      reasons.push('Unnatural robotic prosody / pacing: Synthesized voice models often struggle with human rhythm variations.');
    }
    if (flatTone) {
      riskScore += 20;
      reasons.push('Flat emotional inflection despite claiming an extreme life-or-death crisis.');
    }
    if (lackOfBreathing) {
      riskScore += 25;
      reasons.push('Absence of biological inhalation pauses or organic breath micro-sounds between rapid sentences.');
    }
    if (audioGlitch) {
      riskScore += 15;
      reasons.push('Phoneme clipping or metallic robotic distortion artifacts typical of real-time voice conversion models.');
    }
    if (backgroundMismatch) {
      riskScore += 20;
      reasons.push('Acoustic room reverberation mismatch (caller claims to be in a hospital/police station, but room acoustics are dead silent).');
    }
  }

  // Check scenario patterns
  for (const scenario of AI_VOICE_SCAM_SCENARIOS) {
    let matchCount = 0;
    for (const kw of scenario.keywords) {
      if (text.includes(kw)) {
        matchCount++;
      }
    }
    if (matchCount >= 2) {
      riskScore += scenario.score;
      detectedScenarios.push(scenario.type);
      reasons.push(`High resemblance to "${scenario.type}" scheme: ${scenario.note}`);
    }
  }

  // Check urgency pressure
  if (text.includes('right now') || text.includes('hurry') || text.includes('immediately') || text.includes('within 10 minutes')) {
    riskScore += 20;
    reasons.push('Artificial time compression: Demands action within minutes to prevent you from conferring with other family members.');
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'No high-risk emotional extortion or synthetic voice markers identified.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'High probability of an AI-cloned voice or targeted impersonation emergency scam.';
    nextSteps.push('HANG UP IMMEDIATELY. Do not transfer any funds or share codes.');
    nextSteps.push('Direct Callback Protocol: Call your family member directly on their saved regular phone number or video call them via WhatsApp.');
    nextSteps.push('Establish a "Family Safe Word" — a private verbal codeword only your immediate family knows, which an AI clone cannot know.');
    nextSteps.push('If the caller claimed to be police or an attorney, contact the local police station independently on their published landline.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'Unusual tone or unexpected request received. Requires secondary verification.';
    nextSteps.push('Pause and verify with a trusted third party before sending money.');
    nextSteps.push('Ask the caller a question about a private memory that only your real family member would remember.');
  } else {
    status = 'No obvious warning signs';
    summary = 'No common voice-clone extortion indicators detected.';
    nextSteps.push('Maintain healthy skepticism whenever money or banking codes are requested over the phone.');
  }

  return {
    status,
    confidence: 80,
    riskScore: Math.min(100, riskScore),
    summary,
    detectedScenarios,
    reasons: reasons.length ? reasons : ['No common psychological coercion tropes found in description.', 'No reported synthetic speech acoustic anomalies.'],
    nextSteps,
    privacyAlert,
    consentVerified: true,
    securityDisclaimer: 'Voice analysis is strictly heuristic and non-biometric. Audio data is discarded immediately after analysis.'
  };
}

module.exports = { checkVoice };
