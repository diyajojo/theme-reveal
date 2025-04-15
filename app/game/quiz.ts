interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "In a game of chance, what's the probability of rolling a 6 on a standard die?",
    options: ["1/4", "1/6", "1/8", "1/12"],
    correctAnswer: 1
  },
  {
    question: "Which card game is associated with counting cards?",
    options: ["Poker", "Blackjack", "Rummy", "Baccarat"],
    correctAnswer: 1
  },
  {
    question: "What famous casino game uses a wheel with numbered slots?",
    options: ["Craps", "Poker", "Roulette", "Baccarat"],
    correctAnswer: 2
  },
  {
    question: "Which of these is NOT a standard poker hand?",
    options: ["Full House", "Royal Flush", "Straight", "Perfect Pair"],
    correctAnswer: 3
  },
  {
    question: "In mystery novels, who typically reveals all the clues at the end?",
    options: ["The victim", "The detective", "The witness", "The criminal"],
    correctAnswer: 1
  },
  {
    question: "What's the minimum number of cards needed for a game of Blackjack?",
    options: ["52", "32", "24", "104"],
    correctAnswer: 0
  },
  {
    question: "Which mystery novelist created the character Hercule Poirot?",
    options: ["Arthur Conan Doyle", "Agatha Christie", "Dashiell Hammett", "Raymond Chandler"],
    correctAnswer: 1
  },
  {
    question: "In gambling terms, what does 'the house' refer to?",
    options: ["The players", "The casino", "The dealer", "The bank"],
    correctAnswer: 1
  },
  {
    question: "What color are the zero slots on a standard roulette wheel?",
    options: ["Red", "Black", "Green", "Gold"],
    correctAnswer: 2
  },
  {
    question: "Which of these is a famous casino in Monaco?",
    options: ["The Venetian", "Monte Carlo", "MGM Grand", "Caesars Palace"],
    correctAnswer: 1
  }
];
