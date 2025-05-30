class Enemy {
    constructor(type, health, damage, speed, sprite, points) {
        this.type = type;
        this.health = health;
        this.maxHealth = health;
        this.damage = damage;
        this.speed = speed;
        this.sprite = sprite;
        this.points = points;
        this.position = {
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 300) + 150
        };
        this.direction = Math.random() * Math.PI * 2;
        this.element = null;
        this.healthBarImg = null;
        this.lastAttackTime = 0;
    }

    move() {
        // Ensure movement happens every frame
        if (Math.random() < 0.02) {
            this.direction += (Math.random() - 0.5) * Math.PI/2;
        }
        this.position.x += Math.cos(this.direction) * this.speed;
        this.position.y += Math.sin(this.direction) * this.speed;

        // Improved boundary checking
        const margin = 10;
        if (this.position.x < margin || this.position.x > window.innerWidth - 64 - margin) {
            this.direction = Math.PI - this.direction;
            // Ensure enemy stays within bounds
            this.position.x = Math.max(margin, Math.min(window.innerWidth - 64 - margin, this.position.x));
        }
        if (this.position.y < 100 || this.position.y > window.innerHeight - 64 - margin) {
            this.direction = -this.direction;
            // Ensure enemy stays within bounds
            this.position.y = Math.max(100, Math.min(window.innerHeight - 64 - margin, this.position.y));
        }

        // Aktualizace pozice na obrazovce
        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
            this.element.style.top = `${this.position.y}px`;
        }
    }
    attack(hero) {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime < 1000) return; // Attack cooldown

        const heroPos = window.gameState.heroPosition; // Ensure hero position is synchronized
        if (!heroPos) return;

        const dx = this.position.x - heroPos.x;
        const dy = this.position.y - heroPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) { // Attack range
            if (window.gameState.hero) {
                window.gameState.hero.health -= this.damage;
                this.lastAttackTime = currentTime;
                console.log(`${this.type} attacks! Hero has ${window.gameState.hero.health} health left.`);

                updateHeroHealthBar(window.gameState.hero.health);

                if (window.gameState.hero.health <= 0) {
                    console.log("Hero has been defeated!");
                    alert("Game Over! Your hero has been defeated.");
                    deleteCookie('gameState');
                    location.reload();
                }

            }
        }
    }
    updateHealthBar() {
        if (this.healthBarImg) {
            const healthPercent = (this.health / this.maxHealth) * 100;

            // Změna obrázku health baru podle procenta zdraví
            if (healthPercent > 80) {
                this.healthBarImg.src = 'Myimages/Full.png';
            } else if (healthPercent > 60) {
                this.healthBarImg.src = 'Myimages/4.png';
            } else if (healthPercent > 40) {
                this.healthBarImg.src = 'Myimages/3.png';
            } else if (healthPercent > 20) {
                this.healthBarImg.src = 'Myimages/2.png';
            } else if (healthPercent > 0) {
                this.healthBarImg.src = 'Myimages/1.png';
            } else {
                this.healthBarImg.src = 'Myimages/null.png';
            }
        }
    }
}

