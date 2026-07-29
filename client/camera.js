import { myId } from "./network.js";

export let cameraX = 0;
export let cameraY = 0;

export let shakeX = 0;
export let shakeY = 0;

let shakeStrength = 0;

export function updateCamera(players) {

    const p = players[myId];

    if (!p) return;

    const targetX =
        p.x - window.innerWidth / 2 + 25;

    const targetY =
        p.y - window.innerHeight / 2 + 25;

    cameraX +=
        (targetX - cameraX) * 0.10;

    cameraY +=
        (targetY - cameraY) * 0.10;

    // CAMERA SHAKE
    if (shakeStrength > 0) {

        shakeX =
            (Math.random() - 0.5) *
            shakeStrength;

        shakeY =
            (Math.random() - 0.5) *
            shakeStrength;

        shakeStrength *= 0.85;

        if (shakeStrength < 0.2) {

            shakeStrength = 0;

            shakeX = 0;
            shakeY = 0;

        }

    }

}

export function addCameraShake(strength) {

    shakeStrength = Math.max(

        shakeStrength,

        strength

    );

}