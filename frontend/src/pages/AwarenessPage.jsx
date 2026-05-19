import React, { useState } from 'react';
import { Shield, HelpCircle, AlertTriangle, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const quizQuestions = [
  {
    id: 1,
    question: "You receive an SMS saying: 'Dear Customer, your SBI account will be blocked today. Click here to update KYC: http://sbi-kyc-update.com'. What should you do?",
    options: [
      "Click the link and update KYC immediately to avoid blocking.",
      "Ignore it. Banks never ask for KYC updates via SMS links.",
      "Forward the message to all your contacts to warn them."
    ],
    correct: 1,
    explanation: "Banks never send SMS with links for KYC updates. Always visit the official branch or use the official banking app."
  },
  {
    id: 2,
    question: "You are trying to sell an item on OLX. A buyer agrees to your price and sends a QR code, asking you to scan it and enter your UPI PIN to 'receive' the money. Is this safe?",
    options: [
      "Yes, scanning QR codes is the standard way to receive money on OLX.",
      "No! You only enter your UPI PIN when you want to SEND money, never to receive.",
      "Yes, but only if the amount is less than ₹10,000."
    ],
    correct: 1,
    explanation: "This is a classic UPI scam. You NEVER need to enter your UPI PIN to receive money. Entering it will deduct money from your account."
  },
  {
    id: 3,
    question: "An email from 'IT Support' asks you to reset your company password because of a 'security breach'. The email address is 'it-support@company-admin-portal.com'. Your company is just 'company.com'. Is this legitimate?",
    options: [
      "Yes, IT departments often use separate domains for admin portals.",
      "No, this is likely a domain spoofing attempt. Always verify the exact domain name.",
      "Yes, because it mentions a 'security breach' and you should act fast."
    ],
    correct: 1,
    explanation: "Scammers use domains that look similar to the real one (Domain Spoofing). Always verify the exact sender address."
  }
];

const AwarenessPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz finished
      setCurrentQuestion(quizQuestions.length);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
          <BookOpen className="text-cyber-cyan" />
          Phishing Awareness Hub
        </h1>
        <p className="text-gray-400 text-sm mt-1">Learn to spot scams and protect yourself from social engineering.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quiz */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-t-2 border-t-cyber-neon">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="text-cyber-neon flex-shrink-0" />
                Interactive Scam Quiz
              </h2>
              {currentQuestion < quizQuestions.length && (
                <span className="text-xs sm:text-sm font-mono text-gray-400 self-start sm:self-auto bg-cyber-900/60 px-2.5 py-1 rounded border border-white/5">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
              )}
            </div>

            {currentQuestion < quizQuestions.length ? (
              <div className="space-y-6">
                <p className="text-sm sm:text-base md:text-lg text-white font-medium bg-cyber-900/50 p-3 sm:p-4 rounded border border-white/5 leading-relaxed">
                  {quizQuestions[currentQuestion].question}
                </p>

                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !showResult && handleAnswer(idx)}
                      disabled={showResult}
                      className={`w-full text-left p-3 sm:p-4 rounded border text-sm sm:text-base transition-all ${
                        showResult
                          ? idx === quizQuestions[currentQuestion].correct
                            ? 'bg-green-500/20 border-green-500/50 text-green-100'
                            : idx === selectedAnswer
                              ? 'bg-red-500/20 border-red-500/50 text-red-100'
                              : 'bg-cyber-800/40 border-white/5 text-gray-400 opacity-50'
                          : 'bg-cyber-800/40 border-white/10 text-gray-300 hover:bg-cyber-800 hover:border-cyber-cyan/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="leading-snug">{option}</span>
                        {showResult && idx === quizQuestions[currentQuestion].correct && <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />}
                        {showResult && idx === selectedAnswer && idx !== quizQuestions[currentQuestion].correct && <XCircle className="text-red-500 w-5 h-5 flex-shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 mt-6 p-4 rounded bg-cyber-900 border border-white/10">
                    <p className="text-sm text-gray-300">
                      <span className="font-bold text-cyber-neon mr-2">Explanation:</span>
                      {quizQuestions[currentQuestion].explanation}
                    </p>
                    <button onClick={nextQuestion} className="mt-4 btn-primary w-full text-center justify-center">
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className={`w-16 h-16 mx-auto mb-4 ${score === quizQuestions.length ? 'text-cyber-neon' : 'text-yellow-500'}`} />
                <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
                <p className="text-gray-400 mb-6">You scored {score} out of {quizQuestions.length}</p>
                <button onClick={restartQuiz} className="btn-primary">Take Quiz Again</button>
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-bold text-white mb-4">Anatomy of a Phishing Email</h2>
            <div className="bg-cyber-900 border border-white/5 p-4 rounded space-y-4 font-mono text-sm">
              <div className="p-3 border border-red-500/30 bg-red-500/10 rounded">
                <span className="text-red-400 font-bold block mb-1">1. The Sender Address</span>
                <span className="text-gray-400">Looks like: support@paypal.com</span><br/>
                <span className="text-white">Actually is: support@paypa1-update-security.com</span>
              </div>
              <div className="p-3 border border-yellow-500/30 bg-yellow-500/10 rounded">
                <span className="text-yellow-400 font-bold block mb-1">2. Sense of Urgency</span>
                <span className="text-gray-300">"Your account will be suspended in 24 hours if you do not verify..."</span>
              </div>
              <div className="p-3 border border-orange-500/30 bg-orange-500/10 rounded">
                <span className="text-orange-400 font-bold block mb-1">3. Malicious Link</span>
                <span className="text-gray-300 text-xs break-all">http://www.secure-login-verification-8f9d.com/login.php</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Alerts & Helplines */}
        <div className="space-y-6">
          <GlassCard className="border-t-2 border-t-red-500">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              Active Scams in India
            </h2>
            <ul className="space-y-4">
              <li className="p-3 bg-cyber-900 rounded border border-white/5">
                <strong className="text-red-400 block mb-1 text-sm">Fake IRCTC Apps</strong>
                <p className="text-xs text-gray-400">Scammers send WhatsApp APK files claiming to be IRCTC ticket booking apps. Installing them grants remote access to your phone.</p>
              </li>
              <li className="p-3 bg-cyber-900 rounded border border-white/5">
                <strong className="text-red-400 block mb-1 text-sm">Electricity Bill Scam</strong>
                <p className="text-xs text-gray-400">SMS warning that electricity will be cut off tonight unless a payment is made to a specific phone number immediately.</p>
              </li>
              <li className="p-3 bg-cyber-900 rounded border border-white/5">
                <strong className="text-red-400 block mb-1 text-sm">Customs Duty Fraud</strong>
                <p className="text-xs text-gray-400">Calls claiming a "parcel" has been held at customs in your name, demanding payment or threatening arrest.</p>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="bg-cyber-900/80">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              National Helplines
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded border border-white/5">
                <span className="text-gray-300 text-sm">Cyber Crime Helpline</span>
                <span className="font-mono font-bold text-cyber-neon text-lg">1930</span>
              </div>
              <div className="flex flex-col p-3 bg-black/30 rounded border border-white/5">
                <span className="text-gray-300 text-sm mb-1">National Cyber Crime Portal</span>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="font-mono text-cyber-cyan text-sm hover:underline">
                  cybercrime.gov.in
                </a>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic text-center">
                If you suspect you've been scammed, immediately block your cards and call 1930.
              </p>
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default AwarenessPage;
