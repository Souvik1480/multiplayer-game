import { keys } from "./input.js";
import socket, { players, bullets } from "./network.js";

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


function render() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Bullet counter
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Bullets: " + bullets.length,
        20,
        20
    );

    // SCOREBOARD
    let scoreY = 60;

    ctx.fillStyle = "white";
    ctx.font = "22px Arial";

    ctx.fillText(
        "🏆 SCOREBOARD",
        20,
        scoreY
    );

    scoreY += 30;

    for (const id in players) {

        const p = players[id];

        ctx.fillText(

            p.name +
            " : " +
            p.kills,

            20,
            scoreY
        );

        scoreY += 25;
    }

    // PLAYERS
    for (const id in players) {

        const p = players[id];

        // HEALTH BAR BACKGROUND
        ctx.fillStyle = "red";

        ctx.fillRect(
            p.x,
            p.y - 20,
            50,
            6
        );

        // HEALTH BAR
        ctx.fillStyle = "lime";

        ctx.fillRect(
            p.x,
            p.y - 20,
            p.hp / 2,
            6
        );

        ctx.save();

        ctx.translate(

            p.x + 25,
            p.y + 25

        );

        ctx.rotate(
            p.angle
        );

        ctx.fillStyle =
            p.alive
                ? "gold"
                : "gray";

        ctx.fillRect(

            -25,
            -25,

            50,
            50

        );

        // Gun barrel
        ctx.fillStyle = "black";

        ctx.fillRect(

            0,
            -3,

            30,
            6

        );

        ctx.restore();

        // PLAYER NAME
        ctx.fillStyle = "white";

        ctx.font = "16px Arial";

        ctx.fillText(
            p.name,
            p.x,
            p.y - 30
        );

        // HP
        ctx.fillText(
            "HP: " + p.hp,
            p.x,
            p.y + 70
        );

        // KILLS
        ctx.fillText(
            "K: " + p.kills,
            p.x,
            p.y + 90
        );

        // RESPAWN TIMER
        if (!p.alive) {

            ctx.fillStyle = "white";

            ctx.fillText(

                "RESPAWN: " +
                p.respawn,

                p.x,
                p.y + 110
            );
        }
    }

    // BULLETS
    for (const b of bullets) {

        ctx.beginPath();

        ctx.arc(

            b.x,
            b.y,

            8,

            0,

            Math.PI * 2
        );

        ctx.fillStyle =
            "red";

        ctx.fill();

        // CROSSHAIR

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        // Horizontal
        ctx.beginPath();

        ctx.moveTo(
            mouseX - 10,
            mouseY
        );

        ctx.lineTo(
            mouseX + 10,
            mouseY
        );

        ctx.stroke();

        // Vertical
        ctx.beginPath();

        ctx.moveTo(
            mouseX,
            mouseY - 10
        );

        ctx.lineTo(
            mouseX,
            mouseY + 10
        );

        ctx.stroke();

        // Center dot
        ctx.beginPath();

        ctx.arc(

            mouseX,
            mouseY,

            3,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = "red";

        ctx.fill();
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

    render();

    requestAnimationFrame(gameLoop);
}

gameLoop();