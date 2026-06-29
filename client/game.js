import { keys } from "./input.js";
import socket, { players } from "./network.js";

console.log("GAME.JS LOADED");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function update(){

    if(keys.w) player.y -= player.speed;
    if(keys.s) player.y += player.speed;
    if(keys.a) player.x -= player.speed;
    if(keys.d) player.x += player.speed;
}

function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const id in players) {

        const p = players[id];

        ctx.fillStyle = "gold";

        ctx.fillRect(
            p.x,
            p.y,
            50,
            50
        );
    }
}

function interpolate(){

    for(const id in players){

        const p =
            players[id];

        if(
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

    update();

    //interpolate();

    if (socket.readyState === WebSocket.OPEN) {

        socket.send(
            JSON.stringify({

                up: keys.w,
                down: keys.s,
                left: keys.a,
                right: keys.d

            })
        );
    }

    render();

    requestAnimationFrame(gameLoop);
}

gameLoop();