export default class {
    constructor(options) {
        this.app;
        this.modules = options.modules;
        this.currentModules = [];
    }

    init(app) {
        this.initModules(app);
    }

    destroy() {
        this.destroyModules();
    }

    initModules(app) {
        const elements = document.querySelectorAll('*');
        let currentModules = {};
        let currentId = 0;

        if (app && !this.app) {
            this.app = app;
        }

        currentModules['app'] = { 'app': this.app };

        elements.forEach((el) => {
          Array.from(el.attributes).forEach((i) => {

            if (i.name.startsWith('data-module')) {
                const moduleName = i.name.split('-').pop();

                const options = {
                    el: el,
                    name: moduleName
                };

                if (this.modules[moduleName]) {
                    const module = new this.modules[moduleName](options);

                    let id = el.getAttribute(i.name);

                    if (!id) {
                        currentId++;
                        id = 'm' + currentId;
                    }

                    if (currentModules[moduleName]) {
                        Object.assign(currentModules[moduleName], { [id]: module });
                    } else {
                        currentModules[moduleName] = { [id]: module };
                    }

                    this.currentModules.push(module);
                }
            }
          })
        })

        this.currentModules.forEach((module) => {
            module.mInit(currentModules);
            module.init();
        });
    }

    destroyModules() {
        this.currentModules.forEach((module) => {
            module.mDestroy();
            module.destroy();
        });

        this.currentModules = [];
    }
}

export {default as module} from './module';
