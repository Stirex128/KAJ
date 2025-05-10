function initializeGameClock() {
    // Create the clock element
    const clockElement = document.createElement('div');
    clockElement.id = 'game-clock';
    clockElement.style.position = 'fixed';
    clockElement.style.bottom = '20px';
    clockElement.style.right = '20px';
    clockElement.style.fontFamily = 'monospace';
    clockElement.style.fontSize = '1.5rem';
    clockElement.style.color = '#fff';
    clockElement.style.textShadow = '0 0 5px #000';
    //clockElement.style.padding = '5px 15px';
    clockElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
    clockElement.style.borderRadius = '5px';
    clockElement.style.zIndex = '102';

    // Add the clock to game area
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        gameArea.appendChild(clockElement);
    }

    // Initial update with local time
    updateClockWithLocalTime();

    // Set up regular updates
    setInterval(updateClockWithLocalTime, 1000);
}

function updateClockWithLocalTime() {
    const clockElement = document.getElementById('game-clock');
    if (!clockElement) return;

    if (navigator.onLine) {
        // Online: show local time (avoid API rate limits)
        const now = new Date();
        clockElement.textContent = formatLocalTime(now);
    } else {
        // Offline: show placeholder
        clockElement.textContent = "-- OFFLINE --";
    }
}

function formatLocalTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

