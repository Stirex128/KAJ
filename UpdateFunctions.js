// Funkce pro aktualizaci pozice postavy
function updateHeroPosition() {
    if (!canMove) return;

    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        heroContainer.style.left = `${heroPosition.x}px`;
        heroContainer.style.top = `${heroPosition.y}px`;
    }
}

// Update UI
function updateUI() {
    document.getElementById('enemy-health').innerText = `Enemy Health: ${gameState.enemyHealth}`;
    document.getElementById('gold-amount').textContent = gameState.gold;
    document.getElementById('units-count').innerText = `Units: ${gameState.units.length}`;
    updateHPBar();
    saveGameState();
}

function updateHPBar() {
    const hpBar = document.getElementById('hp-bar');
    if (!gameState.hero) return;

    const maxHP = gameState.hero.name === 'Warrior' ? 120 : 80;
    const currentHP = gameState.hero.health;
    const hpPercentage = (currentHP / maxHP) * 100;

    let hpImage = 'Full.png';
    if (hpPercentage <= 0) {
        hpImage = 'null.png';
    } else if (hpPercentage <= 16) {
        hpImage = '1.png';
    } else if (hpPercentage <= 32) {
        hpImage = '2.png';
    } else if (hpPercentage <= 48) {
        hpImage = '3.png';
    } else if (hpPercentage <= 64) {
        hpImage = '4.png';
    } else if (hpPercentage <= 80) {
        hpImage = '5.png';
    } else if (hpPercentage <= 96) {
        hpImage = '6.png';
    }

    hpBar.src = `Myimages/${hpImage}`;
}