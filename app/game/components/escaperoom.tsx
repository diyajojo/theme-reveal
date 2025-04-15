'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Define interfaces for component props
interface GameComponentProps {
  playerName: string;
  playerAvatar: string;
  quizScore: number;
  onGameComplete: (won: boolean) => void;
}

// Define interfaces for your state objects
interface Position {
  x: number;
  y: number;
}

interface Guard {
  id: number;
  x: number;
  y: number;
}

interface Treasure {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface Fairy {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  visible: boolean;
}

const gridSize = 10;
const treasureCount = 8;  // Changed from 5 to 8
const fairyCount = 2;
const totalGuards = 6; // Increased from 3 to 6 guards

export default function GameComponent({ playerName, playerAvatar, quizScore, onGameComplete }: GameComponentProps) {
  const router = useRouter();

  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [guards, setGuards] = useState<Guard[]>([]);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [fairies, setFairies] = useState<Fairy[]>([]);
  const [collectedTreasures, setCollectedTreasures] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // Increased from 60 to 120 seconds
  const [showInstructions, setShowInstructions] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [fairiesSpawned, setFairiesSpawned] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimeRef = useRef(0);

  // Initialize treasures and guards
  useEffect(() => {
    initializeGame();
  }, []);
  
  // Initialize the game elements
  const initializeGame = () => {
    // Initialize guards at random positions
    const newGuards: Guard[] = [];
    while (newGuards.length < totalGuards) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      
      // Don't place guards on player starting position
      if ((x !== 0 || y !== 0) && 
          !newGuards.some(guard => guard.x === x && guard.y === y)) {
        newGuards.push({ id: newGuards.length + 1, x, y });
      }
    }
    
    // Add treasures
    const newTreasures: Treasure[] = [];
    while (newTreasures.length < treasureCount) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      
      // Don't place treasures on player or guards
      if ((x !== 0 || y !== 0) && 
          !newGuards.some(guard => guard.x === x && guard.y === y) &&
          !newTreasures.some(treasure => treasure.x === x && treasure.y === y)) {
        newTreasures.push({ id: newTreasures.length + 1, x, y, collected: false });
      }
    }
    