// Inicializace pole pro nepřátele, pokud neexistuje
if (!window.gameState) {
    window.gameState = {};
}
if (!window.gameState.enemies) {
    window.gameState.enemies = [];
}
// Funkce pro vytvoření nepřítele
function spawnEnemy() {
    console.log("Vytvářím nepřítele...");
    const types = [
        { type: 'Mouse', health: 30, damage: 5, speed: 1.5, sprite: 'Tiles/tile_0123.png', points: 10 },
        { type: 'Spider', health: 20, damage: 3, speed: 2.0, sprite: 'Tiles/tile_0122.png', points: 5 },
        { type: 'Ghost', health: 50, damage: 8, speed: 1.0, sprite: 'Tiles/tile_0121.png', points: 15 }
    ];

    const randomType = types[Math.floor(Math.random() * types.length)];
    const difficultyMultiplier = difficultySettings[gameState.difficulty].enemyMultiplier;
    const enemy = new Enemy(
        randomType.type,
        Math.round(randomType.health * difficultyMultiplier),
        Math.round(randomType.damage * difficultyMultiplier),
        randomType.speed,
        randomType.sprite,
        randomType.points
    );

    console.log(`Vytvořen ${enemy.type} na pozici [${enemy.position.x}, ${enemy.position.y}]`);

    // Create semantic element for enemy
    const enemyElement = document.createElement('article');
    enemyElement.className = 'enemy';
    enemyElement.style.position = 'absolute';
    enemyElement.style.left = `${enemy.position.x}px`;
    enemyElement.style.top = `${enemy.position.y}px`;
    enemyElement.style.width = '64px';
    enemyElement.style.height = '80px';
    enemyElement.style.zIndex = '100';
    // Health bar image
    const healthBarImg = document.createElement('img');
    healthBarImg.src = 'Myimages/Full.png';
    healthBarImg.style.position = 'absolute';
    healthBarImg.style.top = '-20px';
    healthBarImg.style.right = '-15px';
    healthBarImg.style.width = '50px';
    healthBarImg.style.height = 'auto';
    healthBarImg.style.zIndex = '101';
    healthBarImg.alt = `${enemy.type} health`;
    enemy.healthBarImg = healthBarImg;

    // Enemy name label using figcaption
    const enemyTypeLabel = document.createElement('figcaption');
    enemyTypeLabel.textContent = enemy.type;
    enemyTypeLabel.style.position = 'absolute';
    enemyTypeLabel.style.bottom = '-20px';
    enemyTypeLabel.style.width = '100%';
    enemyTypeLabel.style.textAlign = 'center';
    enemyTypeLabel.style.color = 'white';
    enemyTypeLabel.style.textShadow = '1px 1px 2px black';
    enemyTypeLabel.style.fontSize = '12px';

    // Enemy sprite in a figure
    const enemyFigure = document.createElement('figure');
    enemyFigure.style.margin = '0';
    enemyFigure.style.padding = '0';
    const enemySprite = document.createElement('img');
    enemySprite.src = enemy.sprite;
    enemySprite.style.width = '64px';
    enemySprite.style.height = '64px';
    enemySprite.style.imageRendering = 'pixelated';
    enemySprite.style.position = 'absolute';
    enemySprite.style.bottom = '0';
    enemySprite.style.left = '0';
    enemySprite.alt = enemy.type;

    enemyFigure.appendChild(enemySprite);
    enemyElement.appendChild(healthBarImg);
    enemyElement.appendChild(enemyFigure);
    enemyElement.appendChild(enemyTypeLabel);

    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.appendChild(enemyElement);
        console.log("Nepřítel přidán do herní plochy");
    } else {
        console.error("Herní plocha nenalezena!");
    }

    enemy.element = enemyElement;
    window.gameState.enemies.push(enemy);
    console.log(`Počet nepřátel: ${window.gameState.enemies.length}`);
}

window.canMove = true; // Flag to control movement

let loopCounter = 0;
const saveInterval = 100; // Save every 100 game loops

function gameLoop() {
    if (window.gamePaused) return;

    const currentTime = Date.now();
    // Handle movement
    if (keysPressed['w']) heroPosition.y -= moveSpeed; // Move up
    if (keysPressed['s']) heroPosition.y += moveSpeed; // Move down
    if (keysPressed['a']) heroPosition.x -= moveSpeed; // Move left
    if (keysPressed['d']) heroPosition.x += moveSpeed; // Move right
    updateHeroPosition();

    // Handle attacks with cooldown
    if (keysPressed['q'] && currentTime - gameState.lastAttackTime > gameState.attackCooldown) {
        SpecAttack();
        gameState.lastAttackTime = currentTime; // Update last attack time
    }

    if (keysPressed['e'] && currentTime - gameState.lastAttackTime > gameState.attackCooldown) {
        NormAttack();
        gameState.lastAttackTime = currentTime;
    }

    // Update enemies
    if (window.gameState.enemies) {
        window.gameState.enemies.forEach(enemy => {
            enemy.move();
            enemy.updateHealthBar();
            enemy.attack(window.gameState.hero);
        });
    }
    const difficulty = difficultySettings[gameState.difficulty || 'medium'];
    // Spawn new enemies based on difficulty
    if (Math.random() < difficulty.spawnRate && window.gameState.enemies.length < difficulty.maxEnemies) {
        spawnEnemy();
    }

    loopCounter++;
    if (loopCounter >= saveInterval) {
        saveGameState();
        loopCounter = 0;
    }

    // Store the ID for potential cancellation
    gameLoopId = requestAnimationFrame(gameLoop);
}

function initializeEnemies() {
    console.log("Inicializuji nepřátele...");
    // Clear existing enemies first to avoid duplicates
    if (window.gameState.enemies) {
        // Remove enemy elements from DOM
        window.gameState.enemies.forEach(enemy => {
            if (enemy.element) {
                enemy.element.remove();
            }
        });
        window.gameState.enemies = [];
    }

    // Cancel any existing game loop
    if (gameLoopId !== null) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }

    // Create initial enemies
    console.log("Vytvářím počáteční nepřátele");
    for (let i = 0; i < 3; i++) {
        spawnEnemy();
    }
    console.log("Spouštím herní smyčku");
    window.gameLoopActive = true;
    gameLoopId = requestAnimationFrame(gameLoop);
}

