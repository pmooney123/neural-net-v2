class Map {
    constructor (width, height) {
        this.width = width;
        this.height = height;

        this.airDepth = 50;
        this.seaLevel = height - this.airDepth;

        this.time = 0;
        this.defaultLight = 100;
        this.currentLight = this.defaultLight;
        this.lightAmplitude = 50;
        this.dayNightCycleTime = 1000;
        this.lightFalloff = 1;

    }
    modifyLight() {
        this.time++;
        this.currentLight = this.lightAmplitude * Math.sin(this.time / this.dayNightCycleTime) + this.lightAmplitude;
    }
    getLightLevel(y) {
        let dy = y - this.airDepth;
        let dl = this.lightFalloff * dy;
        if (y % 50 == 0) {
            console.log('y: ' + y + " light: " + (this.currentLight - dl)/100);
        }
        return Math.max(this.currentLight - dl,0);
    }
    draw(ctx) {
        //this.modifyLight();

        //BACKGROUND FOR DARKNESS
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,this.width,this.height);

        //SKY
        ctx.fillStyle = 'cyan';
        ctx.fillRect(0,0,this.width, this.airDepth);

        //OCEAN
        //for (let y = this.airDepth; y < this.height; y++) {
            //ctx.fillStyle = 'rgba(0,0,155,' + (this.getLightLevel(y)/100.0) + ")";
        ctx.fillStyle = 'black';
        ctx.fillRect(0,this.airDepth,this.width,this.height);

        //}
    }
}


const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const mutateButton = document.getElementById('mutate');
const drawButton = document.getElementById('draw');

const statsButton = document.getElementById('stats-button');
const statsText = document.getElementById('stats');
mutateButton.addEventListener("click", function() {
             mutationRatio *= 0.1;
           });
startButton.addEventListener("click", function() {
             resetSim();
           });
drawButton.addEventListener("click", function() {
                drawing = !drawing;
           });
pauseButton.addEventListener("click", function() {
                paused = !paused;
           });