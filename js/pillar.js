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
        let ratio = this.plasticMass / this.humanMass
        if( ratio < 1 ) {
            return ratio.toFixed(3)
        } else if( ratio < 3 ) {
            return ratio.toFixed(2)
        } else {
            return Math.round(ratio)
        }
    }
}

export default Pillar