    // Add fairies (but they won't be visible at first)
    const newFairies: Fairy[] = [];
    while (newFairies.length < fairyCount) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      
      // Don't place fairies on player, guards, or treasures
      if ((x !== 0 || y !== 0) && 
          !newGuards.some(guard => guard.x === x && guard.y === y) &&
          !newTreasures.some(treasure => treasure.x === x && treasure.y === y) &&
          !newFairies.some(fairy => fairy.x === x && fairy.y === y)) {
        newFairies.push({ id: newFairies.length + 1, x, y, collected: false, visible: false });
      }
    }
    
    setGuards(newGuards);
    setTreasures(newTreasures);
    setFairies(newFairies);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver || gameWon || isPaused) return;
    
    setPlayerPos((prev) => {
      const newPos = { ...prev };
      if (e.key === 'ArrowUp' && prev.y > 0) newPos.y -= 1;
      if (e.key === 'ArrowDown' && prev.y < gridSize - 1) newPos.y += 1;
      if (e.key === 'ArrowLeft' && prev.x > 0) newPos.x -= 1;
      if (e.key === 'ArrowRight' && prev.x < gridSize - 1) newPos.x += 1;
      return newPos;
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameWon, isPaused]);

  // Make guards appear at random positions occasionally
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;
    
    const randomizeGuardPositions = () => {
      setGuards(prevGuards => {
        // 20% chance for each guard to teleport to a new random position
        return prevGuards.map(guard => {
          if (Math.random() < 0.2) {
            let newX, newY;
            do {
              newX = Math.floor(Math.random() * gridSize);
              newY = Math.floor(Math.random() * gridSize);
              // Don't teleport onto the player
            } while (newX === playerPos.x && newY === playerPos.y);
            
            return { ...guard, x: newX, y: newY };
          }
          return guard;
        });
      });
    };
    
    const interval = setInterval(randomizeGuardPositions, 5000);
    return () => clearInterval(interval);
  }, [gameOver, gameWon, isPaused, playerPos]);

  // Guard movement - FASTER now
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;
    
    const moveGuards = () => {
      setGuards((prevGuards) =>
        prevGuards.map((guard) => {
          // Smarter guard movement - increased tendency to move toward player (40%)
          const moveTowardPlayer = Math.random() < 0.4;
          let dx = 0, dy = 0;
          
          if (moveTowardPlayer) {
            // Move toward player
            dx = guard.x < playerPos.x ? 1 : guard.x > playerPos.x ? -1 : 0;
            dy = guard.x === playerPos.x ? (guard.y < playerPos.y ? 1 : -1) : 0;
          } else {
            // Random movement
            const directions = [
              { dx: 0, dy: -1 },
              { dx: 0, dy: 1 },
              { dx: -1, dy: 0 },
              { dx: 1, dy: 0 },
              { dx: 0, dy: 0 },
            ];
            const move = directions[Math.floor(Math.random() * directions.length)];
            dx = move.dx;
            dy = move.dy;
          }
          
          const newX = Math.max(0, Math.min(gridSize - 1, guard.x + dx));
          const newY = Math.max(0, Math.min(gridSize - 1, guard.y + dy));
          return { ...guard, x: newX, y: newY };
        })
      );
    };

    // Even faster interval: 400ms (was 500ms)
    const interval = setInterval(moveGuards, 400);
    return () => clearInterval(interval);
  }, [gameOver, gameWon, isPaused, playerPos]);

  // Check collisions with guards, treasures, and fairies
  useEffect(() => {
    if (gameOver || gameWon || isPaused) return;
    
    // Check guard collisions
    for (const guard of guards) {
      if (guard.x === playerPos.x && guard.y === playerPos.y) {
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
          setGameOver(true);
          return;
        }
        
        // Move player back to start
        setPlayerPos({ x: 0, y: 0 });
        break;
      }
    }
    
    // Check treasure collection
    setTreasures((prevTreasures) => {
      let collected = false;
      const updatedTreasures = prevTreasures.map(treasure => {
        if (!treasure.collected && treasure.x === playerPos.x && treasure.y === playerPos.y) {
          collected = true;
          return { ...treasure, collected: true };
        }
        return treasure;
      });
      
      if (collected) {
        const newCount = collectedTreasures + 1;
        setCollectedTreasures(newCount);
        if (newCount >= treasureCount) {
          setGameWon(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }
      
      return updatedTreasures;
    });
    
    // Check fairy collection
    setFairies((prevFairies) => {
      let fairyCollected = false;
      const updatedFairies = prevFairies.map(fairy => {
        if (fairy.visible && !fairy.collected && fairy.x === playerPos.x && fairy.y === playerPos.y) {
          fairyCollected = true;
          return { ...fairy, collected: true };
        }
        return fairy;
      });
      
      if (fairyCollected) {
        // Increase lives when fairy is collected
        setLives(prev => prev + 1);
      }
      
      return updatedFairies;
    });
  }, [playerPos, guards, isPaused]);

  // Timer and game progression
  useEffect(() => {
    if (isPaused || gameOver || gameWon) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
      
      // Increment game time
      gameTimeRef.current += 1;
      
      // Spawn fairies after 30 seconds of gameplay
      if (gameTimeRef.current === 30 && !fairiesSpawned) {
        setFairies(prevFairies => 
          prevFairies.map(fairy => ({ ...fairy, visible: true }))
        );
        setFairiesSpawned(true);
      }
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, gameOver, gameWon, fairiesSpawned]);

  const startGame = () => {
    setShowInstructions(false);
    setIsPaused(false);
    gameTimeRef.current = 0;
  };

  const resetGame = () => {
    setPlayerPos({ x: 0, y: 0 });
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setTimeLeft(120);
    setCollectedTreasures(0);
    setFairiesSpawned(false);
    gameTimeRef.current = 0;
    
    // Re-initialize game elements
    initializeGame();
    setIsPaused(false);
  };

  // Function to redirect to puzzle through an intermediate page
  const redirectToPuzzle = () => {
    // Call the onGameComplete with true to trigger the collection modal
    onGameComplete(true);
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isPlayer = x === playerPos.x && y === playerPos.y;
        const guardHere = guards.find((g) => g.x === x && g.y === y);
        const treasureHere = treasures.find(t => t.x === x && t.y === y && !t.collected);
        const fairyHere = fairies.find(f => f.x === x && f.y === y && !f.collected && f.visible);
        
        const getCellStyle = () => {
          if (isPlayer) return 'relative bg-transparent text-yellow-400';
          if (guardHere) return 'relative bg-transparent text-red-500';
          if (treasureHere || fairyHere) return 'relative bg-transparent';
          return 'relative bg-black bg-opacity-20 hover:bg-yellow-900 hover:bg-opacity-20';
        };

        cells.push(
          <div
            key={`${x}-${y}`}
            className={`border border-[#4a3302] rounded-md flex items-center justify-center
              ${getCellStyle()}
            `}
          >
            {isPlayer && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 text-2xl animate-pulse">{playerAvatar}</div>
              </div>
            )}
            {guardHere && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 text-2xl animate-bounce">🧟</div>
              </div>
            )}
            {treasureHere && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 text-2xl animate-pulse">🌟</div>
              </div>
            )}
            {fairyHere && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 text-2xl animate-pulse">🧚‍♀️</div>
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white font-mono" 
         style={{ backgroundImage: "url('/casino-background.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        {/* Removed Casino Heist heading as requested */}
        
        {/* Game stats - Reorganized in a more consistent UI but with original yellow theme */}
        <div className="w-full max-w-4xl mb-4">
          <div className="flex justify-between bg-black bg-opacity-90 rounded-lg p-4 border border-yellow-600 shadow-lg">
            {/* Player info */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl">{playerAvatar}</div>
              <div>
                <div className="text-yellow-400 text-sm">PLAYER</div>
                <div className="font-bold">{playerName}</div>
              </div>
            </div>
            
            {/* Game stats */}
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-yellow-400 text-sm">TIME LEFT</div>
                <div className={`font-bold text-center ${timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </div>
              </div>
              
              <div>
                <div className="text-yellow-400 text-sm">LIVES</div>
                <div className="text-red-500 font-bold text-center">{Array(lives).fill('❤️').join('')}</div>
              </div>
              
              <div>
                <div className="text-yellow-400 text-sm">STARS</div>
                <div className="text-yellow-400 font-bold text-center">{collectedTreasures}/{treasureCount}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Game grid */}
        <div className="w-[600px] h-[600px] grid grid-cols-10 grid-rows-10 gap-[2px] bg-black bg-opacity-90 p-4 rounded-lg border-4 border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
             style={{ backgroundImage: "url('/casino-carpet.jpg')", backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}>
          {renderGrid()}
        </div>
        
        {/* Game instructions */}
        {showInstructions && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20">
            <div className="bg-black p-8 rounded-xl border-2 border-yellow-600 max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4 text-yellow-400">
                Welcome to the Ultimate Escape Hunt
              </h2>
              <p className="mb-6 text-yellow-100">
                You're locked in a room filled with secrets and hidden treasures. Your mission? Collect them all, solve the puzzles, and escape before time runs out. 🕰️ <br />
                Be brave. Stay sharp. Use your wit and tactics wisely. The clock is ticking... ⏳
              </p>

              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">{playerAvatar}</div>
                  <div>You</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🧟</div>
                  <div>Guards</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌟</div>
                  <div>Stars</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🧚‍♀️</div>
                  <div>+1 Life</div>
                </div>
              </div>
              <p className="mb-6">
                Use arrow keys to move. Beware of the guards - they'll teleport randomly and move faster than you think!
                Collect all treasures before time runs out! Power-ups will appear after some time.
              </p>
              <button 
                onClick={startGame}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors"
              >
                START HEIST
              </button>
            </div>
          </div>
        )}
        
        {/* Game over screen */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-20">
            <div className="bg-black p-8 rounded-xl border-2 border-yellow-600 max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4 text-yellow-500">BUSTED!</h2>
              <p className="mb-6 text-yellow-200">
                The security caught you! You collected {collectedTreasures} out of {treasureCount} stars.
              </p>
              <button 
                onClick={resetGame}
                className="bg-yellow-600 hover:bg-yellow-500 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}
        
        {/* Win screen - Modified to include redirect to puzzle */}
        {gameWon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-20">
            <div className="bg-black p-8 rounded-xl border-2 border-yellow-400 max-w-lg text-center">
              <h2 className="text-3xl font-bold mb-4 text-yellow-400">JACKPOT!</h2>
              <p className="mb-6 text-yellow-200">
                You've hit the big time! Successfully collected all stars with {timeLeft} seconds remaining!
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={resetGame}
                  className="bg-yellow-800 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-bold text-lg transition-colors"
                >
                  PLAY AGAIN
                </button>
                <button 
                  onClick={redirectToPuzzle}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg transition-colors"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}