class Organism {
    constructor(numGenes, numInnerNeurons, parent1) {
        //stats
        this.x = getRandomInt(mapWidth); //set x and y starting
        this.y = getRandomInt(mapHeight);
        this.red = getRandomInt(125);
        this.blue = getRandomInt(256);
        this.green = getRandomInt(125);
        this.color = 'rgb(' + this.red + "," + this.green + "," + this.blue + ")";

        this.age = 0;
        this.maxage = 1000;

        this.remove = false;


        this.nearestFood = {
            x: 0,
            y: 0,
        };
        this.nearestFood.x = 0;
        this.nearestFood.y = 0;
        this.nearestOrg = {
            x: 0,
            y: 0,
        };
        this.nearestOrg.x = 0;
        this.nearestOrg.y = 0;

        this.genes = [];
        this.size = 3; //visual width

        if (parent1 == null) {
            for (let i = 0; i < numGenes; i++) {
                this.genes.push(getRandomNumGene(numInnerNeurons));
            }
        } else {
            this.genes = parent1.genes;
            this.color = parent1.color;

        }

        if (getRandomInt(mutationRatio) == 0) {
            console.log('mutating');
            let mutationIndex = getRandomInt(this.genes.length);
            let mutationType = getRandomInt(3);

            let newMutation = getRandomNumGene(numInnerNeurons);
            console.log(this.genes);
            this.genes[mutationIndex][mutationType] = newMutation[mutationType];
        } //HANDLE MUTATIONS

        this.constructBrain(); //create arrays with default sensors, actions, and innerneurons

        this.connections = []; //determined entirely by genes, connect a sensor/innerneuron to a innerneuron/output.

        for (let i = 0; i < this.genes.length; i++) {
            let newConnection = new Connection();
            let gene = this.genes[i];

            newConnection.input = this.inputs[gene[0]];

            newConnection.multiplier = (gene[1] / 9.0) - 0.5;


            newConnection.output = this.outputs[gene[2]];

            this.connections.push(newConnection);
        } //BUILD CONNECTIONS FROM GENES
    }
    constructBrain() {
           //set Neural Chemistry
            let numInnerNeurons = innerNeurons;
            this.sensors = [];
            this.sensors.push(new Random());
            this.sensors.push(new Oscillator());
            this.sensors.push(new FoodRight());
            this.sensors.push(new FoodLeft());
            this.sensors.push(new FoodUp());
            this.sensors.push(new FoodDown());
            this.sensors.push(new FoodDist());

            this.neurons = []; //inner neurons
            for (let i = 0; i < numInnerNeurons; i++) {
                this.neurons.push(new InnerNeuron());
            }
            this.actions = [];
            this.actions.push(new MoveLeft());
            this.actions.push(new MoveRight());
            this.actions.push(new MoveUp());
            this.actions.push(new MoveDown());
            this.actions.push(new MoveX());
            this.actions.push(new MoveY());

            this.inputs = []; //all possible sources for connection
            for (let i = 0; i < this.sensors.length; i++) {
                this.inputs.push(this.sensors[i]);
            }
            for (let i = 0; i < this.neurons.length; i++) {
                this.inputs.push(this.neurons[i]);
            }

            this.outputs = []; //all possible outputs for connection
            for (let i = 0; i < this.neurons.length; i++) {
                this.outputs.push(this.neurons[i]);
            }
            for (let i = 0; i < this.actions.length; i++) {
                this.outputs.push(this.actions[i]);
            }
    }
    setNearestFood() {
        for (let i = 0; i < foodArray.length; i++) {
            let distNew = getDist(this.x, this.y, foodArray[i].x, foodArray[i].y)
            let distOld = getDist(this.x, this.y, this.nearestFood.x, this.nearestFood.y)
            if (distNew < distOld) {
                this.nearestFood = foodArray[i];
            }
        }
    }
    setNearestOrg() {
        for (let i = 0; i < popArray.length; i++) {
            let distNew = getDist(this.x, this.y, popArray[i].x, popArray[i].y)
            let distOld = getDist(this.x, this.y, this.nearestOrg.x, this.nearestOrg.y)
            if (distNew < distOld) {
                this.nearestOrg = popArray[i];
            }
        }

    }
    update() {
        if (currentSimStep % 50 == 0) {
            this.setNearestOrg();
            this.setNearestFood();
        }
        //clear inputs
        for (let i = 0; i < this.connections.length; i++) {
            this.connections[i].output.inputs = [];
            this.connections[i].output.input = 0;
        }
        //apply all sensor neuron connections
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].input.isSensor == true) {
                let value = this.connections[i].input.getOutputRaw(this) * this.connections[i].multiplier;
                this.connections[i].output.inputs.push(value);
                //console.log(this.connections[i].input.getName() + " reports " + value + " to " + this.connections[i].output.getName());
            }
        }
        //sum all inputs so inner neurons are updated
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sum();
        }
        //get inner neuron outputs on other inner neurons
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].input.isSensor == false && this.connections[i].output.isAction == false) {
                let value = this.connections[i].input.getOutputRaw(this) * this.connections[i].multiplier;
                this.connections[i].output.inputs.push(value);
                //console.log(this.connections[i].input.getName() + " reports " + value + " to " + this.connections[i].output.getName());
            }
        }
        //sum all
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sum();
        }
        //apply all inner neurons on action outputs
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].input.isSensor == false && this.connections[i].output.isAction == false) {
                let value = this.connections[i].input.getOutputRaw(this) * this.connections[i].multiplier;
                this.connections[i].output.inputs.push(value);
                //console.log(this.connections[i].input.getName() + " reports " + value + " to " + this.connections[i].output.getName());
            }
        }
        //sum all and execute
        for (let i = 0; i < this.outputs.length; i++) {
            this.outputs[i].sum();
        }
        let highestAction = this.actions[0];
        for (let i = 0; i < this.actions.length; i++) {
            if (this.actions[i].input > highestAction.input) {
                highestAction = this.actions[i];
            }
        }
        highestAction.perform(this);



    }
    logGenome() {
        let text = "GENOME: ";
        for (let i = 0; i < this.genes.length; i++) {
            if (i > 0) {
                text = text.concat("-");
            }
            text = text.concat(" " + this.genes[i]);
        }
        console.log(text);
    }
    draw(ctx) {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
    move(x, y) {
        this.x += x;
        this.y += y;
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > mapWidth) {
            this.x = mapWidth;
        }
        if (this.y > mapHeight) {
            this.y = mapHeight;
        }
        if (this.y < map.airDepth) {
            this.y = map.airDepth;
        }
    }
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function getRandomNumGene(numberOfNeurons) {

    let newGene = [];
    newGene.push(getRandomInt(7 + numberOfNeurons));
    newGene.push(getRandomInt(10));
    newGene.push(getRandomInt(6 + numberOfNeurons));
    return newGene;
}
function getRandomGene() {
    let alphabet = 'abcdefghijklmnoqrstuvwxyz1234567890';

    let newGene = '';
    let newLetter = '';
    let geneSize = 3;
    for (let i = 0; i < geneSize; i++) {
        let index = getRandomInt(alphabet.length);
        newLetter = alphabet.substring(index, index + 1);
        newGene = newGene.concat(newLetter);
    }
    return newGene;
}

class Food {
    constructor() {
        this.x = getRandomInt(mapWidth);
        this.y = getRandomInt(mapHeight - 50) + 50;
        this.size = 2;
        this.color = 'white';
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
}