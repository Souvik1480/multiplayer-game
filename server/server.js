const {

    WEAPONS,

    fireWeapon

} = require("./weapons");

const {

    MAP,
    TILE_SIZE

} = require("./map");

const WebSocket = require("ws");

const { updateBots } = require("./ai");

const { isWall, bulletHitWall } = require("./collision");

const GAME_MODE = "singleplayer";

const players = {};
const bullets = [];
const soundEvents = [];
const grenades = [];
const killFeed = [];
const healthPacks = [];
const healEvents = [];
const impactEvents = [];
const deathEvents = [];

const wss = new WebSocket.Server({
    port: 8080
});

console.log("Server running on port 8080");

function spawnHealthPack(x, y) {

    healthPacks.push({
        id: Date.now() + Math.random(),

        x: x,
        y: y,

        amount: 25,

        active: true,

        respawnTimer: 0
    });

}
spawnHealthPack(200, 200);
spawnHealthPack(700, 250);
spawnHealthPack(400, 600);
spawnHealthPack(900, 500);

wss.on("connection", (ws) => {

    const id = Date.now().toString();

    ws.id = id;

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
        deaths: 0,

        respawnTimer: 0,

        flash: 0,

        hitMarker: 0,

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


        // GAME MODE
        if (input.type === "gameMode") {

            console.log(
                "🎮 GAME MODE SELECTED:",
                input.mode
            );


            if (input.mode === "singleplayer") {

                console.log(
                    "🎮 SINGLE PLAYER MODE"
                );


                players["bot1"] = {

                    name: "Bot",

                    weapon: "pistol",

                    ammo: {
                        pistol: 12,
                        rifle: 30
                    },

                    reloading: false,

                    lastShot: 0,

                    kills: 0,
                    deaths: 0,

                    respawnTimer: 0,

                    flash: 0,

                    hitMarker: 0,

                    hp: 100,
                    alive: true,

                    x: 600,
                    y: 300,

                    angle: 0,

                    mouseX: 600,
                    mouseY: 300,

                    shoot: false,

                    up: false,
                    down: false,
                    left: false,
                    right: false,

                    bot: true,

                    avoidTimer: 0,

                    avoidDirection: 0

                };

            }


            if (input.mode === "multiplayer") {

                console.log(
                    "🌐 MULTIPLAYER MODE"
                );

            }


            return;
        }


        // NORMAL PLAYER INPUT
        const p = players[id];

        if (!p) return;

        p.up = input.up;
        p.down = input.down;
        p.left = input.left;
        p.right = input.right;

        p.mouseX = input.mouseX;
        p.mouseY = input.mouseY;

        p.reload = input.reload;

        if (input.grenade && !p.grenade) {
            p.grenade = true;
        }

        if (
            input.weapon &&
            input.weapon !== p.weapon
        ) {

            p.weapon = input.weapon;

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

setInterval(() => {        //main game loop

    updateBots(players);

    // PLAYER UPDATE
    for (const id in players) {

        const p = players[id];

        if (p.flash > 0) {

            p.flash--;
        }

        if (p.hitMarker > 0) {

            p.hitMarker--;

        }

        if (!p.alive) {

            p.respawnTimer--;

            if (p.respawnTimer <= 0) {

                p.alive = true;

                p.hp = 100;

                p.weapon = "pistol";

                p.ammo.pistol = 12;
                p.ammo.rifle = 30;

                let safe = false;

                while (!safe) {

                    const x = Math.random() * 800;
                    const y = Math.random() * 600;

                    if (

                        !isWall(x, y) &&

                        !isWall(x + 50, y) &&

                        !isWall(x, y + 50) &&

                        !isWall(x + 50, y + 50)

                    ) {

                        p.x = x;
                        p.y = y;

                        safe = true;
                    }
                }

                console.log(p.name, "RESPAWNED");
            }

            continue;
        }

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

            soundEvents.push({

                type: "reload",

                player: id

            });

            p.reload = false;

            console.log(
                p.name,
                "is reloading..."
            );

            setTimeout(() => {

                p.ammo[reloadWeapon] =
                    WEAPONS[reloadWeapon].magazine;

                p.reloading = false;

            }, WEAPONS[reloadWeapon].reloadTime);

        }

        //shooting
        if (

            p.shoot &&

            !p.reloading &&

            p.ammo[p.weapon] > 0 &&

            Date.now() - p.lastShot >= weapon.fireRate

        ) {

            console.log(
                p.bot ? "🤖 BOT FIRED!" : "👤 PLAYER FIRED!"
            );

            fireWeapon(

                p,

                bullets,

                id,

                soundEvents

            );

            p.flash = 3;

            p.ammo[p.weapon]--;

            p.lastShot = Date.now();

            p.shoot = false;

        }

        //Empty magazine
        if (

            p.shoot &&

            !p.reloading &&

            p.ammo[p.weapon] === 0

        ) {

            soundEvents.push({

                type: "empty",

                player: id

            });

            p.shoot = false;

        }

        //Grenades
        if (p.grenade) {

            const dx = p.mouseX - (p.x + 25);
            const dy = p.mouseY - (p.y + 25);

            const len = Math.sqrt(dx * dx + dy * dy);

            if (len > 0) {

                grenades.push({

                    owner: id,

                    x: p.x + 25,

                    y: p.y + 25,

                    vx: (dx / len) * 8,

                    vy: (dy / len) * 8,

                    timer: 180     // 3 seconds @ 60 FPS

                });

            }

            // Prevent creating 60 grenades while G is held
            p.grenade = false;
        }

        //Pickup detection
        for (const id in players) {

            const player = players[id];

            if (!player.alive)
                continue;

            for (const hp of healthPacks) {

                if (!hp.active)
                    continue;

                // Don't consume a health pack if already full HP
                if (player.hp >= 100)
                    continue;

                const playerCenterX = player.x + 25;
                const playerCenterY = player.y + 25;

                const healthCenterX = hp.x + 15;
                const healthCenterY = hp.y + 15;

                const dx = playerCenterX - healthCenterX;
                const dy = playerCenterY - healthCenterY;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 30) {

                    player.hp = Math.min(100, player.hp + hp.amount);

                    hp.active = false;
                    hp.respawnTimer = 600;

                    healEvents.push({
                        player: id,
                        x: player.x + 25,
                        y: player.y
                    });

                }
            }
        }


    }


    // BULLET UPDATE
    for (
        let i =
            bullets.length - 1;
        i >= 0;
        i--
    ) {

        const b = bullets[i];

        b.prevX = b.x;
        b.prevY = b.y;

        b.x += b.vx;
        b.y += b.vy;

        if (isWall(b.x, b.y)) {

            impactEvents.push({

                x: b.x,
                y: b.y,

                type: "wall"

            });

            bullets.splice(i, 1);

            continue;

        }

        if (bulletHitWall(b.x, b.y)) {

            impactEvents.push({

                x: b.x,
                y: b.y,

                type: "wall"

            });

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

                p.hp = Math.max(
                    0,
                    p.hp - b.damage
                );

                // Check if the player just died
                if (p.hp <= 0 && p.alive) {


                    p.alive = false;

                    deathEvents.push({

                        x: p.x + 25,
                        y: p.y + 25

                    });

                    p.deaths++;

                    p.respawnTimer = 300;

                    if (players[b.owner]) {

                        players[b.owner].kills++;

                        killFeed.unshift({
                            killer: players[b.owner].name,
                            victim: p.name,
                            weapon: b.weapon,
                            timer: 300
                        });
                    }
                }

                hit = true;

                impactEvents.push({

                    x: b.x,
                    y: b.y,

                    type: "player"

                });

                const shooter = players[b.owner];

                if (shooter) {

                    shooter.hitMarker = 5;

                }

                break;
            }
        }

        if (hit) {

            bullets.splice(i, 1);

        }

    }


    // GRENADE UPDATE
    for (let i = grenades.length - 1; i >= 0; i--) {

        const g = grenades[i];

        // Move
        const nextX = g.x + g.vx;
        const nextY = g.y + g.vy;

        //grenade trail
        g.trailTimer ??= 0;

        g.trailTimer++;

        if (g.trailTimer >= 3) {

            g.trailTimer = 0;

            soundEvents.push({

                type: "grenadeTrail",

                x: g.x,

                y: g.y

            });

        }

        //x collision
        if (isWall(nextX, g.y)) {

            if (Math.abs(g.vx) > 1) {

                soundEvents.push({
                    type: "grenadeBounce",
                    x: g.x,
                    y: g.y
                });

            }

            g.vx *= -0.7;


        } else {

            g.x = nextX;

        }

        //y collision
        if (isWall(g.x, nextY)) {

            if (Math.abs(g.vy) > 1) {

                soundEvents.push({
                    type: "grenadeBounce",
                    x: g.x,
                    y: g.y
                });

            }

            g.vy *= -0.7;


        } else {

            g.y = nextY;

        }

        // Friction
        g.vx *= 0.98;
        g.vy *= 0.98;

        if (Math.abs(g.vx) < 0.15)
            g.vx = 0;

        if (Math.abs(g.vy) < 0.15)
            g.vy = 0;

        g.timer--;

        if (g.timer <= 0) {

            // Explosion radius
            const RADIUS = 150;

            // Damage every player inside the radius
            for (const id in players) {

                const p = players[id];

                if (!p.alive) continue;

                const dx = (p.x + 25) - g.x;
                const dy = (p.y + 25) - g.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= RADIUS) {

                    const damage = Math.round(
                        80 * (1 - distance / RADIUS)
                    );

                    p.hp = Math.max(
                        0,
                        p.hp - damage
                    );

                    //Player died?
                    if (p.hp <= 0 && p.alive) {

                        p.alive = false;
                        console.log(
                            "DEATH:",
                            p.name,
                            "at",
                            p.x,
                            p.y
                        );

                        deathEvents.push({

                            x: p.x + 25,
                            y: p.y + 25

                        });

                        p.deaths++;

                        p.respawnTimer = 300;

                        //Award the kill
                        if (players[g.owner]) {
                            players[g.owner].kills++;

                            killFeed.unshift({
                                killer: players[g.owner].name,
                                victim: p.name,
                                weapon: "grenade",
                                timer: 300
                            });
                        }
                    }

                }

            }

            soundEvents.push({

                type: "explosion",

                x: g.x,

                y: g.y

            });

            grenades.splice(i, 1);

        }

    }

    // HEALTH PACK RESPAWN
    for (const hp of healthPacks) {

        if (hp.active)
            continue;

        hp.respawnTimer--;

        if (hp.respawnTimer <= 0) {

            hp.active = true;

            hp.respawnTimer = 0;

        }

    }

    //KILL FEED TIMER
    for (let i = killFeed.length - 1; i >= 0; i--) {

        killFeed[i].timer--;

        if (killFeed[i].timer <= 0) {

            killFeed.splice(i, 1);

        }

    }

}, 1000 / 60);

// SEND GAME STATE
setInterval(() => {

    wss.clients.forEach((client) => {

        if (client.readyState !== WebSocket.OPEN)
            return;

        const state = JSON.stringify({

            players,
            bullets,
            grenades,
            killFeed,
            healthPacks,

            sounds: soundEvents,
            impactEvents,
            deathEvents,

            healEvent:
                healEvents.find(
                    e => e.player === client.id
                ) || null

        });

        client.send(state);

    });

    soundEvents.length = 0;
    healEvents.length = 0;
    impactEvents.length = 0;
    deathEvents.length = 0;

}, 1000 / 60);