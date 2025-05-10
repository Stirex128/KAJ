// Setup event listeners
document.getElementById('save-btn').addEventListener('click', () => {
    const gameStateData = getCookie('gameState');
    if (gameStateData) {
        const blob = new Blob([gameStateData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        a.download = 'fantasy-game-save.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});

document.getElementById('load-btn').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                setCookie('gameState', content, 365);
                loadGameState();
            };
            reader.readAsText(file);
        }
    });

    fileInput.click();
});


document.getElementById('warrior-btn').addEventListener('click', () => chooseHero('warrior'));
document.getElementById('mage-btn').addEventListener('click', () => chooseHero('mage'));
document.getElementById('confirm-btn').addEventListener('click', confirmSelection);
//document.getElementById('attack-btn').addEventListener('click', attackEnemy);
//document.getElementById('special-btn').addEventListener('click', attackEnemy);

document.getElementById('warrior-btn').addEventListener('click', () => {document.getElementById('hero-image').src = 'Tiles/tile_0097.png';
});
document.getElementById('restart-btn').addEventListener('click', () => {
    deleteCookie('gameState');
    location.reload();
});
document.getElementById('mage-btn').addEventListener('click', () => {document.getElementById('hero-image').src = 'Tiles/tile_0084.png';
});

// ledování stisknutých kláves
const keysPressed = {};

// pro sledování stisknuti a uvolnění kláves
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});

/*document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const menuPanel = document.getElementById('menu-panel');

    if (menuBtn && menuPanel) {
        menuBtn.addEventListener('click', () => {
            menuPanel.classList.toggle('hidden');
        });

        document.addEventListener('click', (event) => {
            if (!menuBtn.contains(event.target) && !menuPanel.contains(event.target)) {
                menuPanel.classList.add('hidden');
            }
        });
    } else {
        console.error('menu-btn or menu-panel element not found.');
    }
});*/

/* When the use clicks on the button,
toggle between hiding and showing the dropdown content */
function menuFunction() {
    document.getElementById("menuDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function dropHandler(ev) {
    console.log("File(s) dropped");
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                console.log(`… file[${i}].name = ${file.name}`);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
        });
    }
}

function dragOverHandler(ev) {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

document.addEventListener('DOMContentLoaded', () => {
    const coinContainer = document.getElementById('coin-container');
    let shopMenu = document.getElementById('shop-menu');

    if (coinContainer) {
        console.log('coin-container nalezen. Přidávám posluchač události.');

        coinContainer.addEventListener('click', () => {
            console.log('Kliknutí na coin-container detekováno.');

            // Pozastavení herní smyčky
            window.gamePaused = true;
            console.log('Herní smyčka pozastavena.');

            // Zobrazení shop menu
            if (!shopMenu) {
                console.log('Shop menu neexistuje, vytvářím nový element.');
                shopMenu = document.createElement('div');
                shopMenu.id = 'shop-menu';


                document.body.appendChild(shopMenu);

                // Styl menu
                shopMenu.style.position = 'fixed';
                shopMenu.style.top = '50%';
                shopMenu.style.left = '50%';
                shopMenu.style.transform = 'translate(-50%, -50%)';
                shopMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                shopMenu.style.color = 'white';
                shopMenu.style.padding = '20px';
                shopMenu.style.borderRadius = '10px';
                shopMenu.style.zIndex = '1000';
                shopMenu.style.textAlign = 'center';
                shopMenu.style.width = '300px';
                shopMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            }
            renderShopItems(shopItems);
            // Zobraz
            shopMenu.classList.remove('hidden');

            // Přidání funkce pro zavření menu
            const closeButton = document.getElementById('close-shop-btn');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    console.log('Kliknutí na tlačítko zavření detekováno.');
                    shopMenu.classList.add('hidden');
                    window.gamePaused = false; // Obnovení herní smyčky
                    console.log('Herní smyčka obnovena.');
                    requestAnimationFrame(gameLoop); // Restart game loop
                });
            }
        });

        // Zavření shop menu při kliknutí mimo něj
        document.addEventListener('click', (event) => {
            if (
                shopMenu &&
                !shopMenu.classList.contains('hidden') &&
                !shopMenu.contains(event.target) &&
                !coinContainer.contains(event.target)
            ) {
                console.log('Kliknutí mimo shop menu detekováno.');
                shopMenu.classList.add('hidden');
                window.gamePaused = false; // Obnovení herní smyčky
                console.log('Herní smyčka obnovena.');
                requestAnimationFrame(gameLoop); // Restart game loop
            }
        });
    } else {
        console.error('Element s ID "coin-container" nebyl nalezen.');
    }
});
// Přidat posluchač pro změnu velikosti okna
window.addEventListener('resize', () => {
    const canvas = document.getElementById('attack-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Inicializovat canvas při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    // Add event listener for online/offline status changes
    window.addEventListener('online', updateClockWithLocalTime);
    window.addEventListener('offline', updateClockWithLocalTime);

    // Initialize the clock when the game area becomes visible
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'game-area' &&
                !mutation.target.classList.contains('hidden')) {
                initializeGameClock();
            }
        });
    });

    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        observer.observe(gameArea, { attributes: true, attributeFilter: ['class'] });

        // Initialize immediately if game area is already visible
        if (!gameArea.classList.contains('hidden')) {
            initializeGameClock();
        }
    }
    const styleElement = document.createElement('style');

    // Override the enemy img filter
    styleElement.textContent = `
        .enemy img {
            filter: none !important;
        }
    `;

    // Append to document
    document.head.appendChild(styleElement);
    // 2. Zkontroluj, zda je načtený stav validní
    if (!gameState || !gameState.difficulty) {
        selectDifficulty('medium');
    } else if (document.getElementById(`${gameState.difficulty}-btn`)) {
        selectDifficulty(gameState.difficulty);
    }

    // 3. Nastav canvas
    const canvas = document.getElementById('attack-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    updateUI();
});


document.getElementById('easy-btn').addEventListener('click', () => selectDifficulty('easy'));
document.getElementById('medium-btn').addEventListener('click', () => selectDifficulty('medium'));
document.getElementById('hard-btn').addEventListener('click', () => selectDifficulty('hard'));

