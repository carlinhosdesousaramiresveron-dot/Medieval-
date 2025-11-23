const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");
canvas.width=800;canvas.height=450;

const menu=document.getElementById("menu");
const startBtn=document.getElementById("startBtn");
const music=document.getElementById("bgMusic");

let keys={};
let enemy={x:600,y:360,w:40,h:40,dir:-1};
let player={x:50,y:350,w:40,h:60,vy:0,onGround:false,hp:100,attacking:false};

let gravity=1;
let platforms=[{x:0,y:400,w:800,h:50},{x:300,y:300,w:150,h:20},{x:520,y:250,w:160,h:20}];

document.addEventListener("keydown",e=>keys[e.key]=true);
document.addEventListener("keyup",e=>keys[e.key]=false);

startBtn.onclick=()=>{
    menu.style.display="none";
    canvas.style.display="block";
    music.play();
}

function drawPlayer(){
    ctx.fillStyle="gold";
    ctx.fillRect(player.x,player.y,player.w,player.h);
    if(player.attacking){
        ctx.fillStyle="silver";
        ctx.fillRect(player.x+player.w,player.y+10,20,10);
    }
}

function drawEnemy(){
    ctx.fillStyle="red";
    ctx.fillRect(enemy.x,enemy.y,enemy.w,enemy.h);
}

function physics(){
    if(keys["ArrowRight"]) player.x+=4;
    if(keys["ArrowLeft"]) player.x-=4;
    if(keys[" "]&&player.onGround){player.vy=-18;player.onGround=false;}
    if(keys["f"]) player.attacking=true; else player.attacking=false;

    player.vy+=gravity;
    player.y+=player.vy;

    player.onGround=false;
    platforms.forEach(p=>{
        if(player.x<p.x+p.w && player.x+player.w>p.x &&
           player.y+player.h>p.y && player.y+player.h<p.y+20 &&
           player.vy>=0){
            player.y=p.y-player.h;
            player.vy=0;
            player.onGround=true;
        }
    });
}

function enemyAI(){
    enemy.x+=enemy.dir*2;
    if(enemy.x<400||enemy.x>750) enemy.dir*=-1;
    if(player.x<enemy.x+enemy.w && player.x+player.w>enemy.x &&
       player.y<enemy.y+enemy.h && player.y+player.h>enemy.y){
        if(!player.attacking){
            player.hp-=1;
        } else {
            enemy.x=900;
        }
    }
}

function drawHUD(){
    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText("HP: "+player.hp,20,30);
}

function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    platforms.forEach(p=>{
        ctx.fillStyle="#444";
        ctx.fillRect(p.x,p.y,p.w,p.h);
    });

    physics();
    enemyAI();
    drawPlayer();
    drawEnemy();
    drawHUD();

    requestAnimationFrame(loop);
}
loop();
