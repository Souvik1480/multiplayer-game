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

};

socket.onerror = (err) => {

    console.log(
        "WS ERROR:",
        err
    );

};

export default socket;