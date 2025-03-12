// Setup event listeners

document.getElementById('warrior-btn').addEventListener('click', () => chooseHero('warrior'));
document.getElementById('mage-btn').addEventListener('click', () => chooseHero('mage'));
document.getElementById('confirm-btn').addEventListener('click', confirmSelection);
//document.getElementById('attack-btn').addEventListener('click', attackEnemy);
//document.getElementById('special-btn').addEventListener('click', attackEnemy);
document.getElementById('buy-unit-btn').addEventListener('click', () => {
    if (gameState.gold >= 10) {
        gameState.gold -= 10;
        gameState.units.push({});
        updateUI();
    }
});document.getElementById('warrior-btn').addEventListener('click', () => {document.getElementById('hero-image').src = 'Tiles/tile_0097.png';
});
document.addEventListener('DOMContentLoaded', (event) => {
    loadGameState();
});
document.getElementById('restart-btn').addEventListener('click', () => {
    deleteCookie('gameState');
    location.reload();
});
document.getElementById('mage-btn').addEventListener('click', () => {document.getElementById('hero-image').src = 'Tiles/tile_0084.png';
});

document.addEventListener('keydown', (event) => {
    if (!canMove) return;

    switch (event.key) {
        case 'w':
            heroPosition.y -= moveSpeed;
            break;
        case 's':
            heroPosition.y += moveSpeed;
            break;
        case 'a':
            heroPosition.x -= moveSpeed;
            break;
        case 'd':
            heroPosition.x += moveSpeed;
            break;
        case 'q':
            attackEnemy(); // normální útok
            break;
        case 'e':
            attackEnemy(); // speciální útok
            break;
    }
    updateHeroPosition();
    saveGameState(); // Uložit po každém pohybu
});

document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('settings-menu').classList.toggle('hidden');
});

// Zavření menu kliknutím mimo
document.addEventListener('click', (event) => {
    const settingsContainer = document.getElementById('settings-container');
    const settingsMenu = document.getElementById('settings-menu');

    if (!settingsContainer.contains(event.target)) {
        settingsMenu.classList.add('hidden');
    }
});