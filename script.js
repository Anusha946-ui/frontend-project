let userAnswers = Array(10).fill(null); // Store user's selected answers

const questions = [
  { question: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
  { question: "What does CSS stand for?", options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Control Style Sheets"], answer: "Cascading Style Sheets" },
  { question: "Which HTML tag is used to define an internal style sheet?", options: ["<css>", "<script>", "<style>", "<link>"], answer: "<style>" },
  { question: "Which company developed JavaScript?", options: ["Netscape", "Microsoft", "Google", "Sun Microsystems"], answer: "Netscape" },
  { question: "Which of the following is NOT a programming language?", options: ["Python", "HTML", "Java", "C++"], answer: "HTML" },
  { question: "Which property is used in CSS to change text color?", options: ["font-color", "text-style", "color", "background-color"], answer: "color" },
  { question: "What does SQL stand for?", options: ["Structured Query Language", "Stylish Question Language", "Statement Question Language", "None of these"], answer: "Structured Query Language" },
  { question: "Which of the following is a JavaScript framework?", options: ["Django", "React", "Laravel", "Flask"], answer: "React" },
  { question: "What year was JavaScript created?", options: ["1993", "1995", "1998", "2000"], answer: "1995" },
  { question: "Which symbol is used for comments in JavaScript?", options: ["<!-- -->", "/* */", "//", "#"], answer: "//" }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timePerQuestion = 10;
let timeLeft = timePerQuestion;

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const quizScreen = document.getElementById("quizScreen");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const questionCounter = document.getElementById("questionCounter");
const scoreEl = document.getElementById("score");
const timerText = document.getElementById("timerText");
const timerBar = document.getElementById("timerBar");
const quizEnd = document.getElementById("quizEnd");
const circularScore = document.getElementById("circularScore");
const restartBtn = document.getElementById("restartBtn");
const endBtn = document.getElementById("endBtn");

// Start Quiz
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  loadQuestion(currentQuestion);
});

// Load Question
function loadQuestion(index) {
  clearInterval(timer);
  timeLeft = timePerQuestion;
  updateTimer();
  timer = setInterval(countdown, 1000);

  const q = questions[index];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const li = document.createElement("li");
    li.textContent = option;

    // Preselect if user already answered
    if (userAnswers[index] === option) {
      li.classList.add(option === q.answer ? "correct" : "wrong");
      [...optionsEl.children].forEach(c => c.style.pointerEvents = "none");
      nextBtn.disabled = false;
    }

    li.addEventListener("click", () => selectAnswer(option, li));
    optionsEl.appendChild(li);
  });

  questionCounter.textContent = `Question ${index + 1}/${questions.length}`;
  prevBtn.disabled = index === 0;
  nextBtn.textContent = (index === questions.length - 1) ? "Submit" : "Next";
  if (userAnswers[index] === null) nextBtn.disabled = true;
}

// Select Answer
function selectAnswer(option, li) {
  clearInterval(timer);

  // Prevent score increase multiple times
  if (userAnswers[currentQuestion] === null && option === questions[currentQuestion].answer) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
  } else if (userAnswers[currentQuestion] !== null && userAnswers[currentQuestion] === questions[currentQuestion].answer && option !== questions[currentQuestion].answer) {
    score--;
    scoreEl.textContent = `Score: ${score}`;
  }

  userAnswers[currentQuestion] = option;

  [...optionsEl.children].forEach(c => {
    c.style.pointerEvents = "none";
    if (c.textContent === questions[currentQuestion].answer) c.classList.add("correct");
    else if (c.textContent === option && option !== questions[currentQuestion].answer) c.classList.add("wrong");
  });

  nextBtn.disabled = false;
}

// Navigation
nextBtn.addEventListener("click", moveNext);
prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }
});

function moveNext() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else endQuiz();
}

// Timer
function countdown() {
  timeLeft--;
  updateTimer();
  if (timeLeft <= 0) {
    clearInterval(timer);
    [...optionsEl.children].forEach(c => {
      if (c.textContent === questions[currentQuestion].answer) c.classList.add("correct");
      c.style.pointerEvents = "none";
    });
    nextBtn.disabled = false;
  }
}

function updateTimer() {
  timerBar.style.width = `${(timeLeft / timePerQuestion) * 100}%`;
  timerText.textContent = `Time Left: ${timeLeft}s`;
}

// Quiz End
function endQuiz() {
  quizScreen.style.display = "none";  // Hide the quiz content completely
  quizEnd.style.display = "block";    // Show the final page
  circularScore.textContent = `0 / ${questions.length}`;
  animateCircularScore();
}


// Animate Score Circle
function animateCircularScore() {
  let percent = 0;
  const targetPercent = (score / questions.length) * 100;
  const interval = setInterval(() => {
    percent++;
    circularScore.style.background = `conic-gradient(#00c6ff ${percent * 3.6}deg, #1e1e1e 0deg)`;
    circularScore.textContent = `${Math.round(percent / 100 * questions.length)} / ${questions.length}`;
    if (percent >= targetPercent) clearInterval(interval);
  }, 20);
}

// Restart Quiz
// Restart Quiz
restartBtn.addEventListener("click", () => {
  // Hide the end screen
  quizEnd.style.display = "none";

  // Show the quiz screen
  quizScreen.style.display = "block";

  // Reset quiz state
  currentQuestion = 0;
  score = 0;
  userAnswers.fill(null);
  scoreEl.textContent = `Score: ${score}`;

  // Load first question
  loadQuestion(currentQuestion);
});


// End Quiz - go to start screen
endBtn.addEventListener("click", () => {
  quizEnd.style.display = "none";
  quizScreen.style.display = "none";
  startScreen.style.display = "block";
  currentQuestion = 0; score = 0;
  userAnswers.fill(null);
  scoreEl.textContent = `Score: ${score}`;
});
