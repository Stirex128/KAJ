function animateSwordSwing() {
    const canvas = document.getElementById('attack-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const swordImage = new Image();
    swordImage.src = 'Tiles/tile_0104.png';

    // Sword dimensions and animation properties
    const swordWidth = 64;
    const swordHeight = 64;

    // Offset parameters - adjust these to change sword position
    const offsetX = 60;  // Positive moves right
    const offsetY = 40;  // Positive moves down

    // Circle radius - adjust this to change the size of the circle
    const radius = 40;   // Distance from rotation center to sword

    const duration = 500; // Animation duration in milliseconds
    const startTime = performance.now();

    swordImage.onload = () => {
        console.log('Sword image loaded successfully');
        console.log('Hero position:', heroPosition.x, heroPosition.y);

        function drawFrame(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Full 360-degree rotation (2π radians)
            const angle = progress * Math.PI * 2;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            // Position at hero center with offsets
            ctx.translate(heroPosition.x + offsetX, heroPosition.y + offsetY);

            // Rotate based on animation progress
            ctx.rotate(angle);

            // Draw the sword at the specified radius from rotation point
            ctx.drawImage(
                swordImage,
                radius,            // Position sword at specified radius from center
                -swordHeight/2,    // Center vertically
                swordWidth,
                swordHeight
            );

            ctx.restore();

            if (progress < 1) {
                requestAnimationFrame(drawFrame);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        requestAnimationFrame(drawFrame);
    };

    swordImage.onerror = () => {
        console.error('Failed to load sword image.');
    };
}

