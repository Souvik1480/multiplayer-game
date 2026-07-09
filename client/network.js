const socket = new WebSocket(
    "ws://127.0.0.1:8080"
);

export let players = {};
export let bullets = [];
export let particles = [];

socket.onopen = () => {

    console.log("✅ Connected!");

};

socket.onmessage = (event) => {

    const data =
        JSON.parse(event.data);

    players = data.players;
    console.log(Object.keys(players).length);
    bullets = data.bullets || [];
    particles=data.particles || [];
};

socket.onerror = (err) => {

    console.log(
        "WS ERROR:",
        err
    );

};

export default socket;