import * as THREE from 'three';
import Pillar from './pillar.js'

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

export default Monument
