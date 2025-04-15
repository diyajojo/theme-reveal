'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuizComponent from './components/quiz';
import GameComponent from './components/escaperoom';
import ClueComponent from './components/clue';
import WelcomeComponent from './components/welcome';
import CollectionModal from './components/modal';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="text-4xl animate-bounce mb-4">🎲</div>
      <div className="text-xl">Loading mission details...</div>
    </div>
  </div>
);

// Game content component
const GameContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'game' | 'clue' | 'finalchallenge'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');
  const [quizScore, setQuizScore] = useState(0);

  // Collection tracking
  const [collectedItems, setCollectedItems] = useState(0);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [revealTheme, setRevealTheme] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [autoProgressTimer, setAutoProgressTimer] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    
    if (!name || !avatar) {
      router.push('/');
      return;
    }
    
    setPlayerName(decodeURIComponent(name));
    setPlayerAvatar(decodeURIComponent(avatar));
    setInitialLoadComplete(true);
  }, [searchParams, router]);
  
  const handleWelcomeComplete = () => {
    // Moving from welcome to quiz
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    
    // User completed quiz - increment collection and show modal
    setCollectedItems(1);
    setShowCollectionModal(true);
    
    // Set auto-progress timer for modal after quiz
    if (autoProgressTimer) clearTimeout(autoProgressTimer);
    setAutoProgressTimer(setTimeout(() => {
      setShowCollectionModal(false);
      setCurrentStep('game');
    }, 3000));
  };
  
  const handleGameComplete = (won: boolean) => {
    if (won) {
      // User completed escape room - increment collection and show modal
      setCollectedItems(2);
      setShowCollectionModal(true);
      
      // Set auto-progress timer for modal after escape room
      if (autoProgressTimer) clearTimeout(autoProgressTimer);
      setAutoProgressTimer(setTimeout(() => {
        setShowCollectionModal(false);
        setCurrentStep('clue');
      }, 3000));
    }
  };

  const handleClueComplete = () => {
    setCurrentStep('finalchallenge');
  };
  
  const handleFinalChallengeComplete = () => {
    // User completed final challenge - increment collection, reveal theme and show modal
    setCollectedItems(3);
    setRevealTheme(true);
    setShowCollectionModal(true);
    
    // No auto-progress after final challenge
    if (autoProgressTimer) clearTimeout(autoProgressTimer);
  };
  
  const handleModalClose = () => {
    setShowCollectionModal(false);
    
    // If there's an auto-progress timer, clear it
    if (autoProgressTimer) {
      clearTimeout(autoProgressTimer);
      setAutoProgressTimer(null);
    }
    
    // Handle transitions after modal close based on current state
    if (collectedItems === 0) {
      // After initial modal, stay on welcome page
      // No need to change currentStep as it's already 'welcome'
    } else if (collectedItems === 1) {
      // After first collection (quiz completed) -> Go to escape room
      setCurrentStep('game');
    } else if (collectedItems === 2) {
      // After second collection (escape room completed) -> Go to clue step
      setCurrentStep('clue');
    } else if (collectedItems === 3) {
      // After theme reveal, could navigate to a celebration page or credits
      // For now, we'll just keep them on the final challenge page
    }
  };
  
  // Clear any auto-progress timers on unmount
  useEffect(() => {
    return () => {
      if (autoProgressTimer) clearTimeout(autoProgressTimer);
    };
  }, [autoProgressTimer]);
  
  const renderStep = () => {
    if (!playerName || !playerAvatar || !initialLoadComplete) {
      return <LoadingFallback />;
    }
    
    switch (currentStep) {
      case 'welcome':
        return <WelcomeComponent
                playerName={playerName}
                playerAvatar={playerAvatar}
                onStart={handleWelcomeComplete}
              />;
      case 'quiz':
        return <QuizComponent
                playerName={playerName}
                playerAvatar={playerAvatar}
                onQuizComplete={handleQuizComplete}
              />;
      case 'game':
        return <GameComponent
                playerName={playerName}
                playerAvatar={playerAvatar}
                quizScore={quizScore}
                onGameComplete={handleGameComplete}
              />;
      case 'clue':
        return <ClueComponent
          playerName={playerName}
          playerAvatar={playerAvatar}
          onComplete={handleClueComplete} userId={searchParams.get('userId') || ''}              />;
      case 'finalchallenge':
        return (
          <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="bg-gray-900 p-8 rounded-xl border-2 border-yellow-500 max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4 text-yellow-400">Final Challenge</h2>
              <p className="mb-6">Complete the final challenge to reveal the secret theme!</p>
              {/* Placeholder for actual final challenge */}
              <button 
                onClick={handleFinalChallengeComplete}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-lg"
              >
                Complete Challenge
              </button>
            </div>
          </div>
        );
      default:
        return <div>Loading...</div>;
    }
  };
  
  return (
    <main>
      {renderStep()}
      
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={handleModalClose}
        collectedItems={collectedItems}
        totalItems={3}
      />
    </main>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GameContent />
    </Suspense>
  );
}