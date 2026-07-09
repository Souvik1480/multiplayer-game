import { keys } from "./input.js";
import socket, { players, bullets } from "./network.js";
import { map, TILE_SIZE } from "./map.js";
import { render } from "./renderer.js";
import { hitParticles, createHitEffect, updateParticles } from "./particles.js";
import {updateCamera, cameraX, cameraY} from"./camera.js";

let mouseX = 0;
let mouseY = 0;
let shootRequest = 0;

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

    const fire = shootRequest > 0;

    if (fire) {

        shootRequest--;

    }

    socket.send(

        JSON.stringify({

            up: keys.w,
            down: keys.s,
            left: keys.a,
            right: keys.d,

            mouseX:mouseX+cameraX,
            mouseY:mouseY+cameraY,

            shoot: fire

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