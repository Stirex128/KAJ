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
        gold: gameState.gold,
        heroPosition: heroPosition
    };
    console.log("Saving game state:", stateToSave);
    setCookie('gameState', JSON.stringify(stateToSave), 365); // Uložit na rok
}
function loadGameState() {
    const savedState = getCookie('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        console.log("Loading game state:", parsedState);
        if (parsedState.hero) {
            // Inicializace hrdiny
            gameState.hero = new Hero(
                parsedState.hero.name,
                parsedState.hero.health,
                parsedState.hero.attackPower,
                parsedState.hero.specialAttribute,
                parsedState.hero.specialValue,
                parsedState.hero.sprite
            );

            // Synchronizace s window.gameState
            window.gameState.hero = gameState.hero;

            // Přepnutí do herní oblasti
            document.getElementById('hero-selection').classList.add('hidden');
            document.getElementById('game-area').classList.remove('hidden');

            // Nastavení obrázku hrdiny
            const gameHeroImage = document.getElementById('game-hero-image');
            gameHeroImage.src = gameState.hero.sprite;
            gameHeroImage.style.width = '100px';
            gameHeroImage.style.height = 'auto';
            gameHeroImage.style.imageRendering = 'pixelated';
            gameHeroImage.style.position = 'absolute';

            // Obnovení pozice hrdiny
            if (parsedState.heroPosition) {
                heroPosition = parsedState.heroPosition;
                window.gameState.heroPosition = heroPosition; // Synchronizace pozice
                updateHeroPosition();
            }

            // Obnovení dalších hodnot
            gameState.units = parsedState.units;
            gameState.enemyHealth = parsedState.enemyHealth;
            gameState.gold = parsedState.gold;

            canMove = true;
            updateUI();
        }
    }
}