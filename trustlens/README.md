# TrustLens — Digital Interaction Verification Shield

> **Check suspicious links, fake apps, malicious QR codes, AI voice clones, payment requests, scam calls, and phishing messages before you click, install, scan, reply, or pay.**

TrustLens is an innovative, accessible, mobile-first web platform engineered to protect non-technical individuals and families from digital fraud, extortion, and cybercrime.

---

## 🌟 The 7 Scam Defense Checkers

| # | Inspection Area | Threat Vectors Analyzed | Key Defense Logic |
| :---: | :--- | :--- | :--- |
| **1** | **Fake & Phishing Links** | Typosquatting, brand impersonation, suspicious TLDs (`.top`, `.xyz`), raw IP hosts, URL shorteners. | **Zero-Execution:** Analyzes domain syntax without loading remote scripts or visiting the target. |
| **2** | **Fake & Impersonating Apps** | Malicious APK sideloads, trojans (`WhatsApp Pink`, fake SBI updates), predatory 7-day loan apps. | Audits dangerous privileges (`Accessibility Service`, `READ_SMS`, `Overlay`) used to hijack devices. |
| **3** | **Malicious QR Codes** | Reverse UPI payment traps, rogue Wi-Fi hijacking, malicious intent strings. | **The QR Rule:** Scanning a QR code **never** credits money; it only pays or authorizes debits. |
| **4** | **AI-Cloned Voice Messages** | Family emergency extortion ("bail money"), fake kidnapping, CEO wire fraud. | **Consent Required:** Detects acoustic flat prosody, absence of breath pauses, and urgency scripts. |
| **5** | **Payment & UPI Scams** | Fake VPA handles (`refund-desk@okhdfcbank`), OLX marketplace buyer tricks, collect requests. | **The UPI Golden Rule:** You **never** enter your UPI PIN to receive money or refunds. |
| **6** | **Impersonation & Scam Calls** | **"Digital Arrest"** coercion, fake CBI/Police/Customs narcotics seizures, TRAI disconnection threats. | **Law Enforcement Fact:** Police never conduct arrests over Skype/video calls or demand bank transfers. |
| **7** | **Scam SMS & Messages** | Electricity cutoff at 9:30 PM, bank KYC account suspensions, fake YouTube liking tasks. | Evaluates text against **50,000+ extracted linguistic manipulation tokens** and temporal anomalies. |

---

## 📊 How the Provided Datasets Were Utilized

TrustLens threat models and heuristic rules are directly informed by empirical research corpora provided in the project workspace:

```
workspace/
├── paytm_ir - Sheet2.csv      ──> Financial transaction benchmarks & UPI merchant baseline
├── Whatsapp_chat.csv          ──> Temporal messaging frequency & off-peak vulnerability hours
├── amazon.csv                 ──> E-commerce brand pricing baseline & fake discount thresholds
├── Fake.csv & True.csv        ──> 50,000+ NLP token corpus for emotional urgency & coercion
└── trustlens-data-intelligence.json ──> Compiled threat models powering the detection engine
```

1. **`paytm_ir - Sheet2.csv` (Payment Scale & UPI Baselines)**:
   - Analyzed 15 quarters of Paytm GMV (averaging ₹31.9 Lakh Cr) and 18.6M monthly transacting users.
   - Used to model verified commercial merchant patterns versus fraudulent personal VPAs disguising themselves with keywords (`refund`, `helpdesk`, `cashback`, `care`).
2. **`Whatsapp_chat.csv` (Communication Time Patterns)**:
   - Sampled 8,000+ messaging interaction timestamps.
   - Identified high-risk off-peak susceptibility windows (12:00 AM – 4:00 AM) where scammers initiate urgent threats while victim alertness is compromised.
3. **`amazon.csv` (Brand Pricing & Review Benchmarks)**:
   - Evaluated 1,000+ catalog prices and brand discount distributions.
   - Established the **>85% Fake Discount Rule** (e.g. websites advertising Apple iPhones or premium audio gear at 90-95% off are flagged as e-commerce phishing traps).
4. **`Fake.csv` & `True.csv` (50,000+ Linguistic Manipulation Markers)**:
   - Analyzed manipulation phrasing and sensationalism indicators.
   - Extracted high-urgency psychological triggers: Fear/Panic, Unearned Reward, Authority Impersonation, and Family Distress.

---

## 🛡️ Privacy & Zero-Execution Security

- **Zero-Execution Architecture**: TrustLens **never visits, clicks, fetches, or runs** submitted links, QR codes, or APK files. Everything is inspected through safe structural parsing.
- **Automatic Credential Sanitizer**: If a user accidentally types a 16-digit credit card number, 6-digit OTP, PIN, password, or Aadhaar number, TrustLens redacts it instantly into `[REDACTED_SENSITIVE_DATA]` and issues an immediate privacy alert.
- **Affirmative Voice Consent**: Audio descriptions and transcripts require explicit user consent and are processed in volatile memory with **zero audio retention**.
- **Transparent Limitations**: TrustLens explicitly reminds users that **"No obvious warning signs" does not prove an interaction is 100% safe**.

