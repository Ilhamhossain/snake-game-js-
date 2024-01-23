const gameBoard = document.querySelector('.game-board');
const moveSound =  new Audio("move.mp3");
const gameOverSound = new Audio("gameover.mp3");
const foodSound = new Audio("food.mp3");
const gameOverCon = document.querySelector(".gameover") 
const main = document.querySelector(".main");
const score = document.getElementById("score");
let scoreNum;
let highScore = 0;
let lastPaintTime = 0;
let snake_speed = 12;
let snakeFigure = [{x:13,y:15}]
let foodDirection = {x:10,y:6};
let snakeVelocity = {x:0,y:0};

scoreNum = 0

function drawPaint(currentTime){
    window.requestAnimationFrame(drawPaint);

    if((currentTime - lastPaintTime) / 1000 <= 1/snake_speed){
         return;
    }

    lastPaintTime = currentTime;
    gameSystemEngine()
}

window.requestAnimationFrame(drawPaint);




function gameSystemEngine(){
    gameBoard.textContent = "";
    
    //  display the food and snake on game board !!! ;

    snakeFigure.forEach(function(segment,index){
        const snakeElements = document.createElement('div');
        snakeElements.style.gridRowStart = segment.y;
        snakeElements.style.gridColumnStart = segment.x;

     if(index === 0){
       snakeElements.classList.add("snakeHead");
       const snakePng = document.createElement('img');
       snakePng.src = "snakeHead.png";
       snakePng.draggable = false;
       snakePng.classList.add("snakePng")
       snakeElements.appendChild(snakePng);
       snakePng.style.rotate = `${getAngleValue()}deg`;
     }
     else{
     snakeElements.classList.add("snakeFigure");     
     }
         
     gameBoard.appendChild(snakeElements)
    })




    const foodElement = document.createElement("div");
     foodElement.style.gridRowStart  = foodDirection.y;
     foodElement.style.gridColumnStart = foodDirection.x;
     foodElement.classList.add("food");
     const foodPng = document.createElement('img');
     foodPng.src = "snakefood.png";
     foodPng.classList.add("foodPng");
     foodElement.appendChild(foodPng);
     gameBoard.appendChild(foodElement);


     snakeUpdate();

     snakeFigure[0].x += snakeVelocity.x;
     snakeFigure[0].y += snakeVelocity.y;


     ifSnakeEatenFood();


    //  if snake colide with wall or snake colide themeself !! 

    if(isSnakeColide()){
        gameOverSound.play();
        snakeVelocity = {x:0,y:0};
        snakeFigure = {x:0,y:0}
        gameOverPopUp();

    }


//  storing the highest score on local storage !   
    if(scoreNum > highScore){
         highScore  = scoreNum ; 
          updateHighScore();
    }
}


function updateHighScore(){
      const highScoreVal = document.querySelector("#hiScore");
      highScoreVal.textContent = `high score :${highScore}`;

      localStorage.setItem("highScore",highScore)
}


window.addEventListener('load', () => {
      const storedHighScore = localStorage.getItem("highScore");

      if(storedHighScore !== null){
          highScore = parseInt(storedHighScore);
          updateHighScore()
      }
})

window.addEventListener('beforeunload', () => {

    localStorage.setItem("highScore",0)
})



function isSnakeColide(){
     if(snakeFigure[0].x > 18 || snakeFigure[0].x < 0 || snakeFigure[0].y > 18 || snakeFigure[0].y < 0){
        return true; 
     }

     for (let i = snakeFigure.length - 1; i > 0; i--) {
        if (snakeFigure[0].x === snakeFigure[i].x && snakeFigure[0].y === snakeFigure[i].y) {
            return true;
        }
    }
     
     return false
}



function gameOverPopUp(){
   const gameOver = document.createElement('div');
   gameOver.classList.add('gameover');
   const h1 = document.createElement('h1');
   h1.textContent = "game over !"
    gameOver.appendChild(h1)
   const btn = document.createElement('button');
   btn.classList.add("btn");
   btn.textContent = "restart game "
   gameOver.appendChild(btn)
   main.appendChild(gameOver);

   btn.addEventListener("click", () => {
    gameOver.remove();
    snakeVelocity = { x: 0, y: 0 };
    snakeFigure = [{ x: 13, y: 15 }];
    scoreNum = 0;
    foodDirection = {x:10,y:6}
    score.textContent = 0;
});


  
}

function restartGame(){
    gameOver.remove();
    snakeVelocity = { x: 0, y: 0 };
    snakeFigure = [{ x: 13, y: 15 }];
    scoreNum = 0;
    score.textContent = 0;
}







function snakeUpdate(){
    for (let i = snakeFigure.length - 1; i > 0; i--) {
        snakeFigure[i].x = snakeFigure[i - 1].x;
        snakeFigure[i].y = snakeFigure[i - 1].y;
    }

   window.addEventListener("keydown", (e) => {
    
        switch(e.key){
            case "ArrowUp": 
               snakeVelocity.x = 0;
               snakeVelocity.y = -1;
            moveSound.play();
            break;

            case "ArrowDown": 
            snakeVelocity.x = 0;
            snakeVelocity.y = 1;
            moveSound.play();
            break;

            case "ArrowLeft": 
            snakeVelocity.x = -1;
            snakeVelocity.y = 0;
            moveSound.play();
            break;

            case "ArrowRight": 
            snakeVelocity.x = 1;
            snakeVelocity.y = 0;
            moveSound.play();
            break;
        }
   })
}




function getAngleValue(){
    if(snakeVelocity.x === -1){
         return 90;
    }
    else if(snakeVelocity.x === 1){
        return -90;
    }
    else if(snakeVelocity.y === -1){
         return 180;
    }
    else if(snakeVelocity.y === 1){
         return 0
    }
}





function ifSnakeEatenFood() {
    if (snakeFigure[0].x === foodDirection.x && snakeFigure[0].y === foodDirection.y) {
        let newFoodX, newFoodY;

        // Generate new random positions within the grid boundaries
        do {
            newFoodX = Math.floor(Math.random() * 14) + 2;
            newFoodY = Math.floor(Math.random() * 14) + 2;
        } while (isSnakeBodyCollision(newFoodX, newFoodY) || isSnakeBodyCollision(newFoodX, newFoodY));

        foodDirection = {
            x: newFoodX,
            y: newFoodY
        };

        foodSound.play();

        // Add a new segment to the snakeFigure array
        const newSegment = {
            x: snakeFigure[0].x + snakeVelocity.x,
            y: snakeFigure[0].y + snakeVelocity.y
        };

        snakeFigure.unshift(newSegment); // Add the new segment to the front of the array
        

     scoreNum++
      score.textContent = `${scoreNum}`;
       
    }
}

function isSnakeBodyCollision(x, y) {
    // Check if the new food position collides with any part of the snake's body (excluding the head)
    return snakeFigure.slice(1).some(segment => segment.x === x && segment.y === y);
}





// okay now i try to build this game in simple way cause i have to also work on
//  different java-script projects ! so thats why to build strong foundation on js
// programming  i make this game !! 🟡