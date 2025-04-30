// Fantasy Clicker Game - JavaScript Logic


if (!window.gameState) window.gameState = {};
if (!window.gameState.enemies) window.gameState.enemies = [];

// Make local gameState.enemies reference the same array as window.gameState.enemies
gameState.enemies = window.gameState.enemies;

let canMove = false;

const difficultySettings = {
    easy: {
        spawnRate: 0.0005,
        maxEnemies: 3,
        enemyMultiplier: 1.0
    },
    medium: {
        spawnRate: 0.001,
        maxEnemies: 5,
        enemyMultiplier: 1.2
    },
    hard: {
        spawnRate: 0.002,
        maxEnemies: 8,
        enemyMultiplier: 1.5
    }
};

// Default to medium difficulty if not set
if (!gameState.difficulty) {
    gameState.difficulty = 'medium';
}

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

    // Remove any existing form first
    const existingForm = document.getElementById('hero-name-form');
    if (existingForm) {
        existingForm.parentNode.removeChild(existingForm);
    }

    // Create a new form and add it to the current hero stats container
    const formHtml = `
        <form id="hero-name-form" class="name-form">
            <label for="hero-name-input">Enter your hero's name:</label>
            <input type="text" id="hero-name-input" placeholder="Enter name..." maxlength="20" autofocus required>
        </form>
    `;
    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHtml;
    document.getElementById(type === 'warrior' ? 'warrior-stats' : 'mage-stats').appendChild(formContainer);

    document.getElementById('hero-name-input').focus();
    document.getElementById('confirm-btn').classList.remove('hidden');
}

function handleEnemyDeath(enemy) {
    // Remove enemy element from the DOM
    if (enemy.element && enemy.element.parentNode) {
        enemy.element.parentNode.removeChild(enemy.element);
    }

    // Update game state
    gameState.gold += Math.floor(Math.random() * 5) + 3;
    gameState.score += enemy.points;

    // Remove from enemies array
    const index = window.gameState.enemies.indexOf(enemy);
    if (index > -1) {
        window.gameState.enemies.splice(index, 1);
    }
}

function confirmSelection() {
    // Get the hero name from the input
    const nameInput = document.getElementById('hero-name-input');
    const heroName = nameInput ? nameInput.value.trim() : '';

    // Set a default name if empty
    gameState.hero.displayName = heroName || gameState.hero.name;

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
    const heroContainer = document.querySelector('.hero-container');

    // Use the centralized function to create/update the hero name label
    if (heroContainer) {
        createOrUpdateHeroNameLabel(heroContainer, gameState.hero.displayName);
    }

    canMove = true;
    updateHeroPosition();
    saveGameState();

    // Initialize enemies and start game loop after hero selection
    initializeEnemies();
}

// Attack function
function attackEnemy() {
    if (!gameState.hero) return;

    console.log(`Attacking with Q - Enemies count: ${window.gameState.enemies.length}`);

    // Define attack range based on hero type
    let attackRange = gameState.hero.name === 'Mage' ? 300 : 100;

    if (gameState.hero.name === 'Warrior') {
        // For Warrior: Attack all enemies within range
        let enemiesInRange = [];

        for (const enemy of window.gameState.enemies) {
            const dx = enemy.position.x - heroPosition.x;
            const dy = enemy.position.y - heroPosition.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < attackRange) {
                enemiesInRange.push(enemy);
            }
        }

        if (enemiesInRange.length > 0) {
            console.log(`Warrior attacking ${enemiesInRange.length} enemies in range`);

            // Apply damage to all enemies in range
            for (const enemy of enemiesInRange) {
                enemy.health -= gameState.hero.attackPower;

                // Visual feedback for the attack
                if (enemy.element) {
                    enemy.element.classList.add('attacking');
                    setTimeout(() => {
                        if (enemy.element) {
                            enemy.element.classList.remove('attacking');
                        }
                    }, 200);
                }

                // Update enemy health bar
                enemy.updateHealthBar();

                // Check if enemy died from the attack
                if (enemy.health <= 0) {
                    handleEnemyDeath(enemy);
                }
            }

            // Show sword swing animation
            animateSwordSwing();

            // Update UI to show new gold amount
            updateUI();
            return true; // Attack was successful
        } else {
            console.log("No enemies in Warrior's attack range");
            return false; // No attack performed
        }
    } else {
        // For Mage: Attack only the closest enemy but with longer range
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (const enemy of window.gameState.enemies) {
            const dx = enemy.position.x - heroPosition.x;
            const dy = enemy.position.y - heroPosition.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        if (closestEnemy && closestDistance < attackRange) {
            console.log(`Mage attacking ${closestEnemy.type} at distance ${closestDistance}`);
            closestEnemy.health -= gameState.hero.attackPower;

            // Show magic orb animation
            animateMagicOrb(closestEnemy);

            // Visual feedback for the attack
            if (closestEnemy.element) {
                closestEnemy.element.classList.add('attacking');
                setTimeout(() => {
                    if (closestEnemy.element) {
                        closestEnemy.element.classList.remove('attacking');
                    }
                }, 200);
            }

            // Update enemy health bar
            closestEnemy.updateHealthBar();

            // Check if enemy died from the attack
            if (closestEnemy.health <= 0) {
                handleEnemyDeath(closestEnemy);
            }

            // Update UI to show new gold amount
            updateUI();
            return true; // Attack was successful
        } else {
            console.log(`No enemy in Mage's range to attack! Closest distance: ${closestDistance}`);
            return false; // No attack performed
        }
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
                    gameState.gold += Math.floor(Math.random() * 5) + 3;
                    gameState.score += enemy.points;// Give gold for killing
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

    // Choose appropriate attack animation based on hero type
    if (gameState.hero && gameState.hero.name === 'Mage') {
        // Find the closest enemy for the magic orb
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (const enemy of window.gameState.enemies) {
            const dx = enemy.position.x - heroPosition.x;
            const dy = enemy.position.y - heroPosition.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        if (closestEnemy) {
            animateMagicOrb(closestEnemy);
        }
    } else {
        animateSwordSwing();
    }
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

function selectDifficulty(difficulty) {
    // Update game state
    gameState.difficulty = difficulty;

    // Update UI
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`${difficulty}-btn`).classList.add('selected');

    // Update description
    const descriptions = {
        easy: "Easy: Fewer enemies with slower spawn rate",
        medium: "Medium: Normal enemy spawn rate and strength",
        hard: "Hard: More enemies that spawn quickly and hit harder"
    };
    document.getElementById('difficulty-description').textContent = descriptions[difficulty];

    // Save the state
    saveGameState();
}


// Inicializace pozice postavy
updateHeroPosition();

// Initial UI update
updateUI();
