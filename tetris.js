const ROWS = 14;
const COLS = 10;

const gridElement = document.getElementById('game_label');
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

function createGrid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.id = `cell-${row}-${col}`;
          gridElement.appendChild(cell);
      }
    }
}

createGrid();

const I = [
    [0,0,0],
    [1,1,1],
    [0,0,0]
]

const O = [
    [1,1,0],
    [1,1,0],
    [0,0,0]
]

const L = [
    [1,0,0],
    [1,1,1],
    [0,0,0]
]

const T = [
    [1,1,1],
    [0,1,0],
    [0,1,0]
]

const S = [
    [0,1,1],
    [1,1,0],
    [0,0,0]
]

const Z = [
    [1,1,0],
    [0,1,1],
    [0,0,0]
]

let tetraminoX = 4;
let tetraminoY = -1;

let activeTetramino = [I, O, L, T, S, Z];

let randomTetramino;

function newTetramino() {
    randomTetramino = Math.floor(Math.random() * activeTetramino.length);
    return activeTetramino[randomTetramino];    
}

function color(randomTetramino) {

    let color

    switch(randomTetramino) {
        case 0:
            color = 'blue';
            boxShadow = 'inset 0px 5px 10px rgba(2, 9, 78, 0.8), 0px 8px 12px rgba(0, 0, 0, 0.6)';
            break;

        case 1:
            color = 'green';
            boxShadow = 'inset 0px 5px 10px rgba(14, 46, 5, 0.8), 0px 8px 12px rgba(0, 0, 0, 0.6)';
            break;   

        case 2:
            color = 'orange';
            boxShadow = 'inset 0px 4px 8px rgba(122, 70, 1, 0.7), 0px 6px 10px rgba(0, 0, 0, 0.5)';
            break;
            
        case 3:
            color = 'yellow';
            boxShadow = 'inset 0px 4px 8px rgba(122, 124, 3, 0.7), 0px 6px 10px rgba(0, 0, 0, 0.5)';
            break;

        case 4:
            color = 'purple';
            boxShadow = 'inset 0px 4px 8px rgba(31, 6, 71, 0.7), 0px 6px 10px rgba(0, 0, 0, 0.5)';
            break;
            
        case 5:
            color = 'red';
            boxShadow = 'inset 0px 4px 8px rgba(75, 9, 9, 0.7), 0px 6px 10px rgba(0, 0, 0, 0.5)';
            break; 
    }

    document.querySelectorAll('.active').forEach(cell => {
        cell.style.backgroundColor = color;
        cell.style.boxShadow = boxShadow;
    });

}

let Tetrandom = newTetramino();

function drawTetramino(){
    Tetrandom.forEach((row, rowIndex) => {
        row.forEach((value,colIndex)=> {
            if(value === 1){
                const cell = document.getElementById(`cell-${tetraminoY + rowIndex}-${tetraminoX + colIndex}`);
                if(cell){
                    cell.classList.add('active');
                    color(randomTetramino);
                }               
            }
        });
    });
}

function clearTetromino() {
    const activeCells = document.querySelectorAll('.active');
    activeCells.forEach(cell => {
      cell.classList.remove('active');
      cell.style.backgroundColor = '';
      cell.style.boxShadow = '';
    });
}

function moveTetramino(event) {
    clearTetromino();
    let direction = event.key;

    let newX = tetraminoX;
    let newY = tetraminoY;
    let newTetramino = Tetrandom;

    switch (direction) {
        case "ArrowRight":
            newX++;
            break;
        case "ArrowLeft":
            newX--;
            break;
        case "ArrowDown":
            newY++;
            break;
        case "ArrowUp":
            const rotatedTetramino = rotateTetramino(Tetrandom);
            if (!checkCollision(rotatedTetramino, tetraminoX, tetraminoY)) {
                newTetramino = rotatedTetramino;
            }
            break;

        case " ":
            
            while (!checkCollision(newTetramino, newX, newY + 1)) {
                newY++;
            }  
            break;
            
        default:
            break;
    }

   
    if (!checkCollision(newTetramino, newX, newY)) {
        tetraminoX = newX;
        tetraminoY = newY;
        Tetrandom = newTetramino;
    } else if (direction === "ArrowDown") {
        
        lockTetramino(Tetrandom, tetraminoX, tetraminoY);
        Tetrandom = newTetramino();
        tetraminoX = 4;  
        tetraminoY = 0;  
    }

    drawTetramino();    
    
}


