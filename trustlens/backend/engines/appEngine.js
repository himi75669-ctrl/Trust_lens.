const { sanitizeInput } = require('./sanitizer');

const DANGEROUS_PERMISSIONS = [
  'android.permission.BIND_ACCESSIBILITY_SERVICE',
  'android.permission.READ_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.REQUEST_INSTALL_PACKAGES',
  'android.permission.READ_CONTACTS',
  'android.permission.RECORD_AUDIO',
  'android.permission.READ_PHONE_STATE'
];

const KNOWN_SCAM_PACKAGES = [
  'org.whatsapp.pink',
  'com.sbi.banking.kyc',
  'com.paytm.cashback.reward',
  'com.anydesk.remote',
  'com.teamviewer.quicksupport',
  'com.loan.instant.cash.quick'
];

function checkApp(inputData) {
  let appName = '';
  let packageName = '';
  let source = '';
  let permissions = [];
  let description = '';

  if (typeof inputData === 'string') {
    appName = inputData;
    description = inputData;
  } else if (typeof inputData === 'object' && inputData !== null) {
    appName = inputData.appName || '';
    packageName = inputData.packageName || '';
    source = inputData.source || '';
    permissions = Array.isArray(inputData.permissions) ? inputData.permissions : [];
    description = inputData.description || '';
  }

  const { sanitizedText, privacyAlert } = sanitizeInput(`${appName} ${packageName} ${description}`);

  const combined = `${appName} ${packageName} ${source} ${description}`.toLowerCase();
  const reasons = [];
  let riskScore = 0;

  // 1. Source risk
  const isDirectApk = combined.includes('.apk') || source.toLowerCase().includes('apk') || source.toLowerCase().includes('telegram') || source.toLowerCase().includes('whatsapp') || source.toLowerCase().includes('sideload') || source.toLowerCase().includes('web download');
  const isOfficialStore = source.toLowerCase().includes('play.google.com') || source.toLowerCase().includes('google play') || source.toLowerCase().includes('apple app store');

  if (isDirectApk && !isOfficialStore) {
    riskScore += 45;
    reasons.push('App was downloaded from a third-party source or direct APK file (sideloading bypasses official security review and automated malware scans).');
  }

  // 2. High-risk permissions for utility or loan apps
  let hasAccessibility = permissions.some(p => p.toLowerCase().includes('accessibility')) || combined.includes('accessibility');
  let hasSmsRead = permissions.some(p => p.toLowerCase().includes('sms')) || combined.includes('read sms');
  let hasScreenOverlay = permissions.some(p => p.toLowerCase().includes('overlay') || p.toLowerCase().includes('alert_window')) || combined.includes('overlay');

  if (hasAccessibility) {
    riskScore += 35;
    reasons.push('Requests Android Accessibility Service: Malicious financial trojans use Accessibility to silently steal screen contents, auto-click permissions, and bypass 2-Factor Authentication.');
  }

  if (hasSmsRead) {
    riskScore += 25;
    reasons.push('Requests permission to read incoming SMS messages: Spyware uses this to intercept bank OTPs and authentication codes without your notice.');
  }

  if (hasScreenOverlay) {
    riskScore += 20;
    reasons.push('Requests "Draw Over Other Apps" / Overlay permission: Banking overlays mimic legitimate login screens to harvest your credentials.');
  }

  // 3. Known scam app patterns
  for (const scamPkg of KNOWN_SCAM_PACKAGES) {
    if (combined.includes(scamPkg.toLowerCase())) {
      riskScore += 60;
      reasons.push(`Matches recognized malicious or impersonation signature: "${scamPkg}".`);
    }
  }

  // 4. Remote support screen-sharing trick
  if (combined.includes('anydesk') || combined.includes('teamviewer') || combined.includes('quicksupport') || combined.includes('rustdesk')) {
    riskScore += 40;
    reasons.push('Remote desktop tools (AnyDesk, QuickSupport) are frequently weaponized by fraudsters posing as bank agents to gain complete remote control of your phone.');
  }

  // 5. Instant micro-loan predatory apps
  if (combined.includes('instant loan') || combined.includes('7 day loan') || combined.includes('credit loan apk')) {
    riskScore += 35;
    reasons.push('High similarity to predatory 7-day microloan harassment apps that harvest contact lists and photos for extortion.');
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'No high-risk app signatures or permission red flags detected.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'Dangerous or impersonating app indicators detected.';
    nextSteps.push('DO NOT install or grant requested permissions (especially Accessibility, SMS, or Screen Sharing).');
    nextSteps.push('If already installed, turn on Airplane mode immediately, uninstall the app via Settings > Apps, and restart your device in Safe Mode if uninstallation is blocked.');
    nextSteps.push('Check your bank accounts from another clean device and reset your banking credentials immediately.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'App source or requested permissions warrant caution.';
    nextSteps.push('Only install apps from the official Google Play Store or Apple App Store.');
    nextSteps.push('Verify the official developer name and review count before installing.');
    nextSteps.push('Never grant SMS or Accessibility permission unless the app is an official accessibility tool from a recognized developer.');
  } else {
    status = 'No obvious warning signs';
    summary = 'Standard app profile without suspicious sideload or privilege-escalation signals.';
    nextSteps.push('Keep Google Play Protect enabled on your device.');
    nextSteps.push('Regularly review and revoke unnecessary permissions in your phone settings.');
  }

  return {
    status,
    confidence: Math.min(95, Math.max(50, 100 - Math.abs(50 - riskScore))),
    riskScore: Math.min(100, riskScore),
    summary,
    reasons: reasons.length ? reasons : ['No dangerous permission overrides or unauthorized sideloading cues identified.', 'No matching malware signature.'],
    nextSteps,
    privacyAlert,
    securityDisclaimer: 'TrustLens conducts static heuristic inspection of metadata and permissions without executing application code.'
  };
}

module.exports = { checkApp };
