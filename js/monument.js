import * as THREE from 'three';

class Pillar {
    /*
     * Represents each pillar in the monumnet
     * */
    constructor(humanMass, plasticMass, year) {
        this.humanMass = humanMass
        this.plasticMass = plasticMass
        this.year = year
    }
    generateGroup(size, heightPerUnit) {
        /*
         * returns a THREE.Group containing a human cube and plastic cube; visualizes the pillar
         * size: width & depth of each box
         * heightPerUnit: height of each unit of humanMass and plasticMass
         */
        let group = new THREE.Group()

        var plasticHeight = this.plasticMass * heightPerUnit
        var humanHeight = this.humanMass * heightPerUnit
        var height = humanHeight + plasticHeight
        console.log({plasticHeight, humanHeight, height});

        var humanCube = this.generateBox(size, humanHeight, 0x00ff00)
        group.add(humanCube);
        humanCube.position.set(0, humanHeight/2, 0);

        var plasticCube = this.generateBox(size, plasticHeight)
        group.add(plasticCube)
        plasticCube.position.set(0, humanHeight + 0.1 +  plasticHeight/2, 0);

        return group
    }
    generateBox(size, height, color) {
        /*
         * return: a box of size and height and color
         * size: width & depth of each box
         */
        var material = new THREE.MeshBasicMaterial( { color: color || 0x0000ff } );
        var geometry = new THREE.BoxGeometry( size, height, size );
        var box = new THREE.Mesh( geometry, material );
        return box
    }
}
class Monument {
    /*
     * Represents the monument
     */
    constructor(numPillars) {
        this.pillars = []
        let startingYear = 1950
        for(var index = 0; index < numPillars; index++) {
            let humanMass = (index + 1 /3)
            let plasticMass = index + 1
            this.addPillar(humanMass, plasticMass, startingYear + index)
        }
    }
    addPillar(humanMass, plasticMass, year) {
        /* creates a new pillar with `humanMass`, `plasticMass`, `year` and adds to the monument's array of pillars
         * return: none
         */
        var pillar = new Pillar(humanMass, plasticMass, year);
        this.pillars.push(pillar)
    }
    generateGroup(size=1, heightPerUnit=1) {
        /*
         * returns a THREE.Group containing a each pillar in the monumnet, lined one after the other
         * size: width & depth of each pillar
         * heightPerUnit: height of each unit of humanMass and plasticMass in pillar
         */
        let group = new THREE.Group();
        this.pillars.forEach((pillar, index) => {
            let pillarGroup = pillar.generateGroup(size, heightPerUnit)
            //pillarGroup = pillar.generateBox(size, 10)
            pillarGroup.position.set(size * 1.5  * index, 0, 0)
            group.add(pillarGroup)
        });
        return group
    }
}

function scaleGroupChildren(group, numSteps, scaleBy) {
    /*
     * scales the x position of each child in the `group` by `scaleBy`
     * group: a THREE.Group instance to scale each child by
     * numSteps: the number of times the scale should run
     * scaleBy: the multiplier that is applied to each child's x position
     * return: a function that should be called numSteps times; each time it will scale each child; usually called in a requestAnimationFrame function
     */
    let stepScaleBy = scaleBy / numSteps
    let stepFunction = function() {
        if(numSteps > 0) {
            group.children.forEach((item) => {
                item.position.x += item.position.x * stepScaleBy;
            });
            numSteps -=1 ;
        }
    }
    return stepFunction
}

export {Monument, scaleGroupChildren}
