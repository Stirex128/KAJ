// Save and load game state
function saveGameState() {
    const stateToSave = {
        hero: {
            name: gameState.hero.name,
            health: gameState.hero.health,
            attackPower: gameState.hero.attackPower,
            specialAttribute: gameState.hero.specialAttribute,
            specialValue: gameState.hero.specialValue,
            sprite: gameState.hero.sprite
        },
        units: gameState.units,
        enemyHealth: gameState.enemyHealth,
        gold: gameState.gold,
        heroPosition: heroPosition
    };
    setCookie('gameState', JSON.stringify(stateToSave), 365); // Uložit na rok
}
function loadGameState() {
    const savedState = getCookie('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);

        if (parsedState.hero) {
            gameState.hero = new Hero(
                parsedState.hero.name,
                parsedState.hero.health,
                parsedState.hero.attackPower,
                parsedState.hero.specialAttribute,
                parsedState.hero.specialValue,
                parsedState.hero.sprite
            );

            // Switch to game area
            document.getElementById('hero-selection').classList.add('hidden');
            document.getElementById('game-area').classList.remove('hidden');

            // Set hero image
            const gameHeroImage = document.getElementById('game-hero-image');
            gameHeroImage.src = gameState.hero.sprite;
            gameHeroImage.style.width = '100px';
            gameHeroImage.style.height = 'auto';
            gameHeroImage.style.imageRendering = 'pixelated';
            gameHeroImage.style.position = 'absolute';

            // Set hero position immediately
            if (parsedState.heroPosition) {
                heroPosition = parsedState.heroPosition;
                gameState.heroPosition = parsedState.heroPosition;
                updateHeroPosition();
            }

            // Restore other values
            gameState.units = parsedState.units;
            gameState.enemyHealth = parsedState.enemyHealth;
            gameState.gold = parsedState.gold;

            canMove = true;
            updateUI();
        }
    }
}