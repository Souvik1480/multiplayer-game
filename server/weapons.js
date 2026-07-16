const WEAPONS = {

    pistol: {

        damage: 10,

        speed: 25,

        spread: 0,

        fireRate: 300,

        bulletOffset: 40,

        magazine: 12,

        reloadTime: 1200

    },

    rifle: {

        damage: 6,

        speed: 35,

        spread: 0.03,

        fireRate: 100,

        bulletOffset: 40,

        magazine: 30,

        reloadTime: 1800

    }

};

function fireWeapon(player, bullets, ownerId) {

    console.log("FIRE WEAPON:", player.weapon);

    const weapon = WEAPONS[player.weapon];

    if (!weapon)
        return;

    const centerX = player.x + 25;
    const centerY = player.y + 25;

    const dx = player.mouseX - centerX;
    const dy = player.mouseY - centerY;

    const spread =

        (Math.random() - 0.5) *

        weapon.spread;

    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0)
        return;

    const angle =

        Math.atan2(dy, dx) +

        spread;

    player.angle = angle;

    bullets.push({

        owner: ownerId,

        damage: weapon.damage,

        x:
            centerX +
            Math.cos(angle) *
            weapon.bulletOffset,

        y:
            centerY +
            Math.sin(angle) *
            weapon.bulletOffset,

        // NEW
        prevX:
            centerX +
            Math.cos(angle) *
            weapon.bulletOffset,

        prevY:
            centerY +
            Math.sin(angle) *
            weapon.bulletOffset,

        vx:
            Math.cos(angle) *
            weapon.speed,

        vy:
            Math.sin(angle) *
            weapon.speed,

    });

}

module.exports = {

    WEAPONS,

    fireWeapon

};