// Fantasy Clicker Game - JavaScript Logic

// Game state
const gameState = {
    hero: null,
    units: [],
    enemyHealth: 100,
    gold: 0,
    heroPosition: { x: window.innerWidth / 2, y: 100 }
};

let canMove = false;

// Hero class
class Hero {
    constructor(name, health, attackPower, specialAttribute, specialValue, sprite) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
        this.specialAttribute = specialAttribute;
        this.specialValue = specialValue;
        this.sprite = sprite;
    }

    attack() {
        gameState.enemyHealth -= this.attackPower;
        animateAttack();
        updateUI();
    }
}

// Choose hero
function chooseHero(type) {
    document.getElementById('warrior-stats').classList.add('hidden');
    document.getElementById('mage-stats').classList.add('hidden');
    document.getElementById('hero-image').src = '';

    if (type === 'warrior') {
        gameState.hero = new Hero('Warrior', 120, 10, 'Defense', 8, 'Tiles/tile_0097.png');
        document.getElementById('warrior-stats').classList.remove('hidden');
        document.getElementById('hero-image').src = gameState.hero.sprite;
        document.getElementById('hero-image').style.width = '100px';
        document.getElementById('hero-image').style.height = 'auto';
        document.getElementById('hero-image').style.imageRendering = 'pixelated';
    } else if (type === 'mage') {
        gameState.hero = new Hero('Mage', 80, 5, 'Magic', 40, 'Tiles/tile_0084.png');
        document.getElementById('mage-stats').classList.remove('hidden');
        document.getElementById('hero-image').src = gameState.hero.sprite;
        document.getElementById('hero-image').style.width = '100px';
        document.getElementById('hero-image').style.height = 'auto';
        document.getElementById('hero-image').style.imageRendering = 'pixelated';
    }
    document.getElementById('confirm-btn').classList.remove('hidden');
}

// Confirm hero selection
function confirmSelection() {
    document.getElementById('hero-selection').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    const gameHeroImage = document.getElementById('game-hero-image');
    gameHeroImage.src = gameState.hero.sprite;
    gameHeroImage.style.width = '100px';
    gameHeroImage.style.height = 'auto';
    gameHeroImage.style.imageRendering = 'pixelated';
    gameHeroImage.style.position = 'absolute';
    const hpBar = document.getElementById('hp-bar');
    if (hpBar) {
        hpBar.style.display = 'none';
        setTimeout(() => {
            hpBar.style.display = 'block';
        }, 100);
    }
    canMove = true;
    updateHeroPosition();
    saveGameState();
}

// Attack function
function attackEnemy() {
    if (gameState.hero) {
        gameState.hero.attack();
    }
}

// Animate attack
function animateAttack() {
    let sprite = document.getElementById('hero-image');
    sprite.style.animation = 'none';  // Restart animace
    void sprite.offsetWidth;  // Reset animace trik
    sprite.style.animation = 'idle-animation 1s steps(6) infinite';
}

// Pozice postavy
let heroPosition = { x: window.innerWidth / 2, y: 100 }; // Startovní pozice
const moveSpeed = 10; // Jak rychle se postava pohybuje

window.onload = function() {
    const hpBar = document.querySelector('.hp-bar');
    if (hpBar) {
        hpBar.style.display = 'none';
        setTimeout(() => {
            hpBar.style.display = 'block';
        }, 100);
    }
}
// Inicializace pozice postavy
updateHeroPosition();

// Initial UI update
updateUI();
