// Funkce pro aktualizaci pozice postavy
// Update this function in UpdateFunctions.js
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

// Update UI
function updateUI() {
    const enemyHealthElement = document.getElementById('enemy-health');
    if (enemyHealthElement) {
        enemyHealthElement.innerText = `Enemy Health: ${gameState.enemyHealth}`;
    }

    const goldAmountElement = document.getElementById('gold-amount');
    if (goldAmountElement) {
        goldAmountElement.textContent = gameState.gold;
    }

    const unitsCountElement = document.getElementById('units-count');
    if (unitsCountElement) {
        unitsCountElement.innerText = `Units: ${gameState.units.length}`;
    }

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

// Add this function to UpdateFunctions.js
function updateHeroHealthBar(currentHealth) {
    const hpBar = document.getElementById('hp-bar');
    if (!gameState.hero) return;
    console.log(`Updating hero health bar. Current health: ${currentHealth}`);
    const maxHP = gameState.hero.name === 'Warrior' ? 120 : 80;
    const hpPercentage = (currentHealth / maxHP) * 100;

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