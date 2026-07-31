// effects.js

export const explosions = [];
export const floatingTexts = [];
export const particles = [];

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

export function createParticle(
    x,
    y,
    vx,
    vy,
    size,
    color,
    life
) {

    particles.push({

        x,
        y,

        vx,
        vy,

        size,

        color,

        life,
        maxLife: life

    });

}

export function createBurst(
    x,
    y,
    color,
    count
) {

    for (let i = 0; i < count; i++) {

        const angle = Math.random() * Math.PI * 2;

        const speed = 1 + Math.random() * 3;

        createParticle(

            x,
            y,

            Math.cos(angle) * speed,

            Math.sin(angle) * speed,

            3 + Math.random() * 4,

            color,

            40 + Math.random() * 20

        );

    }

}

export function updateParticles() {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Slow down slightly
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Shrink
        p.size *= 0.98;

        // Lifetime
        p.life--;

        // Remove dead particles
        if (p.life <= 0 || p.size < 0.5) {

            particles.splice(i, 1);

        }

    }

}

export function drawParticles(ctx) {

    for (const p of particles) {

        ctx.globalAlpha = p.life / p.maxLife;

        ctx.beginPath();

        ctx.arc(

            p.x,

            p.y,

            p.size,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = p.color;

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}