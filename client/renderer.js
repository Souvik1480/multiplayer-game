import { players, bullets } from "./network.js";
import { map, TILE_SIZE } from "./map.js";

function drawMap(ctx) {

    for (let row = 0; row < map.length; row++) {

        for (let col = 0; col < map[row].length; col++) {

            const tile = map[row][col];

            ctx.fillStyle =
                tile === "#"
                    ? "#444"
                    : "#1d1d1d";

            ctx.fillRect(

                col * TILE_SIZE,

                row * TILE_SIZE,

                TILE_SIZE,

                TILE_SIZE

            );

        }

    }

}

export function render(

    ctx,
    canvas,

    mouseX,
    mouseY,

    hitParticles

) {

    ctx.clearRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

    drawMap(ctx);

    // --------------------
    // BULLET COUNTER
    // --------------------

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(

        "Bullets: " + bullets.length,

        20,

        20

    );

    // --------------------
    // SCOREBOARD
    // --------------------

    let scoreY = 60;

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

            p.name + " : " + p.kills,

            20,

            scoreY

        );

        scoreY += 25;

    }

    // --------------------
    // PLAYERS
    // --------------------

    for (const id in players) {

        const p = players[id];

        // Health background

        ctx.fillStyle = "red";

        ctx.fillRect(

            p.x,

            p.y - 20,

            50,

            6

        );

        // Health

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

        ctx.rotate(p.angle);

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

        // Gun

        ctx.fillStyle = "black";

        ctx.fillRect(

            0,

            -3,

            30,

            6

        );

        ctx.restore();

        ctx.fillStyle = "white";
        ctx.font = "16px Arial";

        ctx.fillText(

            p.name,

            p.x,

            p.y - 30

        );

        ctx.fillText(

            "HP: " + p.hp,

            p.x,

            p.y + 70

        );

        ctx.fillText(

            "K: " + p.kills,

            p.x,

            p.y + 90

        );

        if (!p.alive) {

            ctx.fillText(

                "RESPAWN: " + p.respawn,

                p.x,

                p.y + 110

            );

        }

    }

    // --------------------
    // BULLETS
    // --------------------

    for (const b of bullets) {

        ctx.beginPath();

        ctx.arc(

            b.x,

            b.y,

            8,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = "red";

        ctx.fill();

    }

    // --------------------
    // CROSSHAIR
    // --------------------

    ctx.strokeStyle = "white";

    ctx.lineWidth = 2;

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

    // --------------------
    // HIT PARTICLES
    // --------------------

    for (const p of hitParticles) {

        ctx.beginPath();

        ctx.arc(

            p.x,

            p.y,

            3,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = "orange";

        ctx.fill();

    }

}