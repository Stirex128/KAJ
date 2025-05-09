// Save and load game state
function saveGameState() {
    const stateToSave = {
        gold: gameState.gold || 0,
        score: gameState.score || 0,
        difficulty: gameState.difficulty || 'medium'
    };

    // Only add hero data if a hero exists
    if (gameState.hero) {
        stateToSave.hero = {
            name: gameState.hero.name,
            displayName: gameState.hero.displayName || gameState.hero.name,
            health: gameState.hero.health,
            attackPower: gameState.hero.attackPower,
            specialAttribute: gameState.hero.specialAttribute,
            specialValue: gameState.hero.specialValue,
            sprite: gameState.hero.sprite
        };

        // Only save position if it exists
        if (heroPosition) {
            stateToSave.heroPosition = heroPosition;
        }
    }

    console.log("Saving game state:", stateToSave);
    setCookie('gameState', JSON.stringify(stateToSave), 365);
}

let gameLoopId = null; // Store reference to the game loop

function loadGameState() {
    const savedState = getCookie('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log("Loading game state:", parsedState);

        // Cancel any existing game loop first
        if (gameLoopId !== null) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }

        gameState.difficulty = parsedState.difficulty || 'medium';
        if (parsedState.hero) {
            // Initialize hero object
            gameState.hero = new Hero(
                parsedState.hero.name,
                parsedState.hero.health,
                parsedState.hero.attackPower,
                parsedState.hero.specialAttribute,
                parsedState.hero.specialValue,
                parsedState.hero.sprite
            );
            gameState.hero.displayName = parsedState.hero.displayName || parsedState.hero.name;
            // Synchronize with window.gameState
            window.gameState.hero = gameState.hero;
            document.getElementById('hero-selection').classList.add('hidden');
            document.getElementById('game-area').classList.remove('hidden');

            // Set up hero image
            const gameHeroImage = document.getElementById('game-hero-image');
            gameHeroImage.src = gameState.hero.sprite;
            gameHeroImage.style.width = '100px';
            gameHeroImage.style.height = 'auto';
            gameHeroImage.style.imageRendering = 'pixelated';
            gameHeroImage.style.position = 'absolute';

            // Use the centralized function to create/update the hero name label
            const heroContainer = document.querySelector('.hero-container');
            if (heroContainer) {
                createOrUpdateHeroNameLabel(heroContainer, gameState.hero.displayName);
            }
            if (document.getElementById(`${gameState.difficulty}-btn`)) {
                selectDifficulty(gameState.difficulty);
            }
            // Restore hero position
            if (parsedState.heroPosition) {
                heroPosition = parsedState.heroPosition;
                updateHeroPosition();
            }

            // Restore other values
            gameState.gold = parsedState.gold || 0;
            gameState.score = parsedState.score || 0;
            updateUI();
            canMove = true;

            // Initialize enemies and start game loop after loading game
            initializeEnemies(); // This will start a new game loop
            // Zakážeme scrollování po načtení hry
            toggleScroll(false);

        }
    }
}




