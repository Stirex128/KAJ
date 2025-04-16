// Game state
const gameState = {
    hero: null,
    units: [],
    enemyHealth: 100,
    gold: 0,
    heroPosition: { x: window.innerWidth / 2, y: 100 },
    // Add this to your gameState
    lastAttackTime: 0, // Timestamp of the last attack
    attackCooldown: 500, // Cooldown in milliseconds
};