import * as THREE from 'three';

class Pillar {
    /*
     * Represents each pillar in the monumnet
     * */
    constructor(humanMass, plasticMass, year, notes) {
        this.humanMass = humanMass
        this.plasticMass = plasticMass
        this.year = year
        this.notes = notes

        this.group = undefined
        this.humanCube = undefined
        this.plasticCube = undefined
    }
    render(size, heightPerUnit) {
        /*
         * returns a THREE.Group containing a human cube and plastic cube; visualizes the pillar
         * size: width & depth of each box
         * heightPerUnit: height of each unit of humanMass and plasticMass
         */
        let group = new THREE.Group()
        this.group = group

        var plasticHeight = this.plasticMass * heightPerUnit
        var humanHeight = this.humanMass * heightPerUnit
        var height = humanHeight + plasticHeight

        var humanCube = this.generateBox(size, humanHeight, 0x00ff00)
        this.humanCube = humanCube
        group.add(humanCube);
        humanCube.position.set(0, humanHeight/2, 0);

        var plasticCube = this.generateBox(size, plasticHeight)
        this.plasticCube = plasticCube
        group.add(plasticCube)
        plasticCube.position.set(0, humanHeight + 0.1 +  plasticHeight/2, 0);

        return group
    }
    renderText() {
        return `
        <h2>${this.year}</h2>
        <h4>Human Mass: ${this.humanMass}</h4>
        <h4>Plastic Mass: ${this.plasticMass}</h4>
        <p>${this.notes}</p>`
    }
    height(heightPerUnit) {
        var plasticHeight = this.plasticMass * heightPerUnit
        var humanHeight = this.humanMass * heightPerUnit
        var height = humanHeight + plasticHeight
        return height
    }
    generateBox(size, height, color) {
        /*
         * return: a box of size and height and color
         * size: width & depth of each box
         */
        var material = new THREE.MeshBasicMaterial( { color: color || 0x0000ff } );
        var geometry = new THREE.BoxGeometry( size, height, size );
        var box = new THREE.Mesh( geometry, material );
        window.box = box
        return box
    }
    disable() {
        this.humanCube.material.color = new THREE.Color('darkgray')
        this.plasticCube.material.color = new THREE.Color('lightgray')
    }
    enable() {
        this.humanCube.material.color = new THREE.Color('green')
        this.plasticCube.material.color = new THREE.Color('blue')
    }
    getPlasticRatio() {
        return Math.round(this.plasticMass / this.humanMass, 2)
    }
}
class Monument {
    /*
     * Represents the monument
     */
    constructor(numPillars) {
        this.pillars = []
        this.group = undefined
        this.heightPerUnit = undefined


        let startingYear = 1950
        for(var index = 0; index < numPillars; index++) {
            let humanMass = (index + 1 /3)
            let plasticMass = index + 1
            this.addPillar(humanMass, plasticMass, startingYear + index)
        }
    }
    addPillar(humanMass, plasticMass, year, notes) {
        /* creates a new pillar with `humanMass`, `plasticMass`, `year` and adds to the monument's array of pillars
         * return: none
         */
        var pillar = new Pillar(humanMass, plasticMass, year, notes);
        this.pillars.push(pillar)
        return pillar
    }
    render(size=1, heightPerUnit=0.000000001) {
        /*
         * returns a THREE.Group containing a each pillar in the monumnet, lined one after the other
         * size: width & depth of each pillar
         * heightPerUnit: height of each unit of humanMass and plasticMass in pillar
         */
        this.group = new THREE.Group();
        this.heightPerUnit = heightPerUnit
        this.pillars.forEach((pillar, index) => {
            let pillarGroup = pillar.render(size, heightPerUnit)
            //pillarGroup = pillar.generateBox(size, 10)
            pillarGroup.position.set(size * 1.5  * index, 0, 0)
            this.group.add(pillarGroup)
        });
        return this.group
    }
    getPosition(index) {
        let position = this.group.children[index].position.clone()
        position.add(this.group.position)
        return position
    }
    getCameraTargetPosition(index) {
        var position = this.getPosition(index)
        position.y += this.pillars[index].height(this.heightPerUnit)
        return position
    }
    getCameraPosition(index) {
        var position = this.getPosition(index)
        position.x = position.x * .8
        //position.z += parseInt(this.pillars[index].height() * 1) + 10
        position.z += 30
        //position.multiplyScalar(2)
        return position
    }
}

class ScaleGroupChildren {
    constructor(group) {
        /*
         * scales the x position of each child in the `group` by `scaleBy`
         * group: a THREE.Group instance to scale each child by
         * return: a function that should be called animationNumSteps times; each time it will scale each child; usually called in a requestAnimationFrame function
         */
        this.group = group
    }
    scale(scaleBy) {
        this.group.children.forEach((item) => {
            item.position.x = item.position.x * scaleBy
        });
    }
    animate(scaleBy, time=1000) {
        /*
         * scaleBy: each group child's x position will be multiplied by scaleBy at end of scaler
         * time: amount of time scaler should run, in ms
         */
        this.animationNumSteps = time / 30 //30 steps per 1000 ms, 
        this.animationStepScale = (scaleBy / this.animationNumSteps) + 1

        // initialize the animation interval for the first time; will cycle constantly
        // from here on out
        if(!this.animationInterval) {
            this.animationInterval = setInterval(() => {
                if(this.animationNumSteps > 0) {
                    this.scale(this.animationStepScale);
                    this.animationNumSteps -=1;
                }
            }, 1000 / 30);
        }
    }
}

export {Monument, ScaleGroupChildren}
