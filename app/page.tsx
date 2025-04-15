'use client';
import React, { useState } from 'react';
import IdentityModal from './components/identitymodal';

const LandingPage = () => {
  const [showHint, setShowHint] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGetStarted = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center text-white font-mono relative overflow-hidden">
      
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
    

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        <h1 className="text-6xl font-bold mb-4 text-yellow-300 tracking-wider"
            style={{ textShadow: '0 0 10px #FFD700, 0 0 20px #FFD700' }}>
          MYSTERY NIGHT
        </h1>

        <p className="text-lg mb-6 text-yellow-100 uppercase tracking-widest">
          THE THEME REVEALING BEGINS...
        </p>
        
        <h2 className="text-2xl mb-8 text-yellow-200 italic">
          The Farewell Event You Won't Forget
        </h2>

        <div className="bg-black bg-opacity-80 p-8 rounded-xl border-2 border-yellow-600 mb-8 max-w-2xl backdrop-blur-sm">
          <p className="text-xl mb-6">
            You're cordially invited to an exclusive night of mystery, chance, and excitement. 
            Dress sharp and bring your wits — fortune favors the bold.
          </p>
          
          <p className="text-lg mb-6">
            Will you take the risk? Can you beat the odds? There's only one way to find out...
          </p>
          
          <div className="flex flex-col items-center">
            <button
              onClick={handleGetStarted}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 relative overflow-hidden shadow-lg cursor-pointer"
            >
              GET STARTED
              <span className="absolute inset-0 overflow-hidden">
                <span className="w-1/4 h-full absolute top-0 -left-full bg-white opacity-30 transform rotate-12 transition-all duration-1000 animate-shine"></span>
              </span>
            </button>

            <button 
              className="mt-8 text-yellow-400 hover:text-yellow-300 underline text-sm cursor-pointer"
              onClick={() => setShowHint(!showHint)}
            >
              Need a hint?
            </button>

            {showHint && (
              <div className="mt-4 p-3 bg-black bg-opacity-80 rounded border border-yellow-600 text-yellow-300 max-w-md animate-fadeIn">
                <p>"When the night stretches too long and minds start to wander, the truth slips out — softly, unexpectedly."</p>
              </div>
            )}
          </div>
        </div>

        {/* Mystery icons */}
        <div className="flex justify-center gap-12 mt-6 text-yellow-500">
          <div className="text-5xl animate-pulse" style={{ animationDelay: '0s' }}>🎲</div>
          <div className="text-5xl animate-pulse" style={{ animationDelay: '0.5s' }}>🎯</div>
          <div className="text-5xl animate-pulse" style={{ animationDelay: '1s' }}>💰</div>
          <div className="text-5xl animate-pulse" style={{ animationDelay: '1.5s' }}>✨</div>
        </div>
      </div>

      {showModal && (
        <IdentityModal 
          onClose={() => setShowModal(false)}
        />
      )}

      <style jsx global>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float-card {
          0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg)); }
        }
        
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }

        .animate-shine {
          animation: shine 3s infinite linear;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
export default LandingPage;