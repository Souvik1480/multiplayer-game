class Player{

    constructor(id){

        this.id = id;

        this.x = 100;
        this.y = 100;

        this.speed = 5;

        this.color =
            "#" +
            Math.floor(Math.random()*16777215)
            .toString(16);

        this.keys = {};
    }

}

module.exports = Player;