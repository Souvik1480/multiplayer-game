const pistol = new Audio("audio/pistol.mp3");
const rifle = new Audio("audio/rifle.mp3");
const reload = new Audio("audio/reload.mp3");
const empty = new Audio("audio/empty.mp3");
const explosion = new Audio("audio/explosion.mp3");

// Volume
pistol.volume = 0.35;
rifle.volume = 0.30;
reload.volume = 0.45;
empty.volume = 0.40;
explosion.volume = 0.45;

// ----------
// FUNCTIONS
// ----------

export function playPistol(volume = 1) {

    const s = pistol.cloneNode();

    s.volume = pistol.volume * volume;

    s.play();

}

export function playRifle(volume = 1) {

    const s = rifle.cloneNode();

    s.volume = rifle.volume * volume;

    s.play();

}

export function playReload() {

    const s = reload.cloneNode();

    s.volume = reload.volume;

    s.play();

}

export function playEmpty() {

    const s = empty.cloneNode();

    s.volume = empty.volume;

    s.play();

}

export function playExplosion(volume = 1) {

    const s = explosion.cloneNode();

    s.volume = explosion.volume * volume;

    s.play().catch(err => console.error(err));

}