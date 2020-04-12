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

export default ScaleGroupChildren
