import { keys } from "./input.js";
import socket, { players, bullets } from "./network.js";
import { map, TILE_SIZE } from "./map.js";
import { render } from "./renderer.js";

let mouseX = 0;
let mouseY = 0;
let shootRequest = 0;
const hitParticles = [];

window.addEventListener(
    "mousemove",
    (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;
    }
)


window.addEventListener(
    "mousedown",
    () => {

        shootRequest++;
        createHitEffect(mouseX, mouseY);

    }
);


console.log("GAME.JS LOADED");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function update() {

    // Server-authoritative movement.
    // Client only sends inputs.

}

function createHitEffect(x, y) {

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


function interpolate() {

    for (const id in players) {

        const p =
            players[id];

        if (
            p.targetX ===
            undefined ||
            p.targetY ===
            undefined
        )
            continue;

        p.x +=
            (
                p.targetX -
                p.x
            ) * 0.15;

        p.y +=
            (
                p.targetY -
                p.y
            ) * 0.15;
    }
}

function gameLoop() {

    console.log("GAME LOOP");

    update();

    interpolate();

    if (socket.readyState === WebSocket.OPEN) {

        const fire = shootRequest > 0;

        if (fire) {

            console.log("SEND SHOT");

            shootRequest--;
        }

        socket.send(

            JSON.stringify({

                up: keys.w,
                down: keys.s,
                left: keys.a,
                right: keys.d,

                mouseX,
                mouseY,

                shoot: fire

            })

        );
    }

    // Update hit particles
    for (let i = hitParticles.length - 1; i >= 0; i--) {

        const p = hitParticles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.life--;

        if (p.life <= 0) {

            hitParticles.splice(i, 1);

        }

    }

    render(

        ctx,

        canvas,

        mouseX,

        mouseY,

        hitParticles

    );

    requestAnimationFrame(gameLoop);
}

gameLoop();