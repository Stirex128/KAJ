// Setup event listeners
// Add this to your EventListeners.js
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


/* When the user clicks on the button,
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

    // Prevent default behavior (Prevent file from being opened)
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
