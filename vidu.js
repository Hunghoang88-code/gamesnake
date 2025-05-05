const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const gameOverBox = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const levelSelect = document.getElementById('difficulty');
const customSpeedInput = document.getElementById('custom-speed');
const startBtn = document.getElementById('start-btn');
const scoreBoard = document.getElementById('score-board');

const rows = 20;
const cols = 20;

let snake, food, dx, dy, score, level, speed, interval;

levelSelect.addEventListener('change', () => {
  if (levelSelect.value === 'custom') {
    customSpeedInput.classList.remove('hidden');
  } else {
    customSpeedInput.classList.add('hidden');
  }
});

startBtn.addEventListener('click', () => {
  setDifficulty();
  startGame();
});

function setDifficulty() {
  const diff = levelSelect.value;
  if (diff === 'easy') speed = 200;
  else if (diff === 'medium') speed = 120;
  else if (diff === 'hard') speed = 80;
  else if (diff === 'custom') {
    let customSpeed = parseInt(customSpeedInput.value);
    if (isNaN(customSpeed) || customSpeed < 30 || customSpeed > 500) {
      alert("Vui lòng nhập tốc độ hợp lệ (30-500 ms)");
      speed = 150;
    } else {
      speed = customSpeed;
    }
  }
}

function startGame() {
  snake = [{x: 10, y: 10}];
  food = {x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows)};
  dx = 0;
  dy = 0;
  score = 0;
  level = 1;

  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  gameOverBox.classList.add('hidden');
  scoreBoard.classList.remove('hidden');
  board.classList.remove('hidden');

  clearInterval(interval);
  interval = setInterval(gameLoop, speed);
  render();
}

function moveSnake() {
  if (dx === 0 && dy === 0) return;

  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
      snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    gameOverBox.classList.remove('hidden');
    clearInterval(interval);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
    score += 10;
    scoreDisplay.textContent = score;

    if (score % 50 === 0) {
      level++;
      levelDisplay.textContent = level;
      if (speed > 40) {
        speed -= 10;
        clearInterval(interval);
        interval = setInterval(gameLoop, speed);
      }
    }

  } else {
    snake.pop();
  }
}

function gameLoop() {
  moveSnake();
  render();
}

function render() {
  board.innerHTML = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (snake.some(segment => segment.x === x && segment.y === y)) {
        cell.classList.add('snake');
      }
      if (food.x === x && food.y === y) {
        cell.classList.add('food');
      }
      board.appendChild(cell);
    }
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -1;
  }
  if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = 1;
  }
  if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -1; dy = 0;
  }
  if (e.key === 'ArrowRight' && dx === 0) {
    dx = 1; dy = 0;
  }
});

restartBtn.addEventListener('click', startGame);
