'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuizComponent from './components/quiz';
import GameComponent from './components/escaperoom';
import WelcomeComponent from './components/welcome';

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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'quiz' | 'game'>('welcome');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  
  useEffect(() => {
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    
    if (!name || !avatar) {
      router.push('/');
      return;
    }
    
    setPlayerName(decodeURIComponent(name));
    setPlayerAvatar(decodeURIComponent(avatar));
  }, [searchParams, router]);
  
  const handleWelcomeComplete = () => {
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setCurrentStep('game');
  };
  
  const renderStep = () => {
    if (!playerName || !playerAvatar) {
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
              />;
      default:
        return <div>Loading...</div>;
    }
  };
  
  return (
    <main>
      {renderStep()}
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