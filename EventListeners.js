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

document.getElementById('menu-btn').addEventListener('click', () => {
    document.getElementById('menu-panel').classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    const menuBtn = document.getElementById('menu-btn');
    const menuPanel = document.getElementById('menu-panel');

    if (!menuBtn.contains(event.target) && !menuPanel.contains(event.target)) {
        menuPanel.classList.add('hidden');
    }
});