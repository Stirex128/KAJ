// Přidejte tento kód do nového souboru SVGElements.js

// Vytvoření SVG health baru pro hrdinu
function createHeroHealthBar() {
    // Odstranění starého HP baru
    const oldHpBar = document.getElementById('hp-bar');
    if (oldHpBar && oldHpBar.parentNode) {
        oldHpBar.parentNode.removeChild(oldHpBar);
    }

    // Vytvoření SVG elementu
    const svgNamespace = "http://www.w3.org/2000/svg";
    const healthSvg = document.createElementNS(svgNamespace, "svg");
    healthSvg.setAttribute("id", "hero-health-svg");
    healthSvg.setAttribute("width", "100");
    healthSvg.setAttribute("height", "20");
    healthSvg.setAttribute("viewBox", "0 0 100 20");
    healthSvg.style.position = "absolute";
    healthSvg.style.top = "-30px";
    healthSvg.style.right = "-75px";

    // Pozadí health baru
    const background = document.createElementNS(svgNamespace, "rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", "100");
    background.setAttribute("height", "15");
    background.setAttribute("rx", "3");
    background.setAttribute("ry", "3");
    background.setAttribute("fill", "#333");
    background.setAttribute("stroke", "#000");
    background.setAttribute("stroke-width", "1");

    // Samotný health bar
    const healthBar = document.createElementNS(svgNamespace, "rect");
    healthBar.setAttribute("id", "hero-health-bar");
    healthBar.setAttribute("x", "2");
    healthBar.setAttribute("y", "2");
    healthBar.setAttribute("width", "96");
    healthBar.setAttribute("height", "11");
    healthBar.setAttribute("rx", "2");
    healthBar.setAttribute("ry", "2");
    healthBar.setAttribute("fill", "url(#hero-health-gradient)");

    // Gradient pro health bar
    const gradient = document.createElementNS(svgNamespace, "linearGradient");
    gradient.setAttribute("id", "hero-health-gradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(svgNamespace, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#5f5");

    const stop2 = document.createElementNS(svgNamespace, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#2a2");

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);

    // Dekorativní prvky
    const decorLine = document.createElementNS(svgNamespace, "path");
    decorLine.setAttribute("d", "M 5 7.5 H 95");
    decorLine.setAttribute("stroke", "rgba(255,255,255,0.3)");
    decorLine.setAttribute("stroke-width", "1");

    // Sestavení SVG
    const defs = document.createElementNS(svgNamespace, "defs");
    defs.appendChild(gradient);
    healthSvg.appendChild(defs);
    healthSvg.appendChild(background);
    healthSvg.appendChild(healthBar);
    healthSvg.appendChild(decorLine);

    // Přidání SVG k hrdinovi
    const heroContainer = document.querySelector('.hero-container');
    if (heroContainer) {
        heroContainer.appendChild(healthSvg);
    }

    return healthSvg;
}

// Aktualizace hero health baru
function updateHeroHealthBarSVG(currentHealth) {
    if (!gameState.hero) return;

    const maxHP = gameState.hero.name === 'Warrior' ? 120 : 80;
    const healthPercentage = Math.max(0, Math.min(100, (currentHealth / maxHP) * 100));

    const healthBar = document.getElementById('hero-health-bar');
    if (healthBar) {
        healthBar.setAttribute("width", healthPercentage * 0.96);

        // Změna barvy podle zdraví
        const gradient = document.getElementById('hero-health-gradient');
        if (gradient) {
            const stops = gradient.getElementsByTagName('stop');
            if (healthPercentage > 60) {
                stops[0].setAttribute("stop-color", "#5f5");
                stops[1].setAttribute("stop-color", "#2a2");
            } else if (healthPercentage > 30) {
                stops[0].setAttribute("stop-color", "#ff5");
                stops[1].setAttribute("stop-color", "#aa2");
            } else {
                stops[0].setAttribute("stop-color", "#f55");
                stops[1].setAttribute("stop-color", "#a22");
            }
        }

        // Animace pulse při nízkém zdraví
        if (healthPercentage < 20) {
            healthBar.classList.add("pulse-animation");
        } else {
            healthBar.classList.remove("pulse-animation");
        }
    }
}

