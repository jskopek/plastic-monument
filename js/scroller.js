var EventEmitter = require('events');

class Scroller {
    constructor(el) {
        this.el = el;
        this.events = new EventEmitter();
        this.items = []
    }
    add(id, vHeight=1) {
        this.items.push(id)

        var itemEl = document.createElement('div')
        itemEl.style.height = `${parseInt(vHeight * 100)}vh`;
        this.el.appendChild(itemEl);


        let observer = new IntersectionObserver((entries) => {
            if(entries[0].boundingClientRect.y < 0) {
                this.events.emit('scroll', id, this.items.indexOf(id));
            }
        })
        observer.observe(itemEl);

    }
}
export default Scroller
