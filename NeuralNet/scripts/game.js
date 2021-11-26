var currentFPS = 0;
var paused = false;
var runningSim = true;
var drawing = true;

var maxSimSteps = 50000; //auto pause at here
var currentSimStep = 0; //simstep #
var currentRound = 0;
var maxRounds = 2000;
var mutationRatio = 100;
var popSize = 70; //number of organisms
var geneticLength = 20; //number of genes
var innerNeurons = 5; //number of inner neurons

var mapWidth = 500;
var mapHeight = 500;
document.getElementById('canvas-con').style.width = mapWidth + "px";
document.getElementById('canvas-con').style.height = mapHeight + "px";
var tileMap; //holds map info

var popArray = []; //holds all organisms
var foodArray = [];

var foodPerTick = 3;
var maxFood = mapWidth * mapWidth / 2000

var mostCommonGene = "default";
var survivalRate = 0;

const canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.canvas.width = mapWidth;
ctx.canvas.height = mapHeight;
const canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
ctx2.canvas.width = 300;
ctx2.canvas.height = 200;


let map = new Map(mapWidth, mapHeight);
statsButton.addEventListener("click", function() {
                drawBrain();
           });
function drawBrain() {
    let organism = popArray[getRandomInt(popArray.length)];
    ctx2.clearRect(0, 0, mapWidth, mapHeight);
    ctx2.fillStyle = organism.color;
    ctx2.fillRect(0,0,mapWidth,mapHeight);

    //draw sensors
    let x = 5;
    let startx = x;
    let y = 5;
    let dx = 40;
    let maxx = 300;
    let dy = 40;
    for (let i = 0; i < organism.sensors.length; i++){
        ctx2.fillStyle = 'blue';
        ctx2.fillRect(x, y, 20, 20);
        organism.sensors[i].x = x;
        organism.sensors[i].y = y;
        ctx2.font = '14px serif';
        ctx2.fillStyle = 'black';
        ctx2.fillText(organism.sensors[i].getCode(), x, y + 15);

        x += dx;
        if (x > maxx) {
            x = startx;
            y += dy;
        }
    }

    //draw inner neurons
    x = 5;
    startx = x;
    y += 60;
    for (let i = 0; i < organism.neurons.length; i++){
        ctx2.fillStyle = 'pink';
        ctx2.fillRect(x, y, 20, 20);
        organism.neurons[i].x = x;
        organism.neurons[i].y = y;
        ctx2.font = '14px serif';
        ctx2.fillStyle = 'black';
        ctx2.fillText(organism.neurons[i].getCode(), x, y + 15);
        x += dx;
        if (x > maxx) {
            x = startx;
            y += dy;
        }
    }


    //draw action outputs
    x = 5;
    startx = x;
    y += 60;
    for (let i = 0; i < organism.actions.length; i++){
        ctx2.fillStyle = 'red';
        ctx2.fillRect(x, y, 20, 20);
        organism.actions[i].x = x;
        organism.actions[i].y = y;
        ctx2.font = '14px serif';
        ctx2.fillStyle = 'black';
        ctx2.fillText(organism.actions[i].getCode(), x, y + 15);

        x += dx;
        if (x > maxx) {
            x = startx;
            y += dy;
        }


    }


    //draw connections
    for (let i = 0; i < organism.connections.length; i++) {
        if (organism.connections[i].multiplier >= 0) {
            ctx2.strokeStyle = 'green';
        } else {
            ctx2.strokeStyle = 'red';
        }
        ctx2.lineWidth = Math.abs(organism.connections[i].multiplier * 5);

        ctx2.beginPath();       // Start a new path
        ctx2.moveTo(organism.connections[i].input.x, organism.connections[i].input.y);    // Move the pen to (30, 50)
        ctx2.lineTo(organism.connections[i].output.x, organism.connections[i].output.y);  // Draw a line to (150, 100)
        ctx2.stroke();
    }

}
function spawnFood() {
    if (foodArray.length < maxFood) {
        for (let i = 0; i < foodPerTick; i++) {
            foodArray.push(new Food());
        }
    }
}
function startNewSim() {
    for (let i = 0; i < popSize; i++) {
        popArray.push(new Organism(geneticLength, innerNeurons));
    }
    animate();
}
function getRandomSurvivor() {
    let count = 0;
    for (let i = getRandomInt(popArray.length); count < 1000000; i = getRandomInt(popArray.length)) {
        count++;
        if (popArray[i].reproduce) {
            return popArray[i];
        }
    }
}
function setReproduced() {
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].x < mapWidth * 0.15) {
            popArray[i].reproduce = true;
        }
    }
}
function createNewGeneration() {
    let oldPopArray = popArray;
    let newPopArray = [];

    let numSurvived = 0;
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].reproduce) {
            numSurvived++;
        }
    }
    survivalRate = 100 * numSurvived/popArray.length;
    for (let i = 0; i < popArray.length; i++) {
        if (popArray[i].reproduce) {
            let parent1 = getRandomSurvivor();
            //console.log(parent1);
            let parent2 = getRandomSurvivor();
            //console.log('here');
            let newOrg = new Organism(geneticLength, innerNeurons);
            newPopArray.push(newOrg);
        }
    }
    let herecount = 0;
    while (newPopArray.length < popSize && herecount < 1000) {
        herecount++;
        let parent1 = getRandomSurvivor();
        //console.log(parent1);
        let parent2 = getRandomSurvivor();
        //console.log('here');

        let newOrg = new Organism(geneticLength, innerNeurons, parent1);

        newPopArray.push(newOrg)
    }
    popArray = newPopArray;

}
function advanceSim() {
    if (currentSimStep < maxSimSteps) {
        currentSimStep++;
        ctx.clearRect(0,0,mapWidth * 2,mapHeight * 2);
        spawnFood();
        if (drawing) {
            map.draw(ctx);
            for (let i = 0; i < popArray.length; i++) {
                popArray[i].update();
                popArray[i].draw(ctx);

                popArray[i].age++;
                for (let f = 0; f < foodArray.length; f++) {
                    let dist = getDist(foodArray[f].x, foodArray[f].y, popArray[i].x, popArray[i].y);
                    if (dist < 5) {
                        popArray.push(new Organism(geneticLength, innerNeurons, popArray[i]))
                        foodArray.splice(f, 1);
                        f--;
                    }
                }
                if (popArray[i].age > popArray[i].maxage) {
                    popArray[i].remove = true;
                }
                if (popArray[i].remove) {
                    popArray.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < foodArray.length; i++) {
                foodArray[i].draw(ctx);
                if (foodArray[i].remove) {
                    foodArray.splice(i, 1);
                    i--;
                }
            }
        } else {
            for (let i = 0; i < popArray.length; i++) {

            }
        }
    } else {
        if (currentRound < maxRounds) {
            currentRound++;
            currentSimStep = 0;
        }
    }
}
function resetSim() {
    currentRound = 0;
    currentSimStep = 0;
    popArray = [];
    for (let i = 0; i < popSize; i++) {
        popArray.push(new Organism(geneticLength, innerNeurons));
    }
}
function animate() {
    if (runningSim) {
        if (!paused) {
            //console.log('advancing sim');
            advanceSim();
        }
    } else {

    }
    statsText.innerText = "STATS: \n Paused: " + paused + " \n Running: " + runningSim + " \n Step: " + currentSimStep + "/" + maxSimSteps + " \n Round: " + currentRound + "/" + maxRounds + " \n Survival%: " + survivalRate+ " \n Mutation%: " + 1/mutationRatio;


    requestAnimationFrame(animate);
}
startNewSim();





