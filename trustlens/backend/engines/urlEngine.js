const { sanitizeInput } = require('./sanitizer');
const intelligence = require('../data/intelligence.json');

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.click', '.buzz', '.rest', '.cam', '.live', '.surf',
  '.work', '.loan', '.racing', '.party', '.gq', '.tk', '.ml', '.cf', '.ga'
];

const KNOWN_LEGIT_DOMAINS = [
  'google.com', 'google.co.in', 'amazon.com', 'amazon.in', 'paytm.com',
  'phonepe.com', 'sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com',
  'axisbank.com', 'microsoft.com', 'apple.com', 'netflix.com', 'paypal.com',
  'whatsapp.com', 'telegram.org', 'instagram.com', 'facebook.com', 'youtube.com'
];

const BRAND_KEYWORDS = [
  'paytm', 'amazon', 'sbi', 'hdfc', 'icici', 'axis', 'apple', 'netflix',
  'paypal', 'google', 'whatsapp', 'jio', 'airtel', 'microsoft', 'kyc', 'income-tax'
];

function checkUrl(rawInput) {
  const { sanitizedText, privacyAlert } = sanitizeInput(rawInput);
  const trimmed = sanitizedText.trim();

  if (!trimmed) {
    return {
      status: 'Unable to check',
      confidence: 0,
      summary: 'No link or web address was provided.',
      reasons: ['Please enter a complete URL or domain name (e.g., https://example.com).'],
      nextSteps: ['Check that you copied the complete link without accidental characters.'],
      privacyAlert,
      details: { input: '', protocol: '', domain: '', isSecure: false }
    };
  }

  // Prepend protocol if missing
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch (err) {
    return {
      status: 'Unable to check',
      confidence: 0,
      summary: 'The provided address is not a valid web URL.',
      reasons: ['The string could not be parsed as an internet URL or domain.'],
      nextSteps: ['Verify the website address format. Avoid clicking strange or broken links.'],
      privacyAlert,
      details: { input: rawInput, error: err.message }
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const fullUrl = parsed.href.toLowerCase();

  const reasons = [];
  let riskScore = 0; // 0 to 100

  // 1. IP address host check
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (ipRegex.test(hostname)) {
    riskScore += 65;
    reasons.push('The link uses a raw numerical IP address instead of a registered domain name, which is a frequent phishing tactic.');
  }

  // 2. Suspicious TLD check
  for (const tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      riskScore += 35;
      reasons.push(`The domain uses a high-risk generic top-level domain (${tld}) often associated with low-cost spam and disposable phishing hosts.`);
      break;
    }
  }

  // 3. Known legit domain check
  const isExactLegit = KNOWN_LEGIT_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
  if (isExactLegit) {
    riskScore = Math.max(0, riskScore - 50);
  }

  // 4. Typosquatting / Brand impersonation in domain
  for (const brand of BRAND_KEYWORDS) {
    // If brand is mentioned in hostname but it's not the official domain
    if (hostname.includes(brand)) {
      const isOfficialBrand = KNOWN_LEGIT_DOMAINS.some(d => (hostname === d || hostname.endsWith('.' + d)) && d.includes(brand));
      if (!isOfficialBrand) {
        riskScore += 55;
        reasons.push(`The web address appears to impersonate "${brand.toUpperCase()}", but is not hosted on an official domain for that service.`);
      }
    }
  }

  // 5. Deceptive keywords in subdomain or path
  const suspiciousKeywords = ['login', 'verify', 'update-kyc', 'pan-link', 'refund', 'secure', 'signin', 'banking', 'free-gift', 'claim'];
  for (const kw of suspiciousKeywords) {
    if (pathname.includes(kw) || hostname.includes(kw)) {
      if (!isExactLegit) {
        riskScore += 20;
        reasons.push(`Found sensitive credential keyword "${kw}" in the address path or subdomain.`);
        break;
      }
    }
  }

  // 6. Excessive subdomains or hyphens
  const dotCount = (hostname.match(/\./g) || []).length;
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (dotCount >= 4) {
    riskScore += 25;
    reasons.push('Abnormally deep subdomain nesting detected, often used to conceal real server destinations.');
  }
  if (hyphenCount >= 3) {
    riskScore += 20;
    reasons.push('Multiple hyphens in domain name (common in deceptive typo-squatting schemes).');
  }

  // 7. Non-HTTPS warning on interactive inputs
  if (parsed.protocol === 'http:') {
    riskScore += 15;
    reasons.push('Unencrypted HTTP protocol detected. Legitimate modern banks and services require secure HTTPS.');
  }

  // 8. URL shorteners
  const SHORTENERS = ['bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'goo.gl', 'cutt.ly', 'rb.gy'];
  if (SHORTENERS.includes(hostname)) {
    riskScore += 30;
    reasons.push(`Uses URL shortening service (${hostname}) to conceal the real destination address.`);
  }

  // Determine state
  let status = 'No obvious warning signs';
  let summary = 'No obvious warning signs detected based on domain structure and pattern heuristics.';
  const nextSteps = [];

  if (riskScore >= 50) {
    status = 'Suspicious';
    summary = 'Strong indicators of a deceptive, phishing, or impersonation website.';
    nextSteps.push('DO NOT enter your password, PIN, OTP, or personal identity details on this website.');
    nextSteps.push('Do not download files or APK installers prompted by this page.');
    nextSteps.push('If this claimed to be your bank or service, navigate to the official website by typing the address yourself or using their verified mobile app.');
  } else if (riskScore >= 25) {
    status = 'Use caution';
    summary = 'Some irregular or ambiguous signals were found. Proceed with heightened scrutiny.';
    nextSteps.push('Confirm the sender who shared this link before interacting with it.');
    nextSteps.push('Look closely at the browser address bar to verify the exact domain spelling.');
    nextSteps.push('Never enter banking PINs or OTPs on unverified sites.');
  } else {
    status = 'No obvious warning signs';
    summary = 'No immediate warning signs found in the link syntax or domain reputation profile.';
    nextSteps.push('Even with a clean result, remember that attackers can compromise genuine sites or use lookalike redirect chains.');
    nextSteps.push('Always confirm you are on the verified website before signing in.');
  }

  return {
    status,
    confidence: Math.min(95, Math.max(45, 100 - Math.abs(50 - riskScore))),
    riskScore: Math.min(100, riskScore),
    summary,
    reasons: reasons.length ? reasons : ['Domain structure conforms to standard web naming patterns.', 'No recognized brand-squatting keywords or suspicious TLDs matched.'],
    nextSteps,
    privacyAlert,
    securityDisclaimer: 'TrustLens analyzed the link without visiting, executing, or connecting to the remote server.',
    details: {
      submittedInput: trimmed,
      parsedDomain: hostname,
      protocol: parsed.protocol,
      hasSsl: parsed.protocol === 'https:',
      path: parsed.pathname
    }
  };
}

module.exports = { checkUrl };
