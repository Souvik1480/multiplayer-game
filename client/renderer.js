export function render(ctx, players){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    for(const id in players){

        const player = players[id];

        ctx.fillStyle = player.color;

        ctx.fillRect(
            player.x,
            player.y,
            50,
            50
        );
    }
}