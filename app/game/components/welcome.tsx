'use client';
interface WelcomeComponentProps {
  playerName: string;
  playerAvatar: string;
  onStart: () => void;
}

export default function WelcomeComponent({ playerName, playerAvatar, onStart }: WelcomeComponentProps) {
  return (
    <div className="min-h-screen bg-black bg-opacity-90 flex flex-col items-center justify-center text-white font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-80 z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        <div className="bg-gray-900 bg-opacity-95 p-10 rounded-xl border-2 border-yellow-500 mb-8 max-w-2xl backdrop-blur-sm animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full text-4xl mr-4">
              {playerAvatar}
            </div>
            <h1 className="text-4xl font-bold text-yellow-300">
              Welcome,
              <br />
              NJ Resident {playerName}
            </h1>
          </div>
          
          <p className="text-xl mb-8 text-yellow-100">
            Before you can attend the NJ Hostel Farewell Night, you must prove how well you know the hostel and your fellow residents.
          </p>
          
          <p className="text-lg mb-8">
            This quiz will test your knowledge of NJ's traditions, people, and memorable moments. Only those who truly belong to the NJ family can proceed!
          </p>
          
          <button
            onClick={onStart}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-lg cursor-pointer"
          >
            START THE NJ QUIZ
          </button>
        </div>
      </div>

      <style jsx>{`
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
