const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let gameRunning = false;

// Música do jogo
const music = new Audio("audio.mp3");
music.loop = true;

// Imagens
const bg = new Image();
bg.src = "assets/bg1.png";

const playerImg = new Image();
playerImg.src = "assets/player.png";

const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

// Jogador
const player = {
    x: 200,
    y: canvas.height - 200,
    w: 120,
    h: 140,
    speed: 5,
    hp: 100,
    attacking: false
};

// Inimigo
const enemy = {
    x: canvas.width - 300,
    y: canvas.height - 200,
    w: 120,
    h: 140,
    speed: 2,
    hp: 50
};

let moveLeft = false;
let moveRight = false;

// MENU → JOGO
document.getElementById("playBtn").onclick = () => {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";

    if (/Android|iPhone/i.test(navigator.userAgent)) {
        document.getElementById("mobile-controls").style.display = "block";
    }

    music.play();
    gameRunning = true;
    loop();
};

// TECLAS (PC)
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") moveLeft = true;
    if (e.key === "ArrowRight") moveRight = true;
    if (e.key === " ") player.attacking = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
    if (e.key === " ") player.attacking = false;
});

// CONTROLES (CELULAR)
document.getElementById("btn-left").onmousedown = () => moveLeft = true;
document.getElementById("btn-right").onmousedown = () => moveRight = true;
document.getElementById("btn-attack").onmousedown = () => player.attacking = true;

document.addEventListener("mouseup", () => {
    moveLeft = false;
    moveRight = false;
    player.attacking = false;
});

// ATAQUE
function checkHit() {
    if (!player.attacking) return;

    const hit =
        player.x + player.w > enemy.x &&
        player.x < enemy.x + enemy.w;

    if (hit) enemy.hp -= 1;
}

// LOOP DO JOGO
function loop() {
    if (!gameRunning) return;

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Movimentação
    if (moveLeft) player.x -= player.speed;
    if (moveRight) player.x += player.speed;

    // Inimigo anda sozinho
    enemy.x -= enemy.speed;
    if (enemy.x < 0) enemy.x = canvas.width - 200;

    // Desenhar
    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.w, enemy.h);

    // Vida
    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, player.hp * 2, 20);

    // Ataque e dano
    checkHit();
    if (enemy.hp <= 0) enemy.hp = 50;

    requestAnimationFrame(loop);
}