// Vytvoření SVG health baru pro nepřítele
function createEnemyHealthBarSVG(enemy) {
    if (!enemy || !enemy.element) return null;

    // Odstranění starého health baru
    if (enemy.healthBarImg && enemy.healthBarImg.parentNode) {
        enemy.healthBarImg.parentNode.removeChild(enemy.healthBarImg);
    }

    // Vytvoření SVG elementu
    const svgNamespace = "http://www.w3.org/2000/svg";
    const healthSvg = document.createElementNS(svgNamespace, "svg");
    healthSvg.setAttribute("class", "enemy-health-svg");
    healthSvg.setAttribute("width", "50");
    healthSvg.setAttribute("height", "10");
    healthSvg.setAttribute("viewBox", "0 0 50 10");
    healthSvg.style.position = "absolute";
    healthSvg.style.top = "-15px";
    healthSvg.style.right = "-15px";

    // Pozadí health baru
    const background = document.createElementNS(svgNamespace, "rect");
    background.setAttribute("x", "0");
    background.setAttribute("y", "0");
    background.setAttribute("width", "50");
    background.setAttribute("height", "7");
    background.setAttribute("rx", "2");
    background.setAttribute("ry", "2");
    background.setAttribute("fill", "#333");
    background.setAttribute("stroke", "#000");
    background.setAttribute("stroke-width", "1");

    // Samotný health bar
    const healthBar = document.createElementNS(svgNamespace, "rect");
    healthBar.setAttribute("class", "enemy-health-bar");
    healthBar.setAttribute("x", "1");
    healthBar.setAttribute("y", "1");
    healthBar.setAttribute("width", "48");
    healthBar.setAttribute("height", "5");
    healthBar.setAttribute("rx", "1");
    healthBar.setAttribute("ry", "1");
    healthBar.setAttribute("fill", "url(#enemy-health-gradient-" + enemy.type + ")");

    // Gradient pro health bar
    const gradient = document.createElementNS(svgNamespace, "linearGradient");
    gradient.setAttribute("id", "enemy-health-gradient-" + enemy.type);
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(svgNamespace, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#f55");

    const stop2 = document.createElementNS(svgNamespace, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#a22");

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);

    // Sestavení SVG
    const defs = document.createElementNS(svgNamespace, "defs");
    defs.appendChild(gradient);
    healthSvg.appendChild(defs);
    healthSvg.appendChild(background);
    healthSvg.appendChild(healthBar);

    enemy.element.appendChild(healthSvg);
    enemy.healthBarSvg = healthSvg;

    return healthSvg;
}

// Aktualizace enemy health baru
function updateEnemyHealthBarSVG(enemy) {
    if (!enemy || !enemy.healthBarSvg) return;

    const healthPercentage = Math.max(0, Math.min(100, (enemy.health / enemy.maxHealth) * 100));

    const healthBar = enemy.healthBarSvg.querySelector('.enemy-health-bar');
    if (healthBar) {
        healthBar.setAttribute("width", healthPercentage * 0.48);
    }
}

// SVG efekt pro útok hrdiny
function createSwordAttackSVG() {
    const svgNamespace = "http://www.w3.org/2000/svg";

    // Nejdříve odstraníme existující canvas
    const canvas = document.getElementById('attack-canvas');
    if (canvas) {
        canvas.style.display = 'none';
    }

    // Vytvoříme SVG pro útok
    const attackSvg = document.createElementNS(svgNamespace, "svg");
    attackSvg.setAttribute("id", "attack-svg");
    attackSvg.setAttribute("width", window.innerWidth);
    attackSvg.setAttribute("height", window.innerHeight);
    attackSvg.style.position = "absolute";
    attackSvg.style.top = "0";
    attackSvg.style.left = "0";
    attackSvg.style.pointerEvents = "none";
    attackSvg.style.zIndex = "999";
    document.body.appendChild(attackSvg);

    return attackSvg;
}

// Animace mečového útoku pomocí SVG
function animateSwordSwingSVG() {
    // Vytvoříme nebo získáme SVG pro útok
    let attackSvg = document.getElementById('attack-svg');
    if (!attackSvg) {
        attackSvg = createSwordAttackSVG();
    }

    // Vyčistíme existující SVG elementy
    while (attackSvg.firstChild) {
        attackSvg.removeChild(attackSvg.firstChild);
    }

    const svgNamespace = "http://www.w3.org/2000/svg";

    // Vytvoření defs pro filtry a gradienty
    const defs = document.createElementNS(svgNamespace, "defs");

    // Filtr pro efekt záře
    const filter = document.createElementNS(svgNamespace, "filter");
    filter.setAttribute("id", "glow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");

    const feGaussianBlur = document.createElementNS(svgNamespace, "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "2");
    feGaussianBlur.setAttribute("result", "blur");

    const feColorMatrix = document.createElementNS(svgNamespace, "feColorMatrix");
    feColorMatrix.setAttribute("in", "blur");
    feColorMatrix.setAttribute("type", "matrix");
    feColorMatrix.setAttribute("values", "0 0 0 0 1 0 0 0 0 1 0 0 0 0 0.5 0 0 0 1 0");

    const feMerge = document.createElementNS(svgNamespace, "feMerge");
    const feMergeNode1 = document.createElementNS(svgNamespace, "feMergeNode");
    const feMergeNode2 = document.createElementNS(svgNamespace, "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);

    filter.appendChild(feGaussianBlur);
    filter.appendChild(feColorMatrix);
    filter.appendChild(feMerge);
    defs.appendChild(filter);
    attackSvg.appendChild(defs);

    // Parametry animace
    const duration = 500; // ms
    const startTime = performance.now();
    const radius = 50;

    // Vytvoření cesty pro meč
    const swordPath = document.createElementNS(svgNamespace, "path");
    swordPath.setAttribute("fill", "none");
    swordPath.setAttribute("stroke", "#FFD700");
    swordPath.setAttribute("stroke-width", "4");
    swordPath.setAttribute("stroke-linecap", "round");
    swordPath.setAttribute("filter", "url(#glow)");
    attackSvg.appendChild(swordPath);

    // Body pro meč
    const swordSymbol = document.createElementNS(svgNamespace, "g");
    swordSymbol.setAttribute("transform", `translate(${heroPosition.x}, ${heroPosition.y})`);
    attackSvg.appendChild(swordSymbol);

    // Hlavní čepel meče (jednoduchý tvar)
    const blade = document.createElementNS(svgNamespace, "path");
    blade.setAttribute("d", "M0,0 L30,0 L40,-5 L45,0 L40,5 L30,0");
    blade.setAttribute("fill", "#CCC");
    blade.setAttribute("stroke", "#888");
    blade.setAttribute("stroke-width", "1");
    blade.setAttribute("filter", "url(#glow)");
    swordSymbol.appendChild(blade);

    // Rukojeť meče
    const handle = document.createElementNS(svgNamespace, "rect");
    handle.setAttribute("x", "-15");
    handle.setAttribute("y", "-3");
    handle.setAttribute("width", "15");
    handle.setAttribute("height", "6");
    handle.setAttribute("fill", "#A52A2A");
    handle.setAttribute("stroke", "#8B4513");
    handle.setAttribute("stroke-width", "1");
    swordSymbol.appendChild(handle);

    // Záštita
    const guard = document.createElementNS(svgNamespace, "rect");
    guard.setAttribute("x", "-2");
    guard.setAttribute("y", "-8");
    guard.setAttribute("width", "4");
    guard.setAttribute("height", "16");
    guard.setAttribute("fill", "#888");
    guard.setAttribute("stroke", "#666");
    guard.setAttribute("stroke-width", "1");
    swordSymbol.appendChild(guard);

    // Animační funkce
    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const angle = progress * Math.PI * 2; // Plná rotace

        // Vypočtení pozice meče
        const x = heroPosition.x + 60 + Math.cos(angle) * radius;
        const y = heroPosition.y + 40 + Math.sin(angle) * radius;

        // Aktualizace cesty záře
        const pathProgress = Math.min(progress * 1.5, 1); // Prodloužení záře
        const startAngle = Math.max(0, angle - Math.PI / 2);
        const endAngle = angle;

        let pathData = "";
        for (let a = startAngle; a <= endAngle; a += 0.1) {
            const px = heroPosition.x + 60 + Math.cos(a) * radius;
            const py = heroPosition.y + 40 + Math.sin(a) * radius;
            if (pathData === "") {
                pathData = `M${px},${py}`;
            } else {
                pathData += ` L${px},${py}`;
            }
        }
        swordPath.setAttribute("d", pathData);

        // Rotace a pozice meče
        swordSymbol.setAttribute("transform",
            `translate(${x}, ${y}) rotate(${angle * 180 / Math.PI + 90})`);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Odstranění SVG po dokončení animace
            setTimeout(() => {
                while (attackSvg.firstChild) {
                    attackSvg.removeChild(attackSvg.firstChild);
                }
            }, 100);
        }
    }

    requestAnimationFrame(animate);
}