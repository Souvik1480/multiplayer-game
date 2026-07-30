import { players, bullets, grenades, killFeed, healthPacks, myId } from "./network.js";
import { map, TILE_SIZE } from "./map.js";
import { cameraX, cameraY, shakeX, shakeY } from "./camera.js";
import { explosions } from "./effects.js";


function drawMap(ctx) {                              //MAP

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

function drawPlayers(ctx) {                          //PLAYERS

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

        // --------------------
        // MUZZLE FLASH
        // --------------------

        if (p.flash > 0) {

            ctx.fillStyle = "#FFD54F";

            ctx.beginPath();

            ctx.moveTo(42, 0);

            ctx.lineTo(52, -4);

            ctx.lineTo(60, 0);

            ctx.lineTo(52, 4);

            ctx.closePath();

            ctx.fill();

        }

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

function drawBullets(ctx) {                          //BULLETS

    for (const b of bullets) {

        // --------------------
        // BULLET TRAIL
        // --------------------

        ctx.beginPath();

        ctx.moveTo(
            b.x - b.vx * 0.6,
            b.y - b.vy * 0.6
        );

        ctx.lineTo(
            b.x,
            b.y
        );

        ctx.strokeStyle = "rgba(255, 220, 100, 0.8)";
        ctx.lineWidth = 4;
        ctx.stroke();

        // --------------------
        // BULLET
        // --------------------

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            6,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#FFD54F";

        ctx.fill();

    }

}

function drawHUD(ctx) {                              //HUD

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

function drawScoreboard(ctx) {                       //SCOREBOARD

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

function drawUI(ctx) {                               //UI

    drawHUD(ctx);

    drawScoreboard(ctx);

    // --------------------
    // HIT MARKER
    // --------------------

    const me = players[myId];

    if (me && me.hitMarker > 0) {

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;

        const cx = ctx.canvas.width / 2;
        const cy = ctx.canvas.height / 2;

        const size = 12;

        ctx.beginPath();

        ctx.moveTo(cx - size, cy - size);
        ctx.lineTo(cx - 3, cy - 3);

        ctx.moveTo(cx + size, cy - size);
        ctx.lineTo(cx + 3, cy - 3);

        ctx.moveTo(cx - size, cy + size);
        ctx.lineTo(cx - 3, cy + 3);

        ctx.moveTo(cx + size, cy + size);
        ctx.lineTo(cx + 3, cy + 3);

        ctx.stroke();

    }
}

function drawCrosshair(ctx, mouseX, mouseY) {        //CROSSHAIR

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

function drawGrenades(ctx) {                         //GRENADE

    for (const g of grenades) {

        ctx.beginPath();

        ctx.arc(

            g.x,

            g.y,

            10,

            0,

            Math.PI * 2

        );

        ctx.fillStyle = "green";

        ctx.fill();

    }

}

function drawExplosions(ctx) {                       //EXPLOSION

    for (const e of explosions) {

        // Outer glow
        ctx.beginPath();
        ctx.arc(
            e.x,
            e.y,
            e.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,80,0,${e.life / 20})`;

        ctx.fill();

        // Middle ring
        ctx.beginPath();
        ctx.arc(
            e.x,
            e.y,
            e.radius * 0.7,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,170,0,${e.life / 20})`;

        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(
            e.x,
            e.y,
            e.radius * 0.35,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,180,${e.life / 20})`;

        ctx.fill();

    }

}

function drawKillFeed(ctx) {                         //KILL FEED

    ctx.save();

    ctx.font = "18px Arial";
    ctx.textAlign = "left";

    let y = ctx.canvas.height - 30;

    // Draw newest kill at the bottom
    for (let i = killFeed.length - 1; i >= 0; i--) {

        const kill = killFeed[i];

        let icon = "🔫";

        if (kill.weapon === "grenade")
            icon = "💣";

        ctx.fillStyle = "white";

        ctx.fillText(
            `${kill.killer} ${icon} ${kill.victim}`,
            20,
            y
        );

        y -= 26;
    }

    ctx.restore();
}

function drawHealthPacks(ctx) {                      //HEALTH PACKS

    for (const hp of healthPacks) {

        if (!hp.active)
            continue;

        const x = hp.x;
        const floatOffset = Math.sin(Date.now() / 300 + hp.id) * 4;
        const y = hp.y + floatOffset;
        const size = 30;

        // -------------------------
        // Glow
        // -------------------------
        ctx.beginPath();
        ctx.fillStyle = "rgba(0,255,120,0.20)";
        ctx.arc(
            x + size / 2,
            y + size / 2,
            26,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // -------------------------
        // Main box
        // -------------------------
        ctx.fillStyle = "#32CD32";

        ctx.beginPath();
        ctx.roundRect(
            x,
            y,
            size,
            size,
            6
        );
        ctx.fill();

        // -------------------------
        // Border
        // -------------------------
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();

        // -------------------------
        // Heart
        // -------------------------
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "white";

        ctx.fillText(
            "❤",
            x + size / 2,
            y + size / 2 + 1
        );
    }

}

export function render(                                  //RENDER

    ctx,
    canvas,

    mouseX,
    mouseY,


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

        -cameraX + shakeX,
        -cameraY + shakeY

    );

    drawMap(ctx);

    drawHealthPacks(ctx);

    drawPlayers(ctx);

    drawBullets(ctx);

    drawGrenades(ctx);

    drawExplosions(ctx);

    ctx.restore();

    // SCREEN SPACE

    drawUI(ctx, canvas);

    drawKillFeed(ctx);

    drawCrosshair(

        ctx,

        mouseX,
        mouseY

    );

}