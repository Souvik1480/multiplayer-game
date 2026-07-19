import { playPistol, playRifle, playReload, playEmpty } from "./sound.js";
const socket = new WebSocket(
    "ws://127.0.0.1:8080"
);

export let players = {};
export let bullets = [];
export let myId = "";

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

    for (const sound of data.sounds || []) {

        switch (sound.type) {

            case "gun":

                // Ignore our own shots.
                // We already played them instantly in game.js.
                if (sound.player === myId) {

                    break;

                }

                if (sound.weapon === "pistol") {

                    playPistol();

                }
                else if (sound.weapon === "rifle") {

                    playRifle();

                }

                break;

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