const {

    MAP,
    TILE_SIZE

} = require("./map");

const WebSocket = require("ws");

const players = {};
const bullets = [];
const particles = [];

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

        angle: 0,

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

        if (input.shoot > 0) {
            p.shoot = true;
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

function isWall(x, y) {

    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    if (
        row < 0 ||
        row >= MAP.length ||
        col < 0 ||
        col >= MAP[0].length
    ) {
        return true;
    }

    return MAP[row][col] === "#";
}

function bulletHitWall(x, y) {

    return isWall(x, y);

}

setInterval(() => {

    // PLAYER UPDATE
    for (const id in players) {

        const p = players[id];

        if (!p.alive)
            continue;

        let newX = p.x;
        let newY = p.y;

        if (p.up)
            newY -= 5;

        if (p.down)
            newY += 5;

        if (p.left)
            newX -= 5;

        if (p.right)
            newX += 5;

        const size = 50;

        const hitWall =

            isWall(newX, newY) ||

            isWall(newX + size, newY) ||

            isWall(newX, newY + size) ||

            isWall(newX + size, newY + size);

        if (!hitWall) {

            p.x = newX;
            p.y = newY;

        }

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
                p.angle = Math.atan2(dy, dx);
            }

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

        if (isWall(b.x, b.y)) {

            for (let j = 0; j < 8; j++) {

                particles.push({

                    x: b.x,
                    y: b.y,

                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,

                    life: 20,

                    color: "orange"

                });

            }

            bullets.splice(i, 1);

            continue;

        }

        if (

            bulletHitWall(

                b.x,

                b.y

            )

        ) {

            bullets.splice(i, 1);

            continue;

        }

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
                console.log("HIT DETECTED");

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

            console.log("ADDING PARTICLE");

            particles.push({

                x: b.x,

                y: b.y,

                life: 20

            });
            console.log("Particle created:", particles.length);
        }
    }

    for (

        let i =
            particles.length - 1;

        i >= 0;

        i--

    ) {

        particles[i].life--;

        if (

            particles[i].life <= 0

        ) {

            particles.splice(i, 1);

        }

    }

}, 1000 / 60);

// SEND GAME STATE
setInterval(() => {

    // console.log("sending particles:", particles.length);
    const state =
        JSON.stringify({

            players,
            bullets,
            particles

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