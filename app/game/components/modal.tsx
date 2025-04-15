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
  
  // Collection items (replace with your unique items)
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 backdrop-blur-sm">
      <div className="bg-gray-900 text-white p-8 rounded-xl border-2 border-yellow-500 w-full max-w-md shadow-lg relative overflow-hidden">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold mb-2 text-yellow-300">
            Mystery Collection
          </h3>
          
          <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-yellow-500 h-full transition-all duration-1000" 
              style={{ width: `${(collectedItems / totalItems) * 100}%` }}
            ></div>
          </div>
          
          <p className="mt-2 text-yellow-200 font-bold">
            {collectedItems} of {totalItems} collected
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-8">
          {collectionItems.map((item, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center transition-all duration-500 ${
                animateItems ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`text-4xl mb-2 p-4 rounded-full ${
                item.collected 
                  ? 'bg-yellow-600 animate-pulse' 
                  : 'bg-gray-800 opacity-50'
              }`}>
                {item.emoji}
              </div>
              <span className={`text-sm ${item.collected ? 'text-yellow-300' : 'text-gray-400'}`}>
                {item.collected ? item.name : '???'}
              </span>
            </div>
          ))}
        </div>
        
        {showFinalStage && (
          <div className="text-center mb-6 animate-fadeIn">
            <p className="text-lg text-yellow-100 mb-2">Congratulations! All items collected!</p>
            <h4 className="text-3xl font-bold text-yellow-400">
              Ready for the Final Puzzle?
            </h4>
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
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded transition-colors flex items-center gap-2 cursor-pointer"
          >
            {showFinalStage ? 'Start Final Puzzle' : 'Continue the Hunt'}
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
      `}</style>
    </div>
  );
};

export default CollectionModal;