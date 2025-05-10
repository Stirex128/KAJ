class ShopItem {
    constructor(name, price, position, effect, image) {
        this.name = name;
        this.price = price;
        this.position = position;
        this.effect = effect;
        this.image = image;
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
    new ShopItem('Health Potion', 10, { row: 1, column: 1 }, (hero) => {
        hero.health = Math.min(hero.health + 20, 120);
        console.log('Hero healed by 20 HP!');
    }, 'Tiles/tile_0115.png'),
    new ShopItem('Attack Boost', 100, { row: 1, column: 2 }, (hero) => {
        hero.attackPower += 5;
        console.log('Hero attack power increased by 5!');
    }, 'Tiles/tile_0116.png'),
];
function renderShopItems(shopItems) {
    const shopMenu = document.getElementById('shop-menu');

    // Clear all existing content in the shop menu
    shopMenu.innerHTML = '<h1>Shop Menu</h1>'; // Retain the title

    // Create a container for the shop items
    const itemsContainer = document.createElement('div');
    itemsContainer.id = 'shop-items-container';
    itemsContainer.style.display = 'flex';
    itemsContainer.style.flexDirection = 'column';
    itemsContainer.style.alignItems = 'center';

    // Add each shop item dynamically
    shopItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.style.margin = '10px';
        itemElement.style.textAlign = 'center';
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

        itemsContainer.appendChild(itemElement);
    });

    // Append the items container to the shop menu
    shopMenu.appendChild(itemsContainer);
}