const CHOICES = ['rock', 'paper', 'scissors'];
const EMOJI = { rock: '✊', paper: '✋', scissors: '✌️' };

const BEATS = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const CONFETTI_COLORS = ['#e0b04f', '#7cc576', '#f4ecd8', '#c1443c'];

let playerScore = 0;
let computerScore = 0;
let round = 1;

const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const playerScoreWrap = document.getElementById('playerScoreWrap');
const computerScoreWrap = document.getElementById('computerScoreWrap');
const roundNumberEl = document.getElementById('roundNumber');
const playerPickEl = document.getElementById('playerPick');
const computerPickEl = document.getElementById('computerPick');
const resultTextEl = document.getElementById('resultText');
const confettiLayer = document.getElementById('confettiLayer');
const resetBtn = document.getElementById('resetBtn');
const choiceButtons = document.querySelectorAll('.choice-btn');

function getComputerChoice() {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

function decideWinner(player, computer) {
  if (player === computer) return 'tie';
  if (BEATS[player] === computer) return 'win';
  return 'lose';
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function flipScore(wrapEl, newValue) {
  wrapEl.classList.remove('flip');
  void wrapEl.offsetWidth; // restart animation
  wrapEl.querySelector('span').textContent = newValue;
  wrapEl.classList.add('flip');
}

function retrigger(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function spawnConfetti() {
  const pieceCount = 16;
  for (let i = 0; i < pieceCount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDelay = `${Math.random() * 0.15}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 1100);
  }
}

function updateResultText(outcome, player, computer) {
  resultTextEl.classList.remove('win', 'lose', 'tie', 'stamp');

  if (outcome === 'tie') {
    resultTextEl.textContent = `Both threw ${player} — draw!`;
    resultTextEl.classList.add('tie');
  } else if (outcome === 'win') {
    resultTextEl.textContent = `${capitalize(player)} beats ${computer} — you win!`;
    resultTextEl.classList.add('win');
    spawnConfetti();
  } else {
    resultTextEl.textContent = `${capitalize(computer)} beats ${player} — you lose!`;
    resultTextEl.classList.add('lose');
  }

  void resultTextEl.offsetWidth;
  resultTextEl.classList.add('stamp');
}

function playRound(playerChoice, btn) {
  const computerChoice = getComputerChoice();
  const outcome = decideWinner(playerChoice, computerChoice);

  choiceButtons.forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');
  retrigger(btn, 'punch');

  playerPickEl.textContent = EMOJI[playerChoice];
  computerPickEl.textContent = EMOJI[computerChoice];

  [playerPickEl, computerPickEl].forEach((el) => retrigger(el, 'reveal'));

  if (outcome === 'win') {
    playerScore += 1;
    flipScore(playerScoreWrap, playerScore);
  } else if (outcome === 'lose') {
    computerScore += 1;
    flipScore(computerScoreWrap, computerScore);
  }

  updateResultText(outcome, playerChoice, computerChoice);

  round += 1;
  roundNumberEl.textContent = round;
}

function resetScores() {
  playerScore = 0;
  computerScore = 0;
  round = 1;

  flipScore(playerScoreWrap, playerScore);
  flipScore(computerScoreWrap, computerScore);
  roundNumberEl.textContent = round;

  playerPickEl.textContent = '?';
  computerPickEl.textContent = '?';
  playerPickEl.classList.remove('reveal');
  computerPickEl.classList.remove('reveal');

  choiceButtons.forEach((b) => b.classList.remove('selected'));

  resultTextEl.textContent = 'Make your move!';
  resultTextEl.classList.remove('win', 'lose', 'tie', 'stamp');
}

choiceButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    playRound(btn.dataset.choice, btn);
  });
});

resetBtn.addEventListener('click', resetScores);