# 🛡️ PhishGuard – Phishing Email Analyzer

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-3-000000?logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" />
</p>

> A professional SOC-style cybersecurity dashboard for analyzing phishing emails, detecting malicious indicators, extracting IOCs, and generating threat intelligence reports.

---

## 🚀 Features

- **Email Upload & Analysis** – Upload `.eml` or `.txt` files for deep header analysis
- **Threat Detection Engine** – Detect phishing URLs, spoofed headers, scam keywords, and credential harvesting
- **External API Integration** – VirusTotal, AbuseIPDB, URLScan.io with graceful fallback
- **IOC Extraction** – Extract IPs, domains, URLs, hashes, and email addresses
- **MITRE ATT&CK Mapping** – Map detected techniques to ATT&CK framework
- **Threat Scoring** – Score threats 0–100 with Low/Medium/High/Critical severity
- **PDF Reports** – Generate downloadable security analysis reports
- **SOC Dashboard** – Professional dark theme with neon glassmorphism UI
- **JWT Authentication** – Secure login/register with password hashing
- **Responsive Design** – Works on desktop, tablet, and mobile

---

## 📁 Project Structure

```
phishing-email-analyzer/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── api/                 # Axios instance & API services
│   │   ├── components/
│   │   │   ├── analysis/        # Analysis-specific components
│   │   │   ├── common/          # Reusable UI components
│   │   │   ├── dashboard/       # Dashboard widgets
│   │   │   └── layout/          # Sidebar, TopBar
│   │   ├── context/             # Auth context provider
│   │   ├── pages/               # All page components
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                     # Flask API backend
│   ├── routes/                  # API route blueprints
│   ├── controllers/             # Business logic
│   ├── services/                # Core services (parser, engine, etc.)
│   ├── middleware/               # Auth & rate limiting
│   ├── database/                # MongoDB connection & models
│   ├── utils/                   # Helpers, constants, logger
│   ├── sample_emails/           # Test email files
│   ├── app.py                   # Flask entry point
│   ├── config.py                # Configuration
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **Python** 3.11+
- **MongoDB** (local or Atlas)
- **Git**

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/phishing-email-analyzer.git
cd phishing-email-analyzer
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MONGO_URI=mongodb://localhost:27017/phishguard
JWT_SECRET_KEY=your-super-secret-key-change-this
VIRUSTOTAL_API_KEY=your-virustotal-key
ABUSEIPDB_API_KEY=your-abuseipdb-key
URLSCAN_API_KEY=your-urlscan-key
```

### 4. Start Backend

```bash
python app.py
```

Backend runs at `http://localhost:5000`

### 5. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

This starts frontend, backend, and MongoDB containers.

---

## 🔑 API Keys (Optional)

The app works in **demo mode** without API keys. For real threat intelligence:

| Service | Get Key | Free Tier |
|---------|---------|-----------|
| [VirusTotal](https://www.virustotal.com/gui/join-us) | Sign up → API Key | 4 req/min |
| [AbuseIPDB](https://www.abuseipdb.com/register) | Sign up → API Key | 1000 req/day |
| [URLScan.io](https://urlscan.io/user/signup) | Sign up → API Key | 100 req/day |

---

## 🌐 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`

### Backend → Render

1. Create new Web Service on [Render](https://render.com)
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Add environment variables from `.env`

### Database → MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGO_URI` in backend environment

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/analysis/upload` | Upload & analyze email |
| GET | `/api/analysis/history` | Get analysis history |
| GET | `/api/analysis/<id>` | Get analysis details |
| DELETE | `/api/analysis/<id>` | Delete analysis |
| POST | `/api/threats/check-url` | Check URL reputation |
| POST | `/api/threats/check-ip` | Check IP reputation |
| GET | `/api/threats/iocs` | Get extracted IOCs |
| GET | `/api/threats/stats` | Dashboard statistics |
| GET | `/api/reports` | List reports |
| POST | `/api/reports/generate` | Generate PDF report |
| GET | `/api/reports/<id>/pdf` | Download PDF |

---

## 🧪 Testing

Sample phishing emails are included in `backend/sample_emails/` for testing:

- `phishing_bank.eml` – Fake bank credential phishing
- `phishing_ceo_fraud.eml` – CEO fraud / BEC attempt
- `legitimate_email.eml` – Clean email for comparison

---

## 📄 License

MIT License – Free for personal and educational use.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ for cybersecurity professionals and students
</p>
