class ShopItem {
    constructor(name, price, position, effect, image) {
        this.name = name; // Name of the item
        this.price = price; // Price of the item
        this.position = position; // Position in the shop (e.g., {row: 1, column: 2})
        this.effect = effect; // Function or description of the item's effect
        this.image = image; // Path to the item's image
    }

    // Method to apply the item's effect
    applyEffect(hero) {
        if (typeof this.effect === 'function') {
            this.effect(hero);
        } else {
            console.log(`Effect of ${this.name}: ${this.effect}`);
        }
    }
}

// Example items
const shopItems = [
    new ShopItem('Health Potion', 50, { row: 1, column: 1 }, (hero) => {
        hero.health = Math.min(hero.health + 20, 120); // Heal the hero
        console.log('Hero healed by 20 HP!');
    }, 'Tiles/tile_0115.png'),
    new ShopItem('Attack Boost', 100, { row: 1, column: 2 }, (hero) => {
        hero.attackPower += 5; // Increase hero's attack power
        console.log('Hero attack power increased by 5!');
    }, 'Tiles/tile_0116.png'),
    new ShopItem('Gold Bonus', 75, { row: 2, column: 1 }, 'Grants 50 extra gold', 'Tiles/tile_0117.png'),
];

function renderShopItems(shopItems) {
    const shopMenu = document.getElementById('shop-menu');
    shopMenu.innerHTML = '<h1>Shop Menu</h1>'; // Vymazání a přidání nadpisu
    shopMenu.style.position = 'relative'; // Relativní pozice pro absolutní umístění položek

    shopItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.style.position = 'absolute'; // Absolutní pozice
        itemElement.style.top = `${item.position.row * 100}px`; // Vertikální pozice
        itemElement.style.left = `${item.position.column * 100}px`; // Horizontální pozice
        itemElement.style.margin = '10px';

        const itemImage = document.createElement('img');
        itemImage.src = item.image;
        itemImage.alt = item.name;
        itemImage.style.width = '64px';
        itemImage.style.height = '64px';

        const itemName = document.createElement('p');
        itemName.textContent = `${item.name} - ${item.price} Gold`;

        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemName);

        itemElement.addEventListener('click', () => {
            if (gameState.gold >= item.price) {
                gameState.gold -= item.price;
                item.applyEffect(gameState.hero);
                updateUI();
                console.log(`${item.name} purchased!`);
            } else {
                console.log('Not enough gold to purchase this item.');
            }
        });

        shopMenu.appendChild(itemElement);
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.bottom = '10px';
    closeButton.style.left = '50%';
    closeButton.style.transform = 'translateX(-50%)';
    closeButton.addEventListener('click', () => {
        shopMenu.classList.add('hidden');
        window.gamePaused = false;
        requestAnimationFrame(gameLoop);
    });

    shopMenu.appendChild(closeButton);
}