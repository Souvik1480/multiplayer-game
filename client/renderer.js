import { players, bullets, myId } from "./network.js";
import { map, TILE_SIZE } from "./map.js";
import { cameraX, cameraY } from "./camera.js";

function drawMap(ctx) {                                  //DRAWING THE MAP

    for (let row = 0; row < map.length; row++) {

        for (let col = 0; col < map[row].length; col++) {

            ctx.fillStyle =
                map[row][col] === "#"
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

function drawPlayers(ctx) {                                //DRAWING THE PLAYERS

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

        if (!p.alive) {

            ctx.fillStyle = "gray";

        }
        else if (id === myId) {

            ctx.fillStyle = "dodgerblue";

        }
        else {

            ctx.fillStyle = "gold";

        }
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

}

function drawBullets(ctx) {                                        //DRAWING THE BULLETS

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

}

function drawParticles(ctx, hitParticles) {                              //DRAWING THE HIT PARTICLES

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

function drawHUD(ctx) {

    const me = players[myId];

    if (!me) return;

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(15, 15, 260, 130);

    // Border
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 260, 130);

    ctx.fillStyle = "white";

    ctx.font = "22px Arial";
    ctx.fillText("PLAYER HUD", 30, 45);

    ctx.font = "18px Arial";

    ctx.fillText(
        "🔫 Weapon : " + me.weapon.toUpperCase(),
        30,
        75
    );

    ctx.fillText(
        "💥 Fire : " +
        (me.weapon === "rifle" ? "AUTO" : "SEMI"),
        30,
        100
    );

    const maxAmmo =

        me.weapon === "pistol"

            ? 12

            : 30;

    ctx.fillText(

        "🎯 Ammo : " +

        me.ammo[me.weapon] +

        " / " +

        maxAmmo,

        30,

        125

    );

}

function drawScoreboard(ctx) {

    //Background
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(
        ctx.canvas.width - 260,
        15,
        235,
        170
    );

    //Border
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        ctx.canvas.width - 250,
        15,
        235,
        170
    );

    //Title
    ctx.fillStyle = "white";
    ctx.font = "22px Arial";

    ctx.fillText(

        "🏆 SCOREBOARD",

        ctx.canvas.width - 235,

        45

    );

    let y = 80;

    ctx.font = "18px Arial";

    const list =

        Object.values(players)

            .sort(

                (a, b) =>

                    b.kills - a.kills

            );

    for (const p of list) {

        ctx.fillStyle = "white";

        ctx.fillText(
            p.name,
            ctx.canvas.width - 235,
            y
        );

        ctx.fillText(

            p.kills.toString(),

            ctx.canvas.width - 50,

            y
        );
        y += 28;

    }

}

function drawUI(ctx) {                                                 //DRAWING THE UI

    drawHUD(ctx);

    drawScoreboard(ctx);

}

function drawCrosshair(ctx, mouseX, mouseY) {                          //DRAWING THE CROSSHAIR

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

}

export function render(                             //RENDER

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

    // WORLD

    ctx.save();

    ctx.translate(

        -cameraX,
        -cameraY

    );

    drawMap(ctx);

    drawPlayers(ctx);

    drawBullets(ctx);

    drawParticles(

        ctx,

        hitParticles

    );

    ctx.restore();

    // SCREEN SPACE

    drawUI(ctx, canvas);

    drawCrosshair(

        ctx,

        mouseX,
        mouseY

    );

}