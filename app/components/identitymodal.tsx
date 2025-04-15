'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addUser } from '../utils/database';

interface IdentityModalProps {
  onClose: () => void;
}

const IdentityModal = ({ onClose }: IdentityModalProps) => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const avatarOptions = ['🕵️‍♀️', '🕵️‍♂️', '🦹‍♀️', '🦹‍♂️', '🥷', '👮‍♀️', '👮‍♂️'];

  const handleAvatarChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setAvatarIndex((prev) => (prev + 1) % avatarOptions.length);
    } else {
      setAvatarIndex((prev) => (prev - 1 + avatarOptions.length) % avatarOptions.length);
    }
  };

  const handleNameSubmit = async () => {
    if (userName.trim() === '') {
      setError("Please enter your name.");
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const userId = await addUser(userName);

      // Store user information in localStorage
      localStorage.setItem('playerName', userName);
      localStorage.setItem('playerAvatar', avatarOptions[avatarIndex]);
      localStorage.setItem('userId', userId.toString());

      const text = "Identity confirmed. Preparing for mission...";
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i < text.length) {
          setSuccessMessage((prev) => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingEffect);
          setTimeout(() => {
            router.push(`/game?userId=${userId}&name=${encodeURIComponent(userName)}&avatar=${encodeURIComponent(avatarOptions[avatarIndex])}`);
          }, 1000);
        }
      }, 40);
    } catch (error) {
      console.error('Error details:', error);
      setError("Failed to create user. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 backdrop-blur-sm">
      <div className="bg-gray-900 text-white p-8 rounded-xl border-2 border-yellow-500 w-full max-w-md shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="absolute text-6xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {['♠', '♥', '♦', '♣'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-yellow-300">Your Secret Identity</h3>
        
        <div className="mb-6">
          <p className="text-lg mb-4 text-yellow-100">Choose your avatar:</p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => handleAvatarChange('prev')}
              className="text-2xl bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              ◀
            </button>
            <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full text-4xl">
              {avatarOptions[avatarIndex]}
            </div>
            <button 
              onClick={() => handleAvatarChange('next')}
              className="text-2xl bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              ▶
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-yellow-200 mb-2">Codename:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your alias"
            className="w-full px-4 py-3 rounded text-white bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-text"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleNameSubmit();
            }}
          />
        </div>

        {error && (
          <div className="text-red-400 mb-4 p-2 bg-red-900 bg-opacity-30 rounded border border-red-800">
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
          <div className="text-green-400 mb-4">{successMessage}</div>
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleNameSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded transition-colors flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">🎲</span> Processing...
              </>
            ) : (
              <>Enter</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentityModal;