const players = require("./state");

function update(){

    for(const id in players){

        const p = players[id];

        if(p.keys.w) p.y -= p.speed;
        if(p.keys.s) p.y += p.speed;
        if(p.keys.a) p.x -= p.speed;
        if(p.keys.d) p.x += p.speed;

    }

}

module.exports = update;