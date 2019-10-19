import * as THREE from 'three';

class Monument {
    constructor(scene, numPillars) {
        this.pillars = []
        this.expandSteps = 50;
        this.expandBy = 0.02;

        for(var index = 0; index < numPillars; index++) {
            let size = 20;
            let humanMass = (index + 1 /3) * 70
            let plasticMass = index + 1

            let pillar = this.generatePillar(size, index, humanMass, plasticMass);
            pillar.position.set(size  * index, -440, 0)
            this.pillars.push(pillar);
            scene.add(pillar)
        }
    }
    generatePillar(size, index, humanMass, plasticMass) {
        var height = humanMass + plasticMass

        var humanMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var humanGeometry = new THREE.BoxGeometry( size, humanMass, size );
        var humanCube = new THREE.Mesh( humanGeometry, humanMaterial );
        //scene.add( humanCube );
        humanCube.position.set(0, humanMass/2, 0);

        var plasticMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        var plasticGeometry = new THREE.BoxGeometry( size, plasticMass, size );
        var plasticCube = new THREE.Mesh( plasticGeometry, plasticMaterial );
        //scene.add( plasticCube );
        plasticCube.position.set(0, humanMass + 0.1 +  plasticMass/2, 0);

        var group = new THREE.Group()
        group.add(humanCube)
        group.add(plasticCube)
        return group
    }
    update() {
        if(this.expandSteps > 0) {
            this.pillars.forEach((pillar) => {
                pillar.position.x += pillar.position.x * this.expandBy;
            });
            this.expandSteps -=1 ;
        }
    }
    setExpand(numSteps, expandBy) {
        this.expandSteps = numSteps;
        this.expandBy = expandBy;
    }
}


export default Monument
