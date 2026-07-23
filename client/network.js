import { playPistol, playRifle, playReload, playEmpty } from "./sound.js";
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

            case "explosion":

                console.log(

                    "💥 Explosion at",

                    sound.x,

                    sound.y

                );

                break;

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