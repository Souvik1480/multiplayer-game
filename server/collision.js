const { MAP, TILE_SIZE } = require("./map");

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

module.exports = {

    isWall,
    bulletHitWall

};