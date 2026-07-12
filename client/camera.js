import { myId } from "./network.js";

export let cameraX = 0;
export let cameraY = 0;

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

}