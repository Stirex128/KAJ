function updateHeroPosition() {
    if (!canMove) return;

    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        heroContainer.style.left = `${heroPosition.x}px`;
        heroContainer.style.top = `${heroPosition.y}px`;

        // Synchronize position with window.gameState for enemy attacks
        if (!window.gameState) window.gameState = {};
        window.gameState.heroPosition = heroPosition; // Ensure this is updated
    }
}
function updateUI() {
    const enemyHealthElement = document.getElementById('enemy-health');
    if (enemyHealthElement) {
        enemyHealthElement.innerText = `Enemy Health: ${gameState.enemyHealth}`;
    }

    const goldAmountElement = document.getElementById('gold-amount');
    if (goldAmountElement) {
        goldAmountElement.textContent = gameState.gold;
    }

    // Add score display update
    const scoreAmountElement = document.getElementById('score-amount');
    if (scoreAmountElement) {
        scoreAmountElement.textContent = gameState.score || 0;
    }

    const unitsCountElement = document.getElementById('units-count');
    if (unitsCountElement) {
        unitsCountElement.innerText = `Units: ${gameState.units.length}`;
    }

    updateHPBar();
    saveGameState();
}

function updateHPBar() {
    const fillRect = document.getElementById('hp-bar-fill');
    if (!gameState.hero || !fillRect) return;

    // maximální HP podle typu hrdiny
    const maxHP = gameState.hero.name === 'Warrior' ? 120 : 80;
    const currentHP = gameState.hero.health;
    // spočítáme procenta (0–100)
    const pct = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));

    fillRect.setAttribute('width', (pct / 100) * 120);
}

function updateHeroHealthBar(currentHealth) {
    const fillRect = document.getElementById('hp-bar-fill');
    if (!gameState.hero || !fillRect) return;

    const maxHP = gameState.hero.name === 'Warrior' ? 120 : 80;
    const pct = Math.max(0, Math.min(100, (currentHealth / maxHP) * 100));
    fillRect.setAttribute('width', (pct / 100) * 120);
}

function createOrUpdateHeroNameLabel(container, name) {
    // Remove any existing label first
    const existingLabel = document.getElementById('hero-name-label');
    if (existingLabel) existingLabel.remove();

    // Create new label
    const heroNameLabel = document.createElement('figcaption');
    heroNameLabel.id = 'hero-name-label';
    heroNameLabel.textContent = name;

    // Apply consistent styling
    heroNameLabel.style.position = 'absolute';
    heroNameLabel.style.bottom = '-120px';
    heroNameLabel.style.left = '10px';
    heroNameLabel.style.width = '100%';
    heroNameLabel.style.textAlign = 'center';
    heroNameLabel.style.color = 'black';
    heroNameLabel.style.textShadow = '1px 1px 2px black';
    heroNameLabel.style.fontSize = '14px';
    heroNameLabel.style.fontWeight = 'bold';

    // Add to container
    if (container) {
        container.appendChild(heroNameLabel);
    }

    return heroNameLabel;
}