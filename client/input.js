export const keys = {
    w:false,
    a:false,
    s:false,
    d:false,

    one:false,
    two:false
};

window.addEventListener("keydown",(e)=>{

    if(e.key==="w") keys.w=true;
    if(e.key==="a") keys.a=true;
    if(e.key==="s") keys.s=true;
    if(e.key==="d") keys.d=true;

    if(e.key==="1") keys.one=true;
    if(e.key==="2") keys.two=true;
    
    console.log(keys);
});

window.addEventListener("keyup",(e)=>{

    if(e.key==="w") keys.w=false;
    if(e.key==="a") keys.a=false;
    if(e.key==="s") keys.s=false;
    if(e.key==="d") keys.d=false;

    if(e.key==="1") keys.one=false;
    if(e.key==="2") keys.two=false;

});