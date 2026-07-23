export const keys = {
    w: false,
    a: false,
    s: false,
    d: false,

    one: false,
    two: false,

    reload: false
};

window.addEventListener("keydown", (e) => {

    const key = e.key.toLowerCase();

    if (key === "w") keys.w = true;
    if (key === "a") keys.a = true;
    if (key === "s") keys.s = true;
    if (key === "d") keys.d = true;

    if (e.key === "1") keys.one = true;
    if (e.key === "2") keys.two = true;

    if (key === "r") keys.reload = true;
    if (key === "g") keys.grenade = true;
});

window.addEventListener("keyup", (e) => {

    const key = e.key.toLowerCase();

    if (key === "w") keys.w = false;
    if (key === "a") keys.a = false;
    if (key === "s") keys.s = false;
    if (key === "d") keys.d = false;

    if (e.key === "1") keys.one = false;
    if (e.key === "2") keys.two = false;

    if (key === "r") keys.reload = false;
    if (key === "g") keys.grenade = false;

});