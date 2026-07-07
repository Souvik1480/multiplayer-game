const WebSocket = require("ws");

const players = {};
const bullets = [];

const wss = new WebSocket.Server({
    port: 8080
});

console.log("Server running on port 8080");

wss.on("connection", (ws) => {

    const id = Date.now().toString();

    players[id] = {

        name: "Player" + id.slice(-3),

        kills: 0,
        respawn: 0,

        hp: 100,
        alive: true,

        x: 100,
        y: 100,

        mouseX: 0,
        mouseY: 0,

        shoot: false,

        up: false,
        down: false,
        left: false,
        right: false
    };

    console.log("Client connected", id);

    ws.on("message", (message) => {

        const input = JSON.parse(
            message.toString()
        );

        if (input.shoot) {
            console.log("SERVER SHOT");
        }

        const p = players[id];

        if (!p) return;

        p.up = input.up;
        p.down = input.down;
        p.left = input.left;
        p.right = input.right;

        p.mouseX = input.mouseX;
        p.mouseY = input.mouseY;

        if(input.shoot>0){
            p.shoot=true;
        }
    });

    ws.on("close", () => {

        delete players[id];

        console.log(
            "Client disconnected",
            id
        );
    });
});

setInterval(() => {

    // PLAYER UPDATE
    for (const id in players) {

        const p = players[id];

        if (!p.alive)
            continue;

        if (p.up)
            p.y -= 5;

        if (p.down)
            p.y += 5;

        if (p.left)
            p.x -= 5;

        if (p.right)
            p.x += 5;

        // SHOOT
        if (p.shoot) {

            const dx =
                p.mouseX - p.x;

            const dy =
                p.mouseY - p.y;

            const len =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (len > 0) {

                bullets.push({

                    owner: id,

                    x:
                        p.x + 25 +
                        dx / len * 40,

                    y:
                        p.y + 25 +
                        dy / len * 40,

                    vx:
                        dx / len * 25,

                    vy:
                        dy / len * 25
                });

                console.log(
                    "BULLETS:",
                    bullets.length
                );
            }

            p.shoot = false;
        }
    }

    // BULLET UPDATE
    for (
        let i =
            bullets.length - 1;
        i >= 0;
        i--
    ) {

        const b =
            bullets[i];

        b.x += b.vx;
        b.y += b.vy;

        // remove offscreen bullets
        if (

            b.x < -100 ||
            b.y < -100 ||

            b.x > 3000 ||
            b.y > 3000

        ) {

            bullets.splice(i, 1);

            continue;
        }

        let hit = false;

        for (const id in players) {

            if (id === b.owner)
                continue;

            const p =
                players[id];

            if (!p.alive)
                continue;

            if (

                b.x > p.x &&
                b.x < p.x + 50 &&

                b.y > p.y &&
                b.y < p.y + 50

            ) {

                p.hp =
                    Math.max(
                        0,
                        p.hp - 10
                    );

                console.log(
                    p.name,
                    "HP:",
                    p.hp
                );

                hit = true;

                // DEATH
                if (
                    p.hp === 0 &&
                    p.alive
                ) {

                    const killer =
                        players[b.owner];

                    if (killer) {

                        killer.kills++;

                        console.log(

                            killer.name,

                            "KILLS:",

                            killer.kills
                        );
                    }

                    p.alive = false;

                    const deadPlayer = p;

                    deadPlayer.respawn = 5;

                    const timer =
                        setInterval(() => {

                            deadPlayer.respawn--;

                            if (
                                deadPlayer.respawn <= 0
                            ) {

                                clearInterval(
                                    timer
                                );
                            }

                        }, 1000);

                    console.log(
                        deadPlayer.name,
                        "DIED"
                    );

                    setTimeout(() => {

                        deadPlayer.hp = 100;

                        deadPlayer.alive = true;

                        deadPlayer.respawn = 0;

                        deadPlayer.x =
                            Math.random() * 800;

                        deadPlayer.y =
                            Math.random() * 600;

                        console.log(
                            deadPlayer.name,
                            "RESPAWNED"
                        );

                    }, 5000);
                }

                break;
            }
        }

        if (hit) {

            bullets.splice(i, 1);
        }
    }

}, 1000 / 60);

// SEND GAME STATE
setInterval(() => {

    const state =
        JSON.stringify({

            players,
            bullets

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