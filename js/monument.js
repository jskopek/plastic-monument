import * as THREE from 'three';

class Monument {
    constructor(scene, numPillars) {
        this.pillars = []
        this.expandContractSteps = undefined;
        this.expandContractBy = 0.02;

        this.group = new THREE.Group();

        for(var index = 0; index < numPillars; index++) {
            let size = 1;
            let humanMass = (index + 1 /3)
            let plasticMass = index + 1

            let pillarGroup = this.generatePillarGroup(size, index, humanMass, plasticMass);
            pillarGroup.position.set(size  * index, 0, 0)
            this.pillars.push(pillarGroup);
            this.group.add(pillarGroup)
        }
    }
    generatePillarGroup(size, index, humanMass, plasticMass) {
        var height = humanMass + plasticMass

        var humanMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var humanGeometry = new THREE.BoxGeometry( size, humanMass, size );
        var humanCube = new THREE.Mesh( humanGeometry, humanMaterial );
        humanCube.position.set(0, humanMass/2, 0);

        var plasticMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
        var plasticGeometry = new THREE.BoxGeometry( size, plasticMass, size );
        var plasticCube = new THREE.Mesh( plasticGeometry, plasticMaterial );
        plasticCube.position.set(0, humanMass + 0.1 +  plasticMass/2, 0);

        var pillarGroup = new THREE.Group()
        pillarGroup.add(humanCube)
        pillarGroup.add(plasticCube)
        return pillarGroup
    }
    update() {
        this.runExpandContract();
    }
    runExpandContract() {
        if(this.expandContractSteps > 0) {
            this.pillars.forEach((pillar) => {
                pillar.position.x += pillar.position.x * this.expandContractBy;
            });
            this.expandContractSteps -=1 ;
        }
    }
    expand(amount, numSteps) {
        if(numSteps) {
            this.expandContractSteps = numSteps;
        } else if(!this.expandContractSteps) {
            this.expandContractSteps = 100;
        }
        this.expandContractBy = amount / 100;
    }
    contract(amount, numSteps) {
        this.expand(-1 * amount, numSteps);
    }
}


export default Monument