function rotateTetramino(tetramino) {
    const rotated = tetramino[0].map((_, colIndex) => tetramino.map(row => row[colIndex])).map(row => row.reverse());

    let offsetX = 0;

    // check collision left & right 
    if (tetraminoX + rotated[0].length > COLS) {
        offsetX = COLS - (tetraminoX + rotated[0].length);
    } else if (tetraminoX < 0) {
        offsetX = -tetraminoX;
    }

    tetraminoX += offsetX;
    return rotated;
}


document.addEventListener('keydown',moveTetramino);


function automovementTetr(){
    clearTetromino();
    tetraminoY++;
     if (checkCollision(Tetrandom, tetraminoX, tetraminoY)) {
        tetraminoY--; 

        lockTetramino(Tetrandom, tetraminoX, tetraminoY);

        delatedTetramino(grid);

        Tetrandom = newTetramino();
        tetraminoX = 4; 
        tetraminoY = 0;

        if (checkCollision(Tetrandom, tetraminoX, tetraminoY)){
            gameOver();
        }
    }
    drawTetramino();
}

function checkCollision(Tetrandom, offsetX, offsetY) {
    for(let y = 0; y < Tetrandom.length; y++ ) {
        for(let x = 0; x < Tetrandom[y].length; x++) {
            if(Tetrandom[y][x]) {

                if (
                    x + offsetX < 0 || // collision left
                    x + offsetX >= COLS || // collision right
                    y + offsetY >= ROWS || // collision end label
                    grid[y + offsetY] && grid[y + offsetY][x + offsetX] // collision other tetramino               
                ) {
                    return true;
                }  

            }
        }
    }
    return false;
}

function lockTetramino(Tetrandom, offsetX, offsetY) {
    for(let y = 0; y < Tetrandom.length; y++ ) {
        for(let x = 0; x < Tetrandom[y].length; x++) {
     
            if(Tetrandom[y][x]) {
                grid[y + offsetY][x + offsetX] = Tetrandom[y][x];

                const cell = document.getElementById(`cell-${y + offsetY}-${x + offsetX}`);
                if (cell) {
                    cell.classList.add('locked');
                   
                }
            }
        }
    }            
}

let points = 0 


let min;

let seconds;


window.onload = function() {


    let startTime = Date.now();
    min = 0;
    seconds = 0;
    const label = document.getElementsByClassName("time_label")[0];
    
    timerInterval = setInterval(function() {
        let stopWatch = Date.now() - startTime;
        seconds = Math.floor(stopWatch / 1000);

        if (seconds === 60){
            seconds = 0;
            startTime = Date.now();
            min++;
        }

        label.innerText = String(min) + ":" + String(seconds);
    }, 1000);


};

setInterval(automovementTetr,1000);



function delatedTetramino(grid){

    for(let y = 0; y < ROWS; y++) {

        let cellDell = 0;

        for(let x = 0; x < COLS; x++) {
            if(grid[y][x] == 1) {
                cellDell++;
            }            
        }
        
        if(cellDell === COLS) {
            for (let row = y; row > 0; row--) {
                grid[row] = [...grid[row - 1]];
            }       

            grid[0] = Array(COLS).fill(0);
            updateGridDisplay();
            addPoints();
            
        }
    }  
}


function updateGridDisplay() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const cell = document.getElementById(`cell-${y}-${x}`);
            if (grid[y][x] === 1) {
                cell.classList.add('locked');
            } else {
                cell.classList.remove('locked');
            }
        }
    }
}


let label_points = document.getElementsByClassName("score_label")[0];
label_points.innerText = points; 

function addPoints(){
    
    points += 100;

    label_points.innerText = points;    
}



function gameOver(){    
    let over = document.getElementById("game_over");
    over.style.display = 'block';

    clearInterval(timerInterval); 
        
}


let timerInterval;

function newGame() {
    let over = document.getElementById("game_over");
    over.style.display = 'none';

    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            grid[x] = Array(COLS).fill(0);
        }
        grid[y] = Array(ROWS).fill(0);
    }

    updateGridDisplay();


    points = 0;
    label_points.innerText = points;

    let startTime = Date.now();
    min = 0;
    seconds = 0;
    const label = document.getElementsByClassName("time_label")[0];

    label.innerText = "0:0"; 

    
    timerInterval = setInterval(function() {
        let stopWatch = Date.now() - startTime;
        seconds = Math.floor(stopWatch / 1000);

        if (seconds === 60){
            seconds = 0;
            startTime = Date.now();
            min++;
        }

        label.innerText = String(min) + ":" + String(seconds);
    }, 1000);
}


//background


const numPoints = 200; 
const pointsContainer = document.querySelector('.points-container');

for (let i = 0; i < numPoints; i++) {
    const point = document.createElement('div');
    point.classList.add('point');

    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;

    point.style.left = `${randomX}px`;
    point.style.top = `${randomY}px`;

    pointsContainer.appendChild(point);
}
