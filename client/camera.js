export let cameraX = 0;
export let cameraY = 0;

export function updateCamera(players) {

    const ids = Object.keys(players);

    if (ids.length === 0)
        return;

    // For now, follow the first player.
    // Later we'll follow the local player.

    const p = players[ids[0]];

    cameraX =
        p.x - window.innerWidth / 2 + 25;

    cameraY =
        p.y - window.innerHeight / 2 + 25;

}