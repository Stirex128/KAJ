// GameClock.js
function initializeGameClock() {
    // Create the clock element
    const clockElement = document.createElement('div');
    clockElement.id = 'game-clock';
    clockElement.style.position = 'absolute';
    clockElement.style.top = '10px';
    clockElement.style.left = '50%';
    clockElement.style.transform = 'translateX(-50%)';
    clockElement.style.fontFamily = 'monospace';
    clockElement.style.fontSize = '1.5rem';
    clockElement.style.color = '#fff';
    clockElement.style.textShadow = '0 0 5px #000';
    clockElement.style.padding = '5px 15px';
    clockElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
    clockElement.style.borderRadius = '5px';
    clockElement.style.zIndex = '102';

    // Add the clock to game area
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.appendChild(clockElement);
    }

    // Initial update with placeholder
    updateClock();

    // Set up regular updates
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clockElement = document.getElementById('game-clock');
    if (!clockElement) return;

    if (navigator.onLine) {
        // Online: get and show actual time
        fetchOnlineTime()
            .then(time => {
                clockElement.textContent = time;
            })
            .catch(error => {
                // Fallback to local time if API fails
                const now = new Date();
                clockElement.textContent = formatLocalTime(now);
                console.error('Failed to fetch online time:', error);
            });
    } else {
        // Offline: show placeholder or local time
        clockElement.textContent = "-- OFFLINE --";
    }
}

function formatLocalTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

async function fetchOnlineTime() {
    try {
        // Using WorldTimeAPI for accurate time
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();

        // Parse the datetime string
        const dateTime = new Date(data.datetime);
        return formatLocalTime(dateTime);
    } catch (error) {
        // If the API fails, throw the error to trigger the fallback
        throw error;
    }
}

// Initialize the clock
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for online/offline status changes
    window.addEventListener('online', updateClock);
    window.addEventListener('offline', updateClock);

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
});