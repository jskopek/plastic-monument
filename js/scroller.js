var EventEmitter = require('events');

class Scroller {
    constructor(el) {
        this.el = el;
        this.events = new EventEmitter();
        this.items = []
        this.index = 0

        this.ignoreScroll = false // HACK - DISABLE IntersectionObserver ON MANUAL SCROLL
    }
    add(id, vHeight=1) {
        this.items.push(id)

        var itemEl = document.createElement('div')
        itemEl.style.height = `${parseInt(vHeight * 100)}vh`;
        this.el.appendChild(itemEl);



        let observer = new IntersectionObserver((entries) => {
            if(this.ignoreScroll) { return; } // HACK - DISABLE IntersectionObserver ON MANUAL SCROLL
            if(entries[0].boundingClientRect.y <= 0) {
                this.index = this.items.indexOf(id)
                this.events.emit('scroll', id, this.index);
            }
        })
        observer.observe(itemEl);

    }
    on(eventName, callback) { this.events.on(eventName, callback) }

    scrollTo(index) {
        this.ignoreScroll = true; // HACK - DISABLE IntersectionObserver ON MANUAL SCROLL

        this.el.children[index].scrollIntoView(false)
        this.index = index;
        this.events.emit('scroll', this.items[this.index], this.index)

        setTimeout(() => { this.ignoreScroll = false; }, 1000); // HACK - DISABLE IntersectionObserver ON MANUAL SCROLL
    }
    scrollNext() {
        if(this.canScrollNext()) {
            this.scrollTo(this.index + 1)
        }
    }
    scrollPrevious() {
        if(this.canScrollPrevious()) {
            this.scrollTo(this.index - 1)
        }
    }
    canScrollNext() {
        return (this.index < this.items.length - 1)
    }
    canScrollPrevious() {
        return (this.index > 0)
    }
}
export default Scroller
