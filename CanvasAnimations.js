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

    const duration = 500;
    const startTime = performance.now();

    swordImage.onload = () => {
        console.log('Sword image loaded successfully');
        console.log('Hero position:', heroPosition.x, heroPosition.y);

        function drawFrame(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Full 360-degree rotation (2π radians)
            const angle = progress * Math.PI * 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

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

function animateMagicOrb(targetEnemy) {
    const canvas = document.getElementById('attack-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const orbImage = new Image();
    orbImage.src = 'Tiles/orb1.png';

    const orbSize = 32;

    // Animation parameters
    const duration = 250;
    const startTime = performance.now();

    // Start position (hero)
    const startX = heroPosition.x;
    const startY = heroPosition.y;

    // End position (enemy)
    const endX = targetEnemy.position.x + 32; // Center of enemy
    const endY = targetEnemy.position.y + 32; // Center of enemy

    orbImage.onload = () => {
        console.log('Magic orb image loaded successfully');

        function drawFrame(currentTime) {
            // Calculate progress (0 to 1)
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate current position using linear interpolation
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;

            ctx.save();



            ctx.drawImage(
                orbImage,
                currentX - orbSize/2,
                currentY - orbSize/2,
                orbSize,
                orbSize
            );

            ctx.restore();
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(drawFrame);
            } else {
                drawImpact(endX, endY);
                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }, 200);
            }
        }

        // Start the animation
        requestAnimationFrame(drawFrame);
    };
    orbImage.onerror = () => {
        console.error('Failed to load magic orb image.');
    };

    function drawImpact(x, y) {
        ctx.save();

        ctx.beginPath();
        ctx.fill();
        ctx.restore();
    }
}