import { playPistol, playRifle, playReload, playEmpty, playExplosion } from "./sound.js";
import { createExplosion } from "./effects.js";
import { addCameraShake } from "./camera.js";
const socket = new WebSocket(
    "ws://127.0.0.1:8080"
);

export let players = {};
export let bullets = [];
export let myId = "";
export let grenades = [];

socket.onopen = () => {

    console.log("✅ Connected!");

};

socket.onmessage = (event) => {

    const data =
        JSON.parse(event.data);

    if (data.type === "init") {
        myId = data.id;
        console.log("MY ID:", myId)
        return;
    }

    players = data.players;
    bullets = data.bullets || [];
    grenades = data.grenades || [];
    console.log(players);

    if (data.sounds && data.sounds.length > 0) {

    }

    for (const sound of data.sounds || []) {

        switch (sound.type) {

            case "gun": {

                // Don't play our own gun sound again
                if (sound.player === myId) break;

                const me = players[myId];
                const shooter = players[sound.player];

                if (!me || !shooter) break;

                const dx = shooter.x - me.x;
                const dy = shooter.y - me.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                // Maximum hearing distance
                const MAX_DISTANCE = 1000;

                // Convert distance into volume
                let volume = 1 - (distance / MAX_DISTANCE);

                // Clamp between 0 and 1
                volume = Math.max(0, Math.min(1, volume));

                if (sound.weapon === "pistol") {

                    playPistol(volume);

                }
                else if (sound.weapon === "rifle") {

                    playRifle(volume);

                }

                break;
            }

            case "reload":

                if (sound.player === myId) {

                    playReload();

                }

                break;

            case "empty":

                if (sound.player === myId) {

                    playEmpty();

                }

                break;

            case "explosion": {

                createExplosion(
                    sound.x,
                    sound.y
                );

                const me = players[myId];

                if (me) {

                    const dx = (me.x + 25) - sound.x;
                    const dy = (me.y + 25) - sound.y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const MAX_DISTANCE = 1000;

                    const volume = Math.max(
                        0,
                        1 - distance / MAX_DISTANCE
                    );

                    if (volume > 0) {
                        playExplosion(volume);
                    }
                }

                break;
            }

        }

    }

};

socket.onerror = (err) => {

    console.log(
        "WS ERROR:",
        err
    );

};

export default socket;