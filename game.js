const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const scoreElement = document.getElementById('score');

let gridSize;
let tileCount;
let snake = [];
let food = {};
let direction = 'right';
let gameInterval;
let score = 0;
let gameSpeed = 150;
let isGameRunning = false;

// Função para redimensionar o canvas e recalcular as dimensões do jogo
function resizeCanvas() {
    const container = canvas.parentElement;
    const size = container.offsetWidth;
    canvas.width = size;
    canvas.height = size;
    gridSize = Math.floor(size / 20); // 20x20 células
    tileCount = Math.floor(size / gridSize);
    
    // Se o jogo estiver rodando, redesenha tudo
    if (isGameRunning) {
        drawFood();
        drawSnake();
    }
}

// Inicializar o jogo
function initGame() {
    // Posicionar a cobra no centro
    const centerTile = Math.floor(tileCount / 2);
    snake = [
        { x: centerTile, y: centerTile },
        { x: centerTile - 1, y: centerTile },
        { x: centerTile - 2, y: centerTile }
    ];
    score = 0;
    direction = 'right';
    scoreElement.textContent = `Pontuação: ${score}`;
    createFood();
}

// Criar comida em posição aleatória
function createFood() {
    food = {
        x: Math.floor(Math.random() * (tileCount - 2)) + 1,
        y: Math.floor(Math.random() * (tileCount - 2)) + 1
    };
    // Verificar se a comida não está sobre a cobra
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            createFood();
        }
    });
}

// Desenhar a cobra
function drawSnake() {
    snake.forEach((segment, index) => {
        // Criar gradiente para a cobra
        const snakeGradient = ctx.createLinearGradient(
            segment.x * gridSize,
            segment.y * gridSize,
            (segment.x + 1) * gridSize,
            (segment.y + 1) * gridSize
        );
        snakeGradient.addColorStop(0, '#4CAF50');
        snakeGradient.addColorStop(1, '#81C784');

        ctx.fillStyle = index === 0 ? '#388E3C' : snakeGradient;
        ctx.beginPath();
        ctx.roundRect(
            segment.x * gridSize + 2,
            segment.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4,
            8
        );
        ctx.fill();

        // Desenhar olhos na cabeça da cobra
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = gridSize / 8;
            let eyeX1, eyeX2, eyeY1, eyeY2;

            switch(direction) {
                case 'up':
                    eyeX1 = segment.x * gridSize + gridSize / 3;
                    eyeX2 = segment.x * gridSize + (gridSize * 2/3);
                    eyeY1 = eyeY2 = segment.y * gridSize + gridSize / 3;
                    break;
                case 'down':
                    eyeX1 = segment.x * gridSize + gridSize / 3;
                    eyeX2 = segment.x * gridSize + (gridSize * 2/3);
                    eyeY1 = eyeY2 = segment.y * gridSize + (gridSize * 2/3);
                    break;
                case 'left':
                    eyeX1 = eyeX2 = segment.x * gridSize + gridSize / 3;
                    eyeY1 = segment.y * gridSize + gridSize / 3;
                    eyeY2 = segment.y * gridSize + (gridSize * 2/3);
                    break;
                case 'right':
                    eyeX1 = eyeX2 = segment.x * gridSize + (gridSize * 2/3);
                    eyeY1 = segment.y * gridSize + gridSize / 3;
                    eyeY2 = segment.y * gridSize + (gridSize * 2/3);
                    break;
            }
            
            ctx.beginPath();
            ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
            ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

// Desenhar comida
function drawFood() {
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2,
        food.y * gridSize + gridSize/2,
        gridSize/2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Mover a cobra
function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Verificar colisão com as paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Verificar colisão com o próprio corpo
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Verificar se comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score = snake.length * 10;
        scoreElement.textContent = `Pontuação: ${score}`;
        createFood();
        if (snake.length % 5 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

// Loop principal do jogo
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawFood();
    drawSnake();
}

// Game Over
function gameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = `${canvas.width/15}px "Bubblegum Sans"`;
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
    ctx.font = `${canvas.width/25}px "Bubblegum Sans"`;
    ctx.fillText(`Pontuação Final: ${score}`, canvas.width/2, canvas.height/2 + canvas.width/15);
    isGameRunning = false;
    startBtn.textContent = 'Jogar Novamente! 🎮';
    startBtn.style.display = 'block';
}

// Controles de teclado
document.addEventListener('keydown', (event) => {
    if (!isGameRunning) return;
    
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Adicionar controles touch
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

function addTouchControls() {
    upBtn.addEventListener('click', () => {
        if (direction !== 'down' && isGameRunning) direction = 'up';
    });
    
    downBtn.addEventListener('click', () => {
        if (direction !== 'up' && isGameRunning) direction = 'down';
    });
    
    leftBtn.addEventListener('click', () => {
        if (direction !== 'right' && isGameRunning) direction = 'left';
    });
    
    rightBtn.addEventListener('click', () => {
        if (direction !== 'left' && isGameRunning) direction = 'right';
    });
}

// Inicialização
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
addTouchControls();

// Iniciar jogo
startBtn.addEventListener('click', () => {
    if (isGameRunning) return;
    
    isGameRunning = true;
    startBtn.style.display = 'none';
    initGame();
    gameInterval = setInterval(gameLoop, gameSpeed);
}); 