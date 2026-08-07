const { isWall } = require("./collision");

function moveBot(bot, moveX, moveY) {

    const newX = bot.x + moveX;
    const newY = bot.y + moveY;

    const size = 50;

    // X collision
    const hitWallX =

        isWall(newX, bot.y) ||

        isWall(newX + size, bot.y) ||

        isWall(newX, bot.y + size) ||

        isWall(newX + size, bot.y + size);

    if (!hitWallX) {

        bot.x = newX;

    }

    // Y collision
    const hitWallY =

        isWall(bot.x, newY) ||

        isWall(bot.x + size, newY) ||

        isWall(bot.x, newY + size) ||

        isWall(bot.x + size, newY + size);

    if (!hitWallY) {

        bot.y = newY;

    }

    return hitWallX || hitWallY;

}


function updateBots(players) {

    for (const id in players) {

        const bot = players[id];

        if (!bot.bot) continue;

        let nearest = null;
        let nearestDistance = Infinity;

        for (const targetId in players) {

            const target = players[targetId];

            // Ignore bots
            if (target.bot) continue;

            // Ignore dead players
            if (!target.alive) continue;

            const dx = target.x - bot.x;
            const dy = target.y - bot.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {

                nearestDistance = distance;
                nearest = target;

            }

        }

        bot.target = nearest;

        if (nearest) {

            const dx = nearest.x - bot.x;
            const dy = nearest.y - bot.y;

            bot.angle = Math.atan2(dy, dx);

            const distance = Math.sqrt(dx * dx + dy * dy);

            const ATTACK_RANGE = 250;

            const BOT_SPEED = 2;

            // --------------------
            // OBSTACLE AVOIDANCE
            // --------------------

            if (bot.avoidTimer > 0) {

                bot.avoidTimer--;

                const avoidX = Math.cos(bot.avoidDirection) * BOT_SPEED;
                const avoidY = Math.sin(bot.avoidDirection) * BOT_SPEED;

                moveBot(bot, avoidX, avoidY);

                continue;

            }

            if (distance > ATTACK_RANGE) {

                const moveX = (dx / distance) * BOT_SPEED;
                const moveY = (dy / distance) * BOT_SPEED;

                const hitWall = moveBot(bot, moveX, moveY);

                if (hitWall) {

                    bot.avoidTimer = 30;
                    bot.avoidDirection = Math.random() * Math.PI * 2;

                }

            } else {

                if (bot.ammo[bot.weapon] > 0) {

                    bot.shoot = true;

                } else {

                    bot.reload = true;

                }

            }

        }

    }

}

module.exports = {

    updateBots

};