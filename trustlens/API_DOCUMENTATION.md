# TrustLens REST API Documentation

TrustLens provides a modular, privacy-preserving HTTP API for evaluating suspicious digital interactions across **7 scam threat vectors**.

---

## 1. Design Principles & Standardized States

Every check endpoint returns a predictable JSON response structure with one of **four standard human-readable states**:

| State | Color Code | Interpretation |
| :--- | :--- | :--- |
| **`Suspicious`** | 🔴 Red | High-confidence fraud, phishing, trojan, or coercive extortion markers detected. |
| **`Use caution`** | 🟡 Amber | Ambiguous indicators, unverified brand claims, or high-risk channel cues found. |
| **`No obvious warning signs`** | 🟢 Green | No overt fraud patterns identified based on heuristic models. *(Does not guarantee 100% safety).* |
| **`Unable to check`** | ⚪ Slate | Insufficient data, invalid formatting, or consent refused. |

### Standard Response Schema
```json
{
  "status": "Suspicious" | "Use caution" | "No obvious warning signs" | "Unable to check",
  "confidence": 88,
  "riskScore": 75,
  "summary": "Plain English verdict suitable for non-technical users.",
  "reasons": [
    "Specific warning indicator 1",
    "Specific warning indicator 2"
  ],
  "nextSteps": [
    "Practical safety instruction 1 (e.g. Open official app independently)",
    "Practical safety instruction 2 (e.g. Call 1930 Cyber Crime Helpline)"
  ],
  "privacyAlert": "Notified when credit card numbers, OTPs, or passwords were auto-redacted.",
  "securityDisclaimer": "TrustLens analyzed the interaction heuristically without executing external code."
}
```

---

## 2. API Endpoints

### 2.1 Universal Auto-Detector
**`POST /api/check/auto`**  
Automatically identifies the input format (URL, UPI VPA, QR intent, Phone number, or Message text) and routes it to the corresponding engine.

#### Request Body
```json
{
  "input": "https://sbi-kyc-verification.top/login"
}
```

---

### 2.2 Phishing & Malicious Links
**`POST /api/check/url`**  
Evaluates typosquatting, brand impersonation, suspicious TLDs (`.top`, `.xyz`), raw IP hosting, URL shorteners, and deceptive subdomains **without fetching or executing the link**.

#### Request Body
```json
{
  "url": "http://paytm-reward-cashback99.xyz/win"
}
```

---

### 2.3 Fake or Impersonating Apps
**`POST /api/check/app`**  
Audits third-party sideload APK sources, fake banking updates, and dangerous privilege escalation permissions (`BIND_ACCESSIBILITY_SERVICE`, `READ_SMS`, `SYSTEM_ALERT_WINDOW`).

#### Request Body
```json
{
  "appName": "WhatsApp Pink Edition",
  "packageName": "org.whatsapp.pink",
  "source": "Telegram group forwarded APK",
  "permissions": [
    "android.permission.BIND_ACCESSIBILITY_SERVICE",
    "android.permission.READ_SMS"
  ],
  "description": "Promises new UI color theme."
}
```

---

### 2.4 Malicious QR Code Destinations
**`POST /api/check/qr`**  
Evaluates raw decoded QR payloads, checking for reverse UPI debit tricks (`upi://pay`), rogue Wi-Fi configurations (`WIFI:`), and intent triggers.

#### Request Body
```json
{
  "payload": "upi://pay?pa=refund-helpdesk@okhdfcbank&pn=Paytm+Refund+Desk&am=4999&cu=INR"
}
```

---

### 2.5 AI-Cloned Voice Messages & Extortion
**`POST /api/check/voice`**  
Detects synthetic emergency extortion ("bail money", "kidnapped relative") and acoustic anomalies.  
*Requires explicit `consentGranted: true`.*

#### Request Body
```json
{
  "consentGranted": true,
  "description": "Mom please don't tell dad! I had a bad car accident and police need ₹35,000 for bail immediately.",
  "acousticAnomalies": {
    "unnaturalCadence": true,
    "flatTone": true,
    "lackOfBreathing": true,
    "audioGlitch": true,
    "backgroundMismatch": true
  }
}
```

---

### 2.6 Fake Payment Requests & UPI Scams
**`POST /api/check/payment`**  
Inspects UPI VPAs, fake customer care handles, and checks against the fundamental rule: **"Entering your UPI PIN always debits money; you never enter a PIN to receive."**

#### Request Body
```json
{
  "vpa": "paytm-refund-team@ybl",
  "amount": "3500",
  "remark": "Paytm Cashback Refund - Enter PIN to claim",
  "context": "Customer support on Google told me to accept this collect request to get my refund."
}
```

---

### 2.7 Impersonation & Scam Calls
**`POST /api/check/call`**  
Detects "Digital Arrest" coercion, fake CBI/Police/Customs narcotics seizures, and psychological isolation scripts.

#### Request Body
```json
{
  "callerNumber": "+92-300-1234567",
  "claimedCaller": "Inspector Vijay from CBI Cyber Cell",
  "conversationSummary": "Illegal FedEx parcel with drugs intercepted at Mumbai airport. You are placed under Digital Arrest; stay on video call in a locked room."
}
```

---

### 2.8 Scam SMS & Chat Messages
**`POST /api/check/message`**  
Evaluates text against 50,000+ extracted linguistic manipulation tokens (`Fake.csv`), late-night communication anomalies (`Whatsapp_chat.csv`), and smishing shortlinks.

#### Request Body
```json
{
  "sender": "+91-98123-45678",
  "text": "Dear SBI customer, your YONO Netbanking account has been suspended today due to pending PAN KYC. Update immediately at http://sbi-pan-kyc.xyz/update",
  "hour": 2
}
```

---

### 2.9 Intelligence & Benchmark Data
**`GET /api/intelligence`**  
Returns the empirical dataset insights extracted from `Fake.csv`, `True.csv`, `paytm_ir - Sheet2.csv`, `amazon.csv`, and `Whatsapp_chat.csv`.

---

### 2.10 Demo Scenarios
**`GET /api/demos`**  
Returns pre-configured 1-click test scenarios (both scams and safe interactions) for all 7 categories.

---

### 2.11 External Adapter Status
**`GET /api/adapters`**  
Reports the configuration status of pluggable production adapters (Google Safe Browsing, VirusTotal, Google Play Integrity, NPCI UPI, Deepfake Detector).

---

### 2.12 System Health
**`GET /api/health`**  
Returns service status, product version, and timestamp.
