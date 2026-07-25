// effects.js

export const explosions = [];

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