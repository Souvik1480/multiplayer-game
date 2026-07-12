import { keys } from "./input.js";
import socket, { players, bullets } from "./network.js";
import { map, TILE_SIZE } from "./map.js";
import { render } from "./renderer.js";
import { hitParticles, createHitEffect, updateParticles } from "./particles.js";
import { updateCamera, cameraX, cameraY } from "./camera.js";

let mouseX = 0;
let mouseY = 0;
let shootRequest = 0;
let currentWeapon = "pistol";
let shooting = false;

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

        shooting = true;
        shootRequest++;
        createHitEffect(mouseX, mouseY);

    }
);

window.addEventListener(
    "mouseup",
    () => {

        shooting = false;

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

function sendInput() {

    if (socket.readyState !== WebSocket.OPEN)
        return;

    let fire = false;

    // Pistol = one shot per click
    if (currentWeapon === "pistol") {

        fire = shootRequest > 0;

        if (fire) {

            shootRequest--;

        }

    }

    // Rifle = fire while holding mouse
    else if (currentWeapon === "rifle") {

        fire = shooting;

    }
    if (keys.one)
        currentWeapon = "pistol";

    if (keys.two)
        currentWeapon = "rifle";

    socket.send(

        JSON.stringify({

            up: keys.w,
            down: keys.s,
            left: keys.a,
            right: keys.d,

            mouseX: mouseX + cameraX,
            mouseY: mouseY + cameraY,

            shoot: fire,


            weapon:
                currentWeapon
        })

    );

}

function gameLoop() {

    update();

    interpolate();

    updateCamera(players);

    sendInput();

    updateParticles();

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