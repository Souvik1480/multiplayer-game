export const keys = {
    w:false,
    a:false,
    s:false,
    d:false
};

window.addEventListener("keydown",(e)=>{

    if(e.key==="w") keys.w=true;
    if(e.key==="a") keys.a=true;
    if(e.key==="s") keys.s=true;
    if(e.key==="d") keys.d=true;

});

window.addEventListener("keyup",(e)=>{

    if(e.key==="w") keys.w=false;
    if(e.key==="a") keys.a=false;
    if(e.key==="s") keys.s=false;
    if(e.key==="d") keys.d=false;

});