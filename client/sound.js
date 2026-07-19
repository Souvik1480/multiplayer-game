const pistol = new Audio("audio/pistol.mp3");
const rifle = new Audio("audio/rifle.mp3");
const reload = new Audio("audio/reload.mp3");
const empty = new Audio("audio/empty.mp3");

// Volume
pistol.volume = 0.35;
rifle.volume = 0.30;
reload.volume = 0.45;
empty.volume = 0.40;

// ----------
// FUNCTIONS
// ----------

export function playPistol() {

    const s = pistol.cloneNode();

    s.volume = pistol.volume;

    s.play();

}

export function playRifle() {

    const s = rifle.cloneNode();

    s.volume = rifle.volume;

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