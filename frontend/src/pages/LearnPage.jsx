import React from 'react';
import { 
  Shield, 
  Mail, 
  Target, 
  MessageSquare, 
  PhoneCall, 
  QrCode, 
  Copy,
  AlertOctagon,
  CheckCircle,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const phishingTypes = [
  {
    title: "Email Phishing",
    icon: Mail,
    color: "text-red-400",
    desc: "Mass emails impersonating SBI, HDFC, IRCTC, or PayTM. Urgent subject lines like 'Your account will be suspended.' Links go to fake login pages."
  },
  {
    title: "Spear Phishing",
    icon: Target,
    color: "text-orange-400",
    desc: "Targeted attacks using your name, employer, or account details to appear legitimate. Common against company employees and executives."
  },
  {
    title: "Smishing (SMS)",
    icon: MessageSquare,
    color: "text-blue-400",
    desc: "\"Your KYC is pending — update within 24 hours.\" or \"Your parcel is held.\" SMS with short links redirecting to fake banking portals."
  },
  {
    title: "Vishing (Voice)",
    icon: PhoneCall,
    color: "text-green-400",
    desc: "Callers posing as bank officials, TRAI, or CBI agents. They create urgency (\"your SIM will be blocked\") and extract OTPs verbally."
  },
  {
    title: "QRishing",
    icon: QrCode,
    color: "text-yellow-400",
    desc: "Fake QR codes placed on payment points or sent via WhatsApp claiming to be UPI refunds, cashback, or lottery prizes. Redirect to phishing pages."
  },
  {
    title: "Clone Phishing",
    icon: Copy,
    color: "text-purple-400",
    desc: "A legitimate email you received is duplicated with a malicious link replacing the original. Appears to come from the same sender you already trust."
  }
];

const redFlags = [
  { text: "Domain mismatch: sbi-netbanking-alert.com instead of onlinesbi.sbi. The real brand name is buried or misspelled." },
  { text: "Urgent language: \"Your account will be blocked in 2 hours.\" Legitimate banks never create this kind of artificial urgency." },
  { text: "Brand-new domain: Sites registered less than 30 days ago are extremely high risk. PhishGuard flags these automatically." },
  { text: "HTTP (no padlock): Any banking or payment page without HTTPS is immediately suspicious — never enter credentials." },
  { text: "Asks for OTP by phone/chat: No legitimate bank, PhonePe, or Paytm representative will ever ask you for your OTP." },
  { text: "Shortened URLs: bit.ly, tinyurl links hide the real destination. Always expand and verify before clicking." },
  { text: "Generic greeting: \"Dear Customer\" instead of your name suggests mass-sent phishing email." },
  { text: "Unexpected attachment: PDF or ZIP files in unsolicited emails — especially from \"banks\" or \"courier services\" — often contain malware." }
];

const commonScams = [
  {
    title: "UPI/PhonePe/Google Pay Scams",
    desc: "Fake payment requests disguised as \"collect\" (you pay, not receive). Fake cashback QR codes. Always verify who is requesting money."
  },
  {
    title: "KYC Update Fraud",
    desc: "SMS/WhatsApp claiming your Aadhaar-linked SIM or bank account KYC is expired. Link leads to fake UIDAI or bank portal harvesting PAN and Aadhaar."
  },
  {
    title: "Parcel Delivery Scams",
    desc: "Fake India Post or FedEx SMS claiming your parcel is held — pay a small fee to release. The payment page captures card details."
  },
  {
    title: "Job Offer Scams",
    desc: "WhatsApp messages offering part-time work (₹3000/day for liking YouTube videos). Victims pay registration fees and then lose access."
  },
  {
    title: "PM Kisan / Government Scheme Fraud",
    desc: "Fake government portals for PM-KISAN, PMAY, MNREGA claiming your linked account needs verification. Harvests bank account details."
  }
];

const bestPractices = [
  {
    title: "Scan before you click",
    desc: "Paste any suspicious link into PhishGuard before opening. Takes 3 seconds and could save your account."
  },
  {
    title: "Enable 2FA on every account",
    desc: "Even if a hacker has your password, 2FA stops them from logging in. Use Google Authenticator or SMS 2FA on all banking apps."
  },
  {
    title: "Never share OTP — ever",
    desc: "No bank, TRAI, CBI, or government official will ever call and ask for your OTP, PIN, or CVV. Hang up immediately."
  },
  {
    title: "Check the full URL before logging in",
    desc: "Hover over links (desktop) or long-press (mobile) to see the actual URL. onlinesbi.sbi ≠ sbi-onlinebanking.com."
  },
  {
    title: "Report to Cyber Crime",
    desc: "Call 1930 (National Cyber Crime Helpline) or file at cybercrime.gov.in. Report phishing emails to report@phishing.gov.in."
  }
];

const LearnPage = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-12">
      
      {/* Hero Section */}
      <div className="text-center py-10">
        <p className="text-cyber-cyan font-mono text-sm tracking-widest uppercase mb-4">Educational Resources</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Don't get <span className="text-cyber-neon italic font-light">trapped.</span><br />
          Know the signs.
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          A comprehensive guide to identifying, avoiding, and reporting phishing attacks targeting Indian internet users — WhatsApp scams, UPI fraud, fake bank portals, and more.
        </p>
      </div>

      {/* What is Phishing Card */}
      <GlassCard className="p-8 border-l-4 border-l-cyber-neon">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <BookOpen className="text-cyber-cyan" />
          What is Phishing?
        </h2>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            Phishing is a cyberattack where criminals impersonate trusted organizations — your bank, government, or delivery company — to steal your login credentials, OTPs, card numbers, or Aadhaar details. In India, phishing is the #1 vector for UPI fraud, bank account takeovers, and identity theft.
          </p>
          <p>
            Unlike traditional hacking, phishing doesn't break your passwords — it tricks <span className="italic text-white">you</span> into handing them over voluntarily, believing you're on a legitimate site.
          </p>
        </div>
      </GlassCard>

      {/* Types of Phishing Attacks */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Types of Phishing Attacks</h2>
        <p className="text-gray-400 mb-6">Six attack patterns that Indian users face most frequently.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phishingTypes.map((type, idx) => (
            <GlassCard key={idx} className="hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-10 h-10 rounded-lg bg-cyber-900/80 border border-white/5 flex items-center justify-center mb-4 ${type.color}`}>
                <type.icon size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{type.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{type.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* 8 Red Flags */}
      <GlassCard>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertOctagon className="text-red-500" />
          8 Red Flags to Spot Immediately
        </h2>
        <div className="space-y-3">
          {redFlags.map((flag, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
              <AlertOctagon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm leading-relaxed">{flag.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Common Scams in India */}
      <GlassCard>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" />
          Common Scams in India (2026)
        </h2>
        <div className="divide-y divide-white/10">
          {commonScams.map((scam, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                {scam.title}
              </h3>
              <p className="text-sm text-gray-400 ml-3.5 leading-relaxed">{scam.desc}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Safety Best Practices */}
      <GlassCard>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="text-green-500" />
          Safety Best Practices
        </h2>
        <div className="space-y-3">
          {bestPractices.map((practice, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-medium mb-1">{practice.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{practice.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};

export default LearnPage;
