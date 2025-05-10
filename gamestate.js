const gameState = {
    hero: null,
    units: [],
    enemyHealth: 100,
    gold: 0,
    score: 0,
    heroPosition: { x: window.innerWidth / 2, y: 100 },
    lastAttackTime: 0,
    attackCooldown: 500,
};