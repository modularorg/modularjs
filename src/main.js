export default class {
    constructor(options) {
        this.app;
        this.modules = options.modules;
        this.currentModules = {};
        this.activeModules = {};
        this.newModules = {};
        this.moduleId = 0;
    }

    init(app, scope) {
        const container = scope || document;
        const elements = container.querySelectorAll('*');

        if (app && !this.app) {
            this.app = app;
        }

        this.activeModules['app'] = { 'app': this.app };

        elements.forEach((el) => {
          Array.from(el.attributes).forEach((i) => {

            if (i.name.startsWith('data-module')) {
                let moduleExists = false;
                let dataName = i.name.split('-').splice(2);
                let moduleName = this.toCamel(dataName);

                if (this.modules[moduleName]) {
                    moduleExists = true;
                } else if (this.modules[this.toUpper(moduleName)]) {
                    moduleName = this.toUpper(moduleName);
                    moduleExists = true;
                }

                if (moduleExists) {
                    const options = {
                        el: el,
                        name: moduleName,
                        dataName: dataName.join('-')
                    };

                    const module = new this.modules[moduleName](options);
                    let id = i.value;

                    if (!id) {
                        this.moduleId++;
                        id = 'm' + this.moduleId;
                        el.setAttribute(i.name, id);
                    }

                    this.addActiveModule(moduleName, id, module);

                    const moduleId = moduleName + '-' + id;

                    if (scope) {
                        this.newModules[moduleId] = module;
                    } else {
                        this.currentModules[moduleId] = module;
                    }
                }
            }
          })
        })

        Object.entries(this.currentModules).forEach(([id, module]) => {
            if (scope) {
                const split = id.split('-');
                const moduleName = split.shift();
                const moduleId = split.pop();
                this.addActiveModule(moduleName, moduleId, module);
            } else {
                this.initModule(module);
            }
        });
    }

    initModule(module) {
        module.mInit(this.activeModules);
        module.init();
    }

    addActiveModule(name, id, module) {
        if (this.activeModules[name]) {
            Object.assign(this.activeModules[name], { [id]: module });
        } else {
            this.activeModules[name] = { [id]: module };
        }
    }

    update(scope) {
        this.init(this.app, scope);

        Object.entries(this.currentModules).forEach(([id, module]) => {
            module.mUpdate(this.activeModules);
        });

        Object.entries(this.newModules).forEach(([id, module]) => {
            this.initModule(module);
        });

        Object.assign(this.currentModules, this.newModules);
    }

    destroy(scope) {
        if (scope) {
            this.destroyScope(scope);
        } else {
            this.destroyModules();
        }
    }

    destroyScope(scope) {
        const elements = scope.querySelectorAll('*');

        elements.forEach((el) => {
            Array.from(el.attributes).forEach((i) => {

                if (i.name.startsWith('data-module')) {
                    const id = i.value;
                    const dataName = i.name.split('-').splice(2);
                    let moduleName = this.toCamel(dataName) + '-' + id;
                    let moduleExists = false;

                    if (this.currentModules[moduleName]) {
                        moduleExists = true;
                    } else if (this.currentModules[this.toUpper(moduleName)]) {
                        moduleName = this.toUpper(moduleName);
                        moduleExists = true;
                    }

                    if (moduleExists) {
                        this.destroyModule(this.currentModules[moduleName]);

                        delete this.currentModules[moduleName];
                    }
                }

            })
        })

        this.activeModules = {};
        this.newModules = {};
    }

    destroyModules() {
        Object.entries(this.currentModules).forEach(([id, module]) => {
            this.destroyModule(module);
        });

        this.currentModules = [];
    }

    destroyModule(module) {
        module.mDestroy();
        module.destroy();
    }

    toCamel(arr) {
        return arr.reduce((a, b) => a + this.toUpper(b));
    }

    toUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export {default as module} from './module';
