const matrixCanvas = document.getElementById('matrix-bg');
const matrixCtx = matrixCanvas.getContext('2d');

// Ajusta o tamanho do canvas para cobrir toda a tela
function resizeCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Caracteres para o efeito Matrix
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%".split("");

const fontSize = 14;
const columns = matrixCanvas.width / fontSize;

// Array para manter o controle da posição Y de cada coluna
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    // Cria um efeito de fade
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    // Define a cor e fonte dos caracteres
    matrixCtx.fillStyle = '#0F0';
    matrixCtx.font = fontSize + 'px monospace';

    // Loop para desenhar os caracteres
    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Anima o efeito Matrix
setInterval(drawMatrix, 33); 