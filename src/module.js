export default class {
    constructor(options) {
        this.mAttr = 'data-' + options.name;
        this.el = options.el;
        // this.els = {};
    }

    mInit(modules) {
        this.modules = modules;
        this.mCheckEventTarget = this.mCheckEventTarget.bind(this);

        if (this.events) {
            Object.keys(this.events).forEach((event) => this.mAddEvent(event));
        }

        // const els = this.el.querySelectorAll('['+this.mAttr+']');

        // els.forEach((el) => {
        //     const name = el.getAttribute(this.mAttr);

        //     if (this.els[name] instanceof Array) {
        //         this.els[name].push(el);
        //     } else if(this.els[name]) {
        //         this.els[name] = [this.els[name], el];
        //     } else {
        //         this.els[name] = el;
        //     }
        // })
    }

    mDestroy() {
        if (this.events) {
            Object.keys(this.events).forEach((event) => this.mRemoveEvent(event));
        }
    }

    mAddEvent(event) {
        this.el.addEventListener(event, this.mCheckEventTarget);
    }

    mRemoveEvent(event) {
        this.el.removeEventListener(event, this.mCheckEventTarget);
    }

    mCheckEventTarget(e) {
        const event = this.events[e.type];

        if (typeof event === "string") {
            this[event](e);
        } else {
            const data = '['+this.mAttr+']';
            let target = e.target;

            while (target && target !== document) {
                if (target.matches(data)) {
                    const name = target.getAttribute(this.mAttr);

                    if (event.hasOwnProperty(name)) {
                        const method = event[name];

                        Object.defineProperty(e, 'currentTarget', {value: target});

                        this[method](e);

                        break;
                    }
                }

                target = target.parentNode;
            }
        }
    }

    $(query, context) {
        const classIndex = query.indexOf('.');
        const idIndex = query.indexOf('#');
        let name = query;
        let more = '';
        let parent = this.el;

        if (classIndex != -1 || idIndex != -1) {
            let index;
            if (classIndex != -1 && idIndex == -1) {
                index = classIndex;
            } else if (idIndex != -1 && classIndex == -1) {
                index = idIndex;
            } else {
                index = Math.min(classIndex, idIndex);
            }

            name = query.slice(0, index);
            more = query.slice(index);
        }

        if (typeof context == 'object') {
            parent = context;
        }

        const els = parent.querySelectorAll('[' + this.mAttr + '=' + name + ']' + more);

        if (els.length == 1) {
            return els[0];
        } else {
            return els;
        }
    }

    parent(query, context) {
        const data = '[' + this.mAttr + '=' + query + ']';
        let parent = context;

        while (parent && parent !== document) {
            if (parent.matches(data)) {
                return parent;
            }

            parent = parent.parentNode;
        }
    }

    call(func, mod, id)  {
        let f = func.split('(');
        let args;

        if (f.length == 2) {
            f[1] = f[1].slice(0, -1);

            if (f[1]) {
                args = f[1];
            }
        }

        f = f[0];

        if (id) {
            this.modules[mod][id][f](args);
        } else {
            Object.keys(this.modules[mod]).forEach((id) => {
                this.modules[mod][id][f](args);
            });
        }
    }

    init() {

    }

    destroy() {

    }
}
