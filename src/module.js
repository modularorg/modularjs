export default class {
    constructor(options) {
        this.mAttr = 'data-' + options.dataName;
        this.mCaptureEvents = ['mouseenter', 'mouseleave'];
        this.el = options.el;
    }

    mInit(modules) {
        this.modules = modules;
        this.mCheckEventTarget = this.mCheckEventTarget.bind(this);

        if (this.events) {
            Object.keys(this.events).forEach((event) => this.mAddEvent(event));
        }
    }

    mUpdate(modules) {
        this.modules = modules;
    }

    mDestroy() {
        if (this.events) {
            Object.keys(this.events).forEach((event) => this.mRemoveEvent(event));
        }
    }

    mAddEvent(event) {
        const capture = this.mCaptureEvents.includes(event) ? true : false;

        this.el.addEventListener(event, this.mCheckEventTarget, capture);
    }

    mRemoveEvent(event) {
        const capture = this.mCaptureEvents.includes(event) ? true : false;

        this.el.removeEventListener(event, this.mCheckEventTarget, capture);
    }

    mCheckEventTarget(e) {
        const event = this.events[e.type];

        if (typeof event === "string") {
            this[event](e);
        } else {
            const data = '['+this.mAttr+']';
            let target = e.target;

            if (this.mCaptureEvents.includes(e.type)) {
                if(target.matches(data)) {
                    this.mCallEventMethod(e, event, target);
                }
            } else {
                while (target && target !== document) {
                    if (target.matches(data)) {
                        if(this.mCallEventMethod(e, event, target) != 'undefined') {
                            break;
                        }
                    }
                    target = target.parentNode;
                }
            }
        }
    }

    mCallEventMethod(e, event, target) {
        const name = target.getAttribute(this.mAttr);

        if (event.hasOwnProperty(name)) {
            const method = event[name];

            if (!e.hasOwnProperty('currentTarget')) {
                Object.defineProperty(e, 'currentTarget', {value: target});
            }
            if (!e.hasOwnProperty('curTarget')) {
                Object.defineProperty(e, 'curTarget', {value: target}); // For IE 11
            }

            this[method](e);
        }
    }

    $(query, context) {
        const classIndex = query.indexOf('.');
        const idIndex = query.indexOf('#');
        const attrIndex = query.indexOf('[');
        const indexes = [classIndex, idIndex, attrIndex].filter(index => index != -1);

        let index = false;
        let name = query;
        let more = '';
        let parent = this.el;

        if (indexes.length) {
            index = Math.min(...indexes);
            name = query.slice(0, index);
            more = query.slice(index);
        }

        if (typeof context == 'object') {
            parent = context;
        }

        return parent.querySelectorAll('[' + this.mAttr + '=' + name + ']' + more);
    }

    parent(query, context) {
        const data = '[' + this.mAttr + '=' + query + ']';
        let parent = context.parentNode;

        while (parent && parent !== document) {
            if (parent.matches(data)) {
                return parent;
            }

            parent = parent.parentNode;
        }
    }

    getData(name, context) {
        const target = context || this.el;
        return target.getAttribute(this.mAttr + '-' + name);
    }

    setData(name, value, context) {
        const target = context || this.el;
        return target.setAttribute(this.mAttr + '-' + name, value);
    }

    call(func, args, mod, id) {
        if (args && !mod) {
            mod = args;
            args = false;
        }

        if (this.modules[mod]) {
            if (id) {
                if (this.modules[mod][id]) {
                    this.modules[mod][id][func](args);
                }
            } else {
                Object.keys(this.modules[mod]).forEach((id) => {
                    this.modules[mod][id][func](args);
                });
            }
        }
    }

    on(e, mod, func, id) {
        if (this.modules[mod]) {
            if (id) {
                this.modules[mod][id].el.addEventListener(e, o => func(o));
            } else {
                Object.keys(this.modules[mod]).forEach((i) => {
                    this.modules[mod][i].el.addEventListener(e, o => func(o));
                })
            }
        }
    }

    init() {

    }

    destroy() {

    }
}
