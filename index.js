// Fantasy Clicker Game - JavaScript Logic
// Synchronize gameState with window.gameState


if (!window.gameState) window.gameState = {};
if (!window.gameState.enemies) window.gameState.enemies = [];

// Make local gameState.enemies reference the same array as window.gameState.enemies
gameState.enemies = window.gameState.enemies;

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
    window.gameState.hero = gameState.hero;
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
// Update the attackEnemy function in index.js
function attackEnemy() {
    if (!gameState.hero) return;

    // Find the closest enemy
    let closestEnemy = null;
    let closestDistance = Infinity;

    // Use gameState.enemies which is now properly initialized
    gameState.enemies.forEach(enemy => {
        const dx = enemy.position.x - heroPosition.x;
        const dy = enemy.position.y - heroPosition.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
        }
    });

    // Attack the closest enemy if within range (80px)
    if (closestEnemy && closestDistance < 80) {
        // Regular attack with Q
        closestEnemy.health -= gameState.hero.attackPower;
        console.log(`Hero attacks! ${closestEnemy.type} has ${closestEnemy.health}/${closestEnemy.maxHealth} health left.`);

        // Update enemy health bar
        closestEnemy.updateHealthBar();

        // Check if enemy died from the attack
        if (closestEnemy.health <= 0) {
            console.log(`${closestEnemy.type} was killed!`);
            if (closestEnemy.element && closestEnemy.element.parentNode) {
                closestEnemy.element.parentNode.removeChild(closestEnemy.element);
            }
            gameState.gold += Math.floor(Math.random() * 5) + 3;
            const index = gameState.enemies.indexOf(closestEnemy);
            if (index > -1) {
                gameState.enemies.splice(index, 1);
            }
        }

        // Update UI to show new gold amount
        updateUI();
    } else {
        console.log("No enemy in range to attack!");
    }
}

// Add a special attack function for the E key
function specialAttack() {
    if (!gameState.hero) return;

    // Check hero's special attribute
    const specialPower = gameState.hero.specialValue || 0;

    // Find all enemies within a larger radius (120px for special attack)
    const enemiesInRange = [];

    if (window.gameState.enemies) {
        window.gameState.enemies.forEach(enemy => {
            const dx = enemy.position.x - heroPosition.x;
            const dy = enemy.position.y - heroPosition.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < 120) { // Larger range for special attack
                enemiesInRange.push(enemy);
            }
        });

        if (enemiesInRange.length > 0) {
            // Apply special attack damage to all enemies in range
            let killedCount = 0;

            enemiesInRange.forEach(enemy => {
                enemy.health -= specialPower;
                console.log(`Hero uses special attack! ${enemy.type} has ${enemy.health}/${enemy.maxHealth} health left.`);

                // Update enemy health bar
                enemy.updateHealthBar();

                // Check if enemy died
                if (enemy.health <= 0) {
                    console.log(`${enemy.type} was killed by special attack!`);
                    if (enemy.element && enemy.element.parentNode) {
                        enemy.element.parentNode.removeChild(enemy.element);
                    }
                    gameState.gold += Math.floor(Math.random() * 5) + 3; // Give gold for killing
                    killedCount++;

                    const index = window.gameState.enemies.indexOf(enemy);
                    if (index > -1) {
                        window.gameState.enemies.splice(index, 1);
                    }
                }
            });

            if (killedCount > 0) {
                console.log(`Special attack killed ${killedCount} enemies!`);
            }

            // Update UI to show new gold amount
            updateUI();
        } else {
            console.log("No enemies in range for special attack!");
        }
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
const moveSpeed = 5; // Jak rychle se postava pohybuje

window.onload = function() {
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // Set volume (0.0 to 1.0)
        backgroundMusic.play().catch(err => {
            console.error("Failed to play background music:", err);
        });
    }

    const hpBar = document.querySelector('.hp-bar');
    if (hpBar) {
        hpBar.style.display = 'none';
        setTimeout(() => {
            hpBar.style.display = 'block';
        }, 100);
    }
};




// Inicializace pozice postavy
updateHeroPosition();

// Initial UI update
updateUI();
