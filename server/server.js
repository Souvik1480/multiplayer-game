const WebSocket = require("ws");

const players = {};

const wss = new WebSocket.Server({
    port: 8080
});

console.log(
    "Server running on port 8080"
);

wss.on(
    "connection",
    (ws) => {

        const id = Date.now();

        players[id] = {

            x: 100,
            y: 100,

            up: false,
            down: false,
            left: false,
            right: false

        };

        console.log(
            "Client connected",
            id
        );

        ws.on(
            "message",
            (message) => {

                const input =
                    JSON.parse(
                        message.toString()
                    );

                players[id].up =
                    input.up;

                players[id].down =
                    input.down;

                players[id].left =
                    input.left;

                players[id].right =
                    input.right;

            }
        );

        ws.on(
            "close",
            () => {

                delete players[id];

            }
        );

    }
);

setInterval(() => {

    for (const id in players) {

        const p =
            players[id];

        if (p.up)
            p.y -= 5;

        if (p.down)
            p.y += 5;

        if (p.left)
            p.x -= 5;

        if (p.right)
            p.x += 5;

    }

}, 1000 / 60);

setInterval(() => {

    const state =
        JSON.stringify({

            players

        });

    wss.clients.forEach(
        (client) => {

            if (
                client.readyState ===
                WebSocket.OPEN
            ) {

                client.send(
                    state
                );

            }

        }
    );

}, 1000 / 60);