let score = 0;
let map = "";
let trashCount = 0;
let playerY = 10;
let velocity = 0;
let jumping = false;

const world = document.getElementById("world");
const player = document.getElementById("player");

const maps = {
  forest: {
    mission: "🌳 Khu rừng quá bẩn! Hãy dọn sạch!",
    trash: 5,
    questions: [
      ["Rác nhựa gây hại gì?",["Ô nhiễm","Tốt","Không sao","Đẹp"],0],
      ["Giữ rừng giúp gì?",["Chống lũ","Phá hoại","Ô nhiễm","Không ích"],0],
      ["Ai bảo vệ rừng?",["Mọi người","Không ai","Trẻ","Người già"],0],
      ["Nên làm gì?",["Vứt rác","Phân loại","Đốt","Chôn"],1],
      ["Trồng cây để?",["Làm mát","Ô nhiễm","Phá","Không cần"],0]
    ]
  }
};

function go(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function chooseMap(m){
  map = m;
  document.getElementById("missionText").innerText = maps[m].mission;
  go("mission");
}

function startGame(){
  go("game");
  spawnTrash();
  spawnObstacle();
}

function spawnTrash(){
  trashCount = maps[map].trash;
  for(let i=0;i<trashCount;i++){
    let t = document.createElement("div");
    t.className = "trash";
    t.style.left = Math.random()*700+"px";
    t.style.bottom = "10px";
    t.style.background = "green";
    t.onclick = ()=>{
      t.remove();
      score += 10;
      trashCount--;
      updateScore();
      if(trashCount===0) startQuiz();
    };
    world.appendChild(t);
  }
}

function spawnObstacle(){
  let o = document.createElement("div");
  o.className = "obstacle";
  o.style.left = "800px";
  o.style.bottom = "10px";
  o.style.background = "red";
  world.appendChild(o);

  let move = setInterval(()=>{
    let x = o.offsetLeft - 4;
    o.style.left = x+"px";

    if(x < player.offsetLeft+40 && x > player.offsetLeft){
      gameOver();
      clearInterval(move);
    }

    if(x < -50){
      o.remove();
      clearInterval(move);
    }
  },20);
}

function updateScore(){
  document.getElementById("score").innerText = score;
  document.getElementById("shopScore").innerText = score;
}

function startQuiz(){
  go("quiz");
  let q = maps[map].questions.shift();
  document.getElementById("question").innerText = q[0];
  let c = document.getElementById("choices");
  c.innerHTML="";
  q[1].forEach((ans,i)=>{
    let b = document.createElement("button");
    b.innerText = ans;
    b.onclick = ()=>{
      if(i===q[2]) score+=20;
      updateScore();
      go("shop");
    };
    c.appendChild(b);
  });
}

function gameOver(){
  alert("❌ Bạn va chạm chướng ngại! Mất hết điểm!");
  score = 0;
  updateScore();
  go("maps");
}

document.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp" && !jumping){
    velocity = 12;
    jumping = true;
  }
});

setInterval(()=>{
  if(jumping){
    playerY += velocity;
    velocity -= 1;
    if(playerY <= 10){
      playerY = 10;
      jumping = false;
    }
    player.style.bottom = playerY+"px";
  }
},30);
