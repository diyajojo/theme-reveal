'use client';
import { useState, useEffect } from 'react';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedItems: number;
  totalItems: number;
  showFinalStage?: boolean;
}

const CollectionModal = ({
  isOpen,
  onClose,
  collectedItems,
  totalItems,
  showFinalStage = false
}: CollectionModalProps) => {
  const [animateItems, setAnimateItems] = useState(false);
  
  // Collection items with enhanced icons
  const collectionItems = [
    { name: 'Ancient Key', emoji: '🗝️', collected: collectedItems >= 1 },
    { name: 'Crystal Orb', emoji: '🔮', collected: collectedItems >= 2 },
    { name: 'Golden Medallion', emoji: '🏅', collected: collectedItems >= 3 }
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setAnimateItems(true);
      }, 300);
    } else {
      setAnimateItems(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="bg-black bg-opacity-95 p-8 rounded-xl border-2 border-yellow-500 w-full max-w-md shadow-[0_0_30px_rgba(255,215,0,0.3)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-yellow-500 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-500 opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold mb-3 text-yellow-400 tracking-wider">
            {showFinalStage ? 'Collection Complete!' : 'Mystery Collection'}
          </h3>
          
          <div className="w-full bg-black h-4 rounded-full overflow-hidden mb-2 border border-yellow-900">
            <div 
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-full transition-all duration-1000" 
              style={{ width: `${(collectedItems / totalItems) * 100}%` }}
            ></div>
          </div>
          
          <p className="mt-2 text-yellow-200 font-bold text-lg">
            {collectedItems} of {totalItems} collected
          </p>
        </div>

        <div className="flex justify-center gap-8 mb-10">
          {collectionItems.map((item, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center transition-all duration-500 ${
                animateItems ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`text-4xl mb-3 p-5 rounded-full 
                ${item.collected 
                  ? 'bg-gradient-to-b from-yellow-600 to-yellow-800 border-2 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                  : 'bg-black border-2 border-yellow-900 opacity-50'
                }
              `}>
                {item.emoji}
              </div>
              <span className={`text-sm font-medium ${item.collected ? 'text-yellow-300' : 'text-gray-500'}`}>
                {item.collected ? item.name : '???'}
              </span>
            </div>
          ))}
        </div>
        
        {showFinalStage && (
          <div className="text-center mb-8 animate-fadeIn">
            <div className="py-3 px-6 bg-black bg-opacity-50 rounded-lg border border-yellow-600 mb-4">
              <p className="text-lg text-yellow-100 mb-2">Congratulations!</p>
              
            </div>
            <div className="text-center">
              <div className="inline-block animate-bounce text-4xl mb-2">👇</div>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => {
              if (showFinalStage) {
                window.location.href = 'https://jigex.com/WPZh5';
              } else {
                onClose();
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-white font-bold rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            {showFinalStage ? (
              <>
                <span className="text-lg">Solve Final Puzzle</span>
                <span className="text-xl">🧩</span>
              </>
            ) : (
              <>
                <span className="text-lg">Continue the Hunt</span>
                <span className="text-xl">⚔️</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.5));
        }
      `}</style>
    </div>
  );
};

export default CollectionModal;