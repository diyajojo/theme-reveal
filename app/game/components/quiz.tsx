'use client';
import { useState } from 'react';
import { quizQuestions } from '../quiz';

// Define interfaces for component props
interface QuizComponentProps {
  playerName: string;
  playerAvatar: string;
  onQuizComplete: (score: number) => void;
}

export default function QuizComponent({ playerName, playerAvatar, onQuizComplete }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);


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
    else {
      // Quiz finished - show results
      setShowResult(true);
      
      // After showing results briefly, notify parent component
      setTimeout(() => {
        const finalScore = score + (isCorrect ? 1 : 0);
        onQuizComplete(finalScore);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        {!showResult ? (
          <div className="bg-black bg-opacity-95 p-8 rounded-xl border-2 border-yellow-500 mb-8 max-w-2xl backdrop-blur-sm shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{playerAvatar}</span>
                <span className="text-yellow-400 font-bold">{playerName}</span>
              </div>
              <div className="text-yellow-400">
                Question {currentQuestion + 1}/{quizQuestions.length}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl mb-6 text-yellow-300">
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
                          : 'bg-black border-yellow-900 hover:bg-yellow-900 hover:bg-opacity-20'
                        : index === quizQuestions[currentQuestion].correctAnswer
                        ? 'bg-yellow-600 border-yellow-400 text-white'
                        : selectedOption === index
                        ? 'bg-red-600 border-red-400 text-white'
                        : 'bg-black border-gray-700 opacity-50'
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
              className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:hover:bg-gray-600 text-white px-10 py-3 rounded-full font-bold text-lg transition-all shadow-lg cursor-pointer disabled:cursor-not-allowed border border-yellow-400"
            >
              {currentQuestion < quizQuestions.length - 1 ? 'NEXT QUESTION' : 'SUBMIT ANSWERS'}
            </button>
          </div>
        ) : (
          <div className="bg-black bg-opacity-95 p-8 rounded-xl border-2 border-yellow-500 mb-8 max-w-2xl backdrop-blur-sm shadow-[0_0_30px_rgba(255,215,0,0.3)]">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">NJ Knowledge Assessment</h2>
            
            <div className="text-6xl mb-6">
              {score >= 8 ? '🌟' : score >= 5 ? '✨' : '💫'}
            </div>
            
            <p className="text-2xl mb-4 text-yellow-300">
              You scored: <span className="text-yellow-400 font-bold">{score}/{quizQuestions.length}</span>
            </p>
            
            <p className="text-lg mb-8 text-yellow-200">
              "Congratulations on completing the NJ Knowledge Quiz! You've proven your connection to our hostel community. Your are one step behind the farewell celebration."
            </p>
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