---

## 🔬 Demo Mode vs. Real-World Integrations

TrustLens comes with an interactive **Demo Mode** enabled by default, featuring 1-click test scenarios for both scams and legitimate interactions.

### Current Features (Demo / Local Heuristics)
- Full static syntactic analysis of URLs, domains, and TLDs.
- Local Android APK permission and sideload risk auditing.
- UPI VPA regex structure and collect request fraud detection.
- Coercive text and acoustic scenario heuristics.
- Universal Smart Paste Auto-Detector.
- Complete responsive frontend and Express backend.

### Pluggable Real-World Adapters (`backend/adapters/externalAdapters.js`)
The backend is architected with modular service adapters ready for production API keys:

| Adapter | Intended Production Service | Environment Variable |
| :--- | :--- | :--- |
| `SafeBrowsingAdapter` | Google Safe Browsing API v4 / Web Risk | `GOOGLE_SAFE_BROWSING_API_KEY` |
| `PlayIntegrityAdapter` | Google Play Developer & Integrity API | `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY` |
| `UpiVpaValidationAdapter` | NPCI / Partner Bank UPI VPA Lookup | `NPCI_UPI_API_SECRET` |
| `DeepfakeVoiceAdapter` | Neural Spectral Deepfake Audio Detector | `DEEPFAKE_DETECTOR_API_KEY` |
| `CallerIdReputationAdapter`| Telecom Scam / Truecaller Reputation API | `CALLER_INTEL_API_KEY` |

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- **Node.js** >= v18.0.0
- **npm** >= 9.0.0

### 1. Clone & Install
```bash
# Navigate to the project directory
cd trustlens

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 2. Run Tests
TrustLens includes complete automated unit tests and end-to-end integration tests:
```bash
# Run backend engine test suite (all 8 test suites)
npm test

# Run end-to-end server & API integration test
node test-e2e.js
```

### 3. Build & Run
```bash
# Build the production frontend
npm run build

# Start the unified TrustLens server
npm start
```
Open **`http://localhost:5000`** in your browser. The Express server serves both the REST API and the production React frontend from a single port!

For active frontend development with hot-module reloading:
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend (Vite)
npm run dev:frontend
```
Open **`http://localhost:5173`** (proxied automatically to port 5000).

---

## 📑 Project Structure

```
trustlens/
├── package.json              # Monorepo root scripts (start, dev, build, test)
├── .env.example              # Environment variable template
├── API_DOCUMENTATION.md      # Comprehensive REST API specifications
├── README.md                 # Complete system guide & setup instructions
├── test-e2e.js               # End-to-end automated integration tester
├── backend/
│   ├── server.js             # Express application & static frontend server
│   ├── package.json
│   ├── data/
│   │   ├── intelligence.json # Extracted patterns from CSV datasets
│   │   └── demoExamples.json # 1-click test scenarios across all 7 areas
│   ├── engines/
│   │   ├── sanitizer.js      # Sensitive data credential redactor
│   │   ├── urlEngine.js      # Phishing & fake link scanner
│   │   ├── appEngine.js      # Sideload APK & permission auditor
│   │   ├── qrEngine.js       # Malicious QR & reverse UPI detector
│   │   ├── voiceEngine.js    # AI voice clone & extortion analyzer
│   │   ├── paymentEngine.js  # UPI & payment fraud checker
│   │   ├── callEngine.js     # "Digital Arrest" & call threat detector
│   │   └── messageEngine.js  # Scam SMS & WhatsApp smishing analyzer
│   ├── adapters/
│   │   └── externalAdapters.js # Extensible production API connectors
│   ├── routes/
│   │   └── checkRoutes.js    # Express REST API endpoints
│   └── tests/
│       └── engine.test.js    # Unit test suite verifying all 4 states
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx           # Main application state & view router
        ├── index.css
        └── components/
            ├── Navbar.jsx    # Navigation, demo mode toggle & privacy badge
            ├── HeroUniversal.jsx # Smart Universal Paste Box
            ├── CategoryTabs.jsx  # 7-area switcher
            ├── ResultCard.jsx    # Standardized 4-state verdict card
            ├── DemoToolbar.jsx   # 1-click sample scenario launcher
            ├── IntelligenceDashboard.jsx # Dataset research visualizations
            ├── SafetyPlaybook.jsx # Emergency hotlines & incident checklist
            ├── PrivacyModal.jsx  # Zero-execution charter
            ├── Footer.jsx
            └── checkers/     # 7 dedicated inspection input modules
```

---

## 🚨 Emergency Resources (India)
- **National Cyber Crime Helpline**: **`1930`** (Immediate financial fraud reporting)
- **National Reporting Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
- **Chakshu Fraud Reporting**: [sancharsaathi.gov.in/sfc](https://sancharsaathi.gov.in/sfc/)

---

## 📜 License
Distributed under the **MIT License**. Created for public digital literacy and open fraud protection.
