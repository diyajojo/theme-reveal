'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { quizQuestions } from './quiz';

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black bg-opacity-90 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const playerName = searchParams.get('name') || 'Mystery Player';
  const playerAvatar = searchParams.get('avatar') || '🕵️';
  
  const [currentStep, setCurrentStep] = useState('welcome');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  
  const handleQuizStart = () => {
    setQuizStarted(true);
    setCurrentStep('quiz');
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!isAnswerChecked) {
      setSelectedOption(optionIndex);
      setIsAnswerChecked(true);
    }
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedOption === quizQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } 
    else 
    {
      // Quiz finished - show results
      setShowResult(true);
      
      // Redirect after 5 seconds
      setTimeout(() => {
        router.push(`/explore?name=${encodeURIComponent(playerName)}&avatar=${encodeURIComponent(playerAvatar)}&score=${score + (isCorrect ? 1 : 0)}`);
      }, 5000);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
    setShowFailurePopup(false);
    setIsAnswerChecked(false);
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center text-white font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        {currentStep === 'welcome' && (
          <div className="bg-gray-900 bg-opacity-95 p-10 rounded-xl border-2 border-yellow-500 mb-8 max-w-2xl backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full text-4xl mr-4">
                {playerAvatar}
              </div>
              <h1 className="text-4xl font-bold text-yellow-300">
                Welcome, NJ Resident {playerName}
              </h1>
            </div>
            
            <p className="text-xl mb-8 text-yellow-100">
              Before you can attend the NJ Hostel Farewell Night, you must prove how well you know the hostel and your fellow residents.
            </p>
            
            <p className="text-lg mb-8">
              This quiz will test your knowledge of NJ's traditions, people, and memorable moments. Only those who truly belong to the NJ family can proceed!
            </p>
            
            <button
              onClick={handleQuizStart}
              className="bg-yellow-600 hover:bg-yellow-500 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
            >
              START THE NJ QUIZ
            </button>
          </div>
        )}
        
        {currentStep === 'quiz' && !showResult && !showFailurePopup && (
          <div className="bg-gray-900 bg-opacity-95 p-8 rounded-xl border-2 border-yellow-500 mb-8 max-w-2xl backdrop-blur-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{playerAvatar}</span>
                <span className="text-yellow-300 font-bold">{playerName}</span>
              </div>
              <div className="text-yellow-300">
                Question {currentQuestion + 1}/{quizQuestions.length}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl mb-6 text-yellow-200">
                {quizQuestions[currentQuestion].question}
              </h2>
              
              <div className="flex flex-col gap-4">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isAnswerChecked}
                    className={`p-4 text-left rounded-lg border transition-colors cursor-pointer ${
                      !isAnswerChecked
                        ? selectedOption === index
                          ? 'bg-yellow-600 border-yellow-400 text-white'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                        : index === quizQuestions[currentQuestion].correctAnswer
                        ? 'bg-yellow-600 border-yellow-400 text-white'
                        : selectedOption === index
                        ? 'bg-red-600 border-red-400 text-white'
                        : 'bg-gray-800 border-gray-700 opacity-50'
                    }`}
                  >
                    {['A', 'B', 'C', 'D'][index]}. {option}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white px-10 py-3 rounded-full font-bold text-lg transition-all shadow-lg cursor-pointer disabled:cursor-not-allowed"
            >
              {currentQuestion < quizQuestions.length - 1 ? 'NEXT QUESTION' : 'SUBMIT ANSWERS'}
            </button>
          </div>
        )}
        
        {showResult && !showFailurePopup && (
          <div className="bg-gray-900 bg-opacity-95 p-8 rounded-xl border-2 border-yellow-500 mb-8 max-w-2xl backdrop-blur-sm animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">NJ Knowledge Assessment</h2>
            
            <div className="text-6xl mb-6">
              {score >= 8 ? '🌟' : score >= 5 ? '✨' : '💫'}
            </div>
            
            <p className="text-2xl mb-4">
              You scored: <span className="text-yellow-300 font-bold">{score}/{quizQuestions.length}</span>
            </p>
            
            <p className="text-lg mb-8">
              {score >= 8 
                ? "Impressive! You're a true NJ hostel legend. Your knowledge of our community is outstanding!"
                : score >= 5 
                ? "Well done! You've demonstrated enough knowledge of NJ hostel to attend the farewell. Welcome aboard!"
                : "You've shown some connection to NJ hostel. We'll let you in, but you might want to mingle more!"}
            </p>
      
          </div>
        )}
        
        {showFailurePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 backdrop-blur-md">
            <div className="bg-gray-900 text-white p-8 rounded-xl border-2 border-red-500 w-full max-w-md shadow-lg animate-fadeIn">
              <div className="text-6xl mb-4 text-center">😔</div>
              
              <h3 className="text-2xl font-bold mb-4 text-red-400 text-center">
                NJ Farewell Access Denied
              </h3>
              
              <p className="text-lg mb-6">
                Sorry, but it seems you don't know enough about NJ hostel and its residents to attend the farewell event.
              </p>
              
              <p className="text-gray-300 mb-8">
                The NJ community is built on shared experiences and memories. Perhaps you should spend more time with your hostel mates before the event...
              </p>
              
              <button
                onClick={handleRetry}
                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-lg font-bold text-lg transition-all shadow-lg cursor-pointer"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}