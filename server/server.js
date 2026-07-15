const {

    WEAPONS,

    fireWeapon

} = require("./weapons");

const {

    MAP,
    TILE_SIZE

} = require("./map");

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

        weapon: "pistol",

        ammo: {
            pistol: 12,

            rifle: 30
        },

        reloading: false,


        lastShot: 0,
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

    ws.send(
        JSON.stringify({

            type: "init",

            id: id

        })
    );

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

        p.reload = input.reload;

        if (

            input.weapon &&

            input.weapon !== p.weapon

        ) {

            p.weapon = input.weapon;

            console.log(

                p.name,

                "SWITCHED TO",

                p.weapon

            );

        }

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

        const weapon = WEAPONS[p.weapon];

        //X movement

        const hitWallX =

            isWall(newX, p.y) ||

            isWall(newX + size, p.y) ||

            isWall(newX, p.y + size) ||

            isWall(newX + size, p.y + size);

        if (!hitWallX) {

            p.x = newX;

        }

        //Y movement

        const hitWallY =

            isWall(p.x, newY) ||

            isWall(p.x + size, newY) ||

            isWall(p.x, newY + size) ||

            isWall(p.x + size, newY + size);

        if (!hitWallY) {

            p.y = newY;

        }

        //reloading

        if (

            p.reload &&

            !p.reloading &&

            p.ammo[p.weapon] < weapon.magazine

        ) {

            const reloadWeapon = p.weapon;

            p.reloading = true;
            p.reload = false;

            console.log(
                p.name,
                "is reloading..."
            );

            setTimeout(() => {

                p.ammo[reloadWeapon] =
                    WEAPONS[reloadWeapon].magazine;

                p.reloading = false;

                console.log(
                    p.name,
                    "reloaded!"
                );

            }, WEAPONS[reloadWeapon].reloadTime);

        }
        
        //shooting



        if (

            p.shoot &&

            !p.reloading &&

            p.ammo[p.weapon] > 0 &&

            Date.now() - p.lastShot >= weapon.fireRate

        ) {

            fireWeapon(

                p,

                bullets,

                id

            );

            console.log(
                "SHOT WITH:",
                p.weapon,
                "AMMO:",
                p.ammo[p.weapon]
            );

            p.ammo[p.weapon]--;

            p.lastShot = Date.now();

            console.log(
                "BULLETS:",
                bullets.length
            );

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
                        p.hp - b.damage
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