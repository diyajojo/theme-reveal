'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import Image from 'next/image';
import CollectionModal from './modal';

interface ClueComponentProps {
  playerName: string;
  playerAvatar: string;
  userId: string;  // Add this new prop
  onComplete: () => void;
}

export default function ClueComponent({ playerName, playerAvatar, userId, onComplete }: ClueComponentProps) {
  const [clueUrl, setClueUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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
    if (password.toLowerCase() === 'hello') {
      setShowCompletionModal(true);  // Show modal first
    } else {
      setPasswordError('Incorrect theme. Try again!');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl animate-bounce mb-4">🎲</div>
          <div className="text-xl">Loading your clue...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-xl border-2 border-yellow-500 max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-2xl">{playerAvatar}</span>
          <span className="text-yellow-400 font-bold text-xl">{playerName}</span>
        </div>
        
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">Your Special Clue</h2>
        
        {clueUrl && (
          <>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
              <Image
                src={clueUrl}
                alt="Your special clue"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the theme"
                  className="w-full px-4 py-3 rounded-full bg-black border-2 border-yellow-600 text-yellow-400 focus:outline-none focus:border-yellow-400"
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <button 
                onClick={handlePasswordSubmit}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-lg"
              >
                Reveal Final Puzzle
              </button>
            </div>
          </>
        )}
      </div>

      <CollectionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        collectedItems={3}
        totalItems={3}
        showFinalStage={true}
      />
    </div>
  );
}
