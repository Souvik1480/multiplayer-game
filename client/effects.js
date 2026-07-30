// effects.js

export const explosions = [];
export const floatingTexts = [];

// Create a new explosion
export function createExplosion(x, y) {

    explosions.push({

        x,
        y,

        radius: 10,

        life: 20

    });

}

// Update every explosion
export function updateEffects() {

    for (let i = explosions.length - 1; i >= 0; i--) {

        const e = explosions[i];

        e.radius += 6;

        e.life--;

        if (e.life <= 0) {

            explosions.splice(i, 1);

        }

    }

}

export function createFloatingText(x, y, text, color) {

    floatingTexts.push({
        x,
        y,
        text,
        color,
        life: 60
    });

}

export function updateFloatingTexts() {

    for (let i = floatingTexts.length - 1; i >= 0; i--) {

        const t = floatingTexts[i];

        t.y -= 0.6;
        t.life--;

        if (t.life <= 0)
            floatingTexts.splice(i, 1);

    }

}

export function drawFloatingTexts(ctx) {

    ctx.font = "20px Arial";
    ctx.textAlign = "center";

    for (const t of floatingTexts) {

        ctx.globalAlpha = t.life / 60;

        ctx.fillStyle = t.color;

        ctx.fillText(
            t.text,
            t.x,
            t.y
        );

    }

    ctx.globalAlpha = 1;

}