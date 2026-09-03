import { keys } from "./input.js";
import socket, { players, bullets, myId, selectGameMode } from "./network.js";
import { map, TILE_SIZE } from "./map.js";
import { render } from "./renderer.js";
import { updateCamera, cameraX, cameraY, addCameraShake } from "./camera.js";
import { playPistol, playRifle } from "./sound.js";
import { updateEffects, updateFloatingTexts, updateParticles, createBurst } from "./effects.js";

let mouseX = 0;
let mouseY = 0;
let shootRequest = 0;
let currentWeapon = "pistol";
let shooting = false;
let lastRifleSound = 0;
let grenadeRequest = false;
let gameStarted = false;

window.addEventListener(
    "mouseup",
    () => {

        if (!gameStarted) return;

        shooting = false;

    }
);


window.addEventListener(
    "mousedown",
    () => {

        if (!gameStarted) return;

        shooting = true;
        shootRequest++;

        addCameraShake(5);

    }
);

window.addEventListener(
    "mousemove",
    (e) => {

        if (!gameStarted) return;

        mouseX = e.clientX;
        mouseY = e.clientY;
    }
);


console.log("GAME.JS LOADED");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function update() {

    updateEffects();

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

function canPlayLocalGunSound() {

    const me = players[myId];

    if (!me) return false;

    return (

        me.ammo[currentWeapon] > 0 &&

        !me.reloading

    );

}

function sendInput() {

    if (socket.readyState !== WebSocket.OPEN)
        return;

    // --------------------
    // WEAPON SWITCH
    // --------------------

    if (keys.one && currentWeapon !== "pistol") {

        currentWeapon = "pistol";

        shooting = false;
        shootRequest = 0;

    }

    if (keys.two && currentWeapon !== "rifle") {

        currentWeapon = "rifle";

        shooting = false;
        shootRequest = 0;

    }

    // --------------------
    // FIRE
    // --------------------

    let fire = false;

    if (currentWeapon === "pistol") {

        fire = shootRequest > 0;

        if (fire) {

            shootRequest--;

            if (canPlayLocalGunSound()) {

                playPistol();

            }

        }

    }
    else if (currentWeapon === "rifle") {

        fire = shooting;

        if (fire && canPlayLocalGunSound()) {

            const now = Date.now();

            if (now - lastRifleSound >= 100) {

                playRifle();

                lastRifleSound = now;

            }

        }

    }

    const grenade = keys.grenadeRequest;

    // Consume the request so it's sent only once
    keys.grenadeRequest = false;

    socket.send(
        JSON.stringify({

            up: keys.w,
            down: keys.s,
            left: keys.a,
            right: keys.d,

            mouseX: mouseX + cameraX,
            mouseY: mouseY + cameraY,

            shoot: fire,

            reload: keys.reload,

            weapon: currentWeapon,

            grenade: grenade

        })
    );

}

function gameLoop() {

    update();

    updateFloatingTexts();

    updateParticles();

    interpolate();

    updateCamera(players);

    sendInput();

    render(

        ctx,

        canvas,

        mouseX,

        mouseY,

    );

    requestAnimationFrame(gameLoop);
}

gameLoop();

const mainMenu = document.getElementById("mainMenu");
const singlePlayerBtn = document.getElementById("singlePlayerBtn");
const multiplayerBtn = document.getElementById("multiplayerBtn");

singlePlayerBtn.addEventListener("click", () => {

    selectGameMode("singleplayer");

    gameStarted = true;

    mainMenu.style.display = "none";

    console.log("🎮 SINGLE PLAYER STARTED");

});

multiplayerBtn.addEventListener("click", () => {

    selectGameMode("multiplayer");

    gameStarted = true;

    mainMenu.style.display = "none";

    console.log("🌐 MULTIPLAYER STARTED");

});

backToMenuBtn.addEventListener("click", () => {
    gameStarted = false;
    shooting = false;

    socket.send(JSON.stringify({
        type: "leaveGame"
    }));

    mainMenu.style.display = "flex";
    backToMenuBtn.style.display = "none";

    console.log("🏠 BACK TO MAIN MENU");
});

singlePlayerBtn.addEventListener("click", () => {
    selectGameMode("singleplayer");

    gameStarted = true;
    mainMenu.style.display = "none";
    backToMenuBtn.style.display = "block";

    console.log("🎮 SINGLE PLAYER STARTED");
});

multiplayerBtn.addEventListener("click", () => {
    selectGameMode("multiplayer");

    gameStarted = true;
    mainMenu.style.display = "none";
    backToMenuBtn.style.display = "block";

    console.log("🌐 MULTIPLAYER STARTED");
});