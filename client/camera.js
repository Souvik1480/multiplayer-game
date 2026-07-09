import { myId } from "./network.js";

export let cameraX = 0;
export let cameraY = 0;

export function updateCamera(players) {

    //const ids = Object.keys(players);

    
    const p = players[myId];

    if(!p) return;

    cameraX =
        p.x - window.innerWidth / 2 + 25;

    cameraY =
        p.y - window.innerHeight / 2 + 25;

}