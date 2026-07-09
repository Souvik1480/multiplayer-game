export const hitParticles = [];

export function createHitEffect(x, y) {

    for (let i = 0; i < 15; i++) {

        hitParticles.push({

            x,
            y,

            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,

            life: 30

        });

    }

}

export function updateParticles() {

    for (let i = hitParticles.length - 1; i >= 0; i--) {

        const p = hitParticles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.life--;

        if (p.life <= 0) {

            hitParticles.splice(i, 1);

        }

    }

}