'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import Image from 'next/image';
import CollectionModal from './modal';

interface ClueComponentProps {
  playerName: string;
  playerAvatar: string;
  userId: string;
  onComplete: () => void;
}

export default function ClueComponent({ playerName, playerAvatar, userId, onComplete }: ClueComponentProps) {
  const [clueUrl, setClueUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchClue = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('clue')
          .eq('id', userId)
          .single();

        if (error) throw error;
        if (data) setClueUrl(data.clue);
      } catch (err) {
        console.error('Error fetching clue:', err);
        setError('Failed to fetch your clue. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClue();
  }, [userId]);

  const handlePasswordSubmit = () => {
    if (password.toLowerCase() === 'lasvegas' || password.toLowerCase()==='las vegas') {
      setShowCompletionModal(true);
    } else {
      setPasswordError('Incorrect theme. Try again!');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-6">🎲</div>
          <div className="text-2xl text-yellow-400 font-bold">Loading your clue...</div>
          <div className="mt-4 w-32 h-2 mx-auto bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 animate-progress"></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 2s infinite;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-xl border-2 border-red-500 max-w-md">
          <div className="text-5xl mb-6">❌</div>
          <div className="text-xl text-red-400 font-bold mb-2">Error Loading Clue</div>
          <div className="text-gray-300">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white font-mono relative overflow-hidden"
         style={{ backgroundImage: "url('/casino-background.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      
      <div className="relative z-10 bg-black bg-opacity-95 p-8 rounded-xl border-2 border-yellow-500 max-w-2xl w-full shadow-[0_0_30px_rgba(255,215,0,0.3)]">
        {/* Header with player info */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full text-3xl border-2 border-yellow-400">
            {playerAvatar}
          </div>
          <div>
           
            <div className="text-yellow-200 font-bold text-xl">{playerName}</div>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mb-6 text-yellow-400 text-center">Your Final Clue</h2>
        
        {clueUrl && (
          <>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 border-2 border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 z-10"></div>
              <Image
                src={clueUrl}
                alt="Your special clue"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
                priority
              />
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-yellow-200 mb-2">Decode the clue and enter the theme:</p>
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the theme"
                  className="w-full px-5 py-4 rounded-full bg-black border-2 border-yellow-500 text-yellow-300 focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(255,215,0,0.3)] text-center text-lg placeholder-yellow-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-600 hover:text-yellow-400"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {passwordError && (
                <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-200 p-3 rounded-lg text-center animate-shake">
                  {passwordError}
                </div>
              )}
              
              <div className="text-center">
                <button 
                  onClick={handlePasswordSubmit}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer border border-yellow-400"
                >
                  Confirm your theme ❔
                </button>
              </div>
            </div>
          </>
        )}
        
        <div className="absolute top-0 right-0 text-6xl opacity-10 transform translate-x-1/3 -translate-y-1/3">🎯</div>
        <div className="absolute bottom-0 left-0 text-6xl opacity-10 transform -translate-x-1/3 translate-y-1/3">🔍</div>
      </div>

      <CollectionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        collectedItems={3}
        totalItems={3}
        showFinalStage={true}
      />
      
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}