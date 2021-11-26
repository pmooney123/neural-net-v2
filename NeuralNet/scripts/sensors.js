class InnerNeuron {
    constructor() {
        this.inputs = [];
        this.id = '1';
        this.input = 0;
        this.isSensor = false;
        this.isAction = false;
    }
    getOutputRaw(organism) {
        //console.log(this.getName() + " has a total input of " + this.input);
        return this.input;
    }
    getName() {
        return 'Inner Neuron ' + this.id;
    }
    getCode() {
        return this.id;
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        this.input = total;
    }
}

class Connection {
    constructor() {
        this.input;
        this.output;
        this.multiplier = (Math.random() - 0.5) * 2; //TO-DO: FIXXX
    }
    getText() {
        let verb = 'is connected to';
        if (this.multiplier > 0) {
            verb = 'stimulates';
            if (this.multiplier > 2) {
                verb = 'strongly stimulates';
            }
        } else {
            verb = 'inhibits';
            if (this.multiplier < -2) {
                verb = 'strongly inhibits';
            }
        }

        let text = this.input.getName() + " " + verb + " " + this.output.getName();

        return text;
    }
}

class ActionNeuron {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        //console.log(this.getName() + " has a total input of " + this.input);
        if (Math.random() < 0.5) {
            organism.move(this.input, 0);
        } else {
            organism.move(0, this.input);
        }
    }
    getCode() {
        return 'def'
    }
    getName() {
        return 'default';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        this.input = total;
    }
}

class MoveUp {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        organism.move(0, -1)
    }
    getCode() {
        return 'MU'
    }
    getName() {
        return 'move up';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        if (total < 0) {
            total = 0;
        }
        this.input = total;
    }
}
class MoveDown {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        organism.move(0, 1)
    }
    getCode() {
        return 'MD'
    }
    getName() {
        return 'move down';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        if (total < 0) {
            total = 0;
        }
        this.input = total;
    }
}
class MoveLeft {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        organism.move(-1, 0)
    }
    getCode() {
        return 'ML'
    }
    getName() {
        return 'move left';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        if (total < 0) {
            total = 0;
        }
        this.input = total;
    }
}
class MoveRight {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        organism.move(1, 0)
    }
    getCode() {
        return 'MR'
    }
    getName() {
        return 'move right';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        if (total < 0) {
            total = 0;
        }
        this.input = total;
    }
}
class MoveX {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        organism.move(getRandomInt(3) - 1, 0)
    }
    getCode() {
        return 'MX'
    }
    getName() {
        return 'move rx';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        if (total < 0) {
            total = 0;
        }
        this.input = total;
    }
}
class MoveY {
    constructor() {
        this.inputs = [];
        this.input = 0;
        this.isAction = true;
    }
    perform(organism) {
        organism.move(0, getRandomInt(3) - 1);
    }
    getCode() {
        return 'MY'
    }
    getName() {
        return 'move ry';
    }
    sum() {
        let total = 0;
        for (let i = 0; i < this.inputs.length; i++) {
            total += this.inputs[i];
        }
        if (this.inputs.length != 0) {
            total /= this.inputs.length;
        }
        if (total < 0) {
            total = 0;
        }
        this.input = total;
    }
}

class SensorNeuron {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        return Math.random() - 0.5;
    }
    getCode() {
        return 'def'
    }
    getName() {
        return 'default';
    }
}

class Random {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        return Math.random();
    }
    getCode() {
        return 'RS'
    }
    getName() {
        return 'Random Sensor';
    }
}
class Oscillator {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        return Math.sin(currentSimStep / 20);
    }
    getCode() {
        return 'OS'
    }
    getName() {
        return 'Oscillator Sensor';
    }
}
class FoodLeft {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        let value = 0;
        if (organism.nearestFood != null) {
            if (organism.nearestFood.x < organism.x) {
                value = 1;
            }
        } else {

        }

        return value;
    }
    getCode() {
        return 'FL'
    }
    getName() {
        return 'food left';
    }
}
class FoodRight {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        let value = 0;
        if (organism.nearestFood != null) {
            if (organism.nearestFood.x > organism.x) {
                value = 1;
            }
        } else {

        }

        return value;
    }
    getCode() {
        return 'FR'
    }
    getName() {
        return 'food right';
    }
}
class FoodUp {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        let value = 0;
        if (organism.nearestFood != null) {
            if (organism.nearestFood.y < organism.y) {
                value = 1;
            }
        } else {

        }

        return value;
    }
    getCode() {
        return 'FU'
    }
    getName() {
        return 'food up';
    }
}
class FoodDown {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        let value = 0;
        if (organism.nearestFood != null) {
            if (organism.nearestFood.y > organism.y) {
                value = 1;
            }
        } else {

        }

        return value;
    }
    getCode() {
        return 'FD'
    }
    getName() {
        return 'food down';
    }
}
class FoodDist {
    constructor() {
        this.isSensor = true;
    }
    getOutputRaw(organism) {
        let value = 0;
        if (organism.nearestFood != null) {
            let dist = getDist(organism.x, organism.y, organism.nearestFood.x, organism.nearestFood.y)
            if (dist > 30) {
                value = 0;
            } else {
                value = (30 - dist) / 30;
            }
        } else {

        }

        return value;
    }
    getCode() {
        return 'Fd'
    }
    getName() {
        return 'food distance';
    }
}


function getDist(x, y, x2, y2) {
    let dx = x2 - x;
    let dy = y2 - y;
    let diff = (dx * dx + dy * dy);
    return Math.sqrt(diff);
}

