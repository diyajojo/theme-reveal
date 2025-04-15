interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "In which year was NJ founded?",
    options: ["1991", "1989", "1994", "1980"],
    correctAnswer: 0
  },
  {
    question: "How many cows are there in NJ?",
    options: ["2", "3", "1", "4"],
    correctAnswer: 3
  },
  {
    question: "Among the fruits listed below, which ones are NOT found in NJ?",
    options: ["Mango", "Jackfruit", "Rambutan", "Rose Apple"],
    correctAnswer: 2
  },
  {
    question: "How many bathrooms are there on the first floor?",
    options: ["9", "8", "10", "7"],
    correctAnswer: 0
  },
  {
    question: "What type of soil is found in NJ?",
    options: ["Loamy soil", "Clayey soil", "Lateritic soil", "Sandy soil"],
    correctAnswer: 2
  },
  {
    question: "What is the total number of accommodable rooms in NJ?",
    options: ["12", "11", "9", "10"],
    correctAnswer: 0
  },
  {
    question: "What is the name of the water purifier company used in NJ?",
    options: ["Aquaguard", "Conway", "Faber", "Pureit"],
    correctAnswer: 1
  },
  {
    question: "What is the name of the dog in NJ?",
    options: ["Jimmy", "Brownie", "Bruno", "Loki"],
    correctAnswer: 2
  },
  {
    question: "How many wells are there in NJ?",
    options: ["1", "3", "2", "4"],
    correctAnswer: 2
  },
  {
    question: "Which congregation of sisters is present in NJ?",
    options: ["CMC", "FCC", "CSC", "SVM"],
    correctAnswer: 2
  },
  {
    question: "What is NJ’s most famous delicacy?",
    options: ["Butter Chicken", "Aviyal", "Mac n Cheese", "Manjacurry"],
    correctAnswer: 3
  },
  {
    question: "What is the native place of Sr. Chrisanth?",
    options: ["Irinjalakuda", "Chalakudy", "Mala", "Kodakara"],
    correctAnswer: 3
  }
];