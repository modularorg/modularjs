<p align="center">
    <a href="https://github.com/modularbp/modular-boilerplate">
        <img src="https://user-images.githubusercontent.com/4596862/37635200-aa3271b2-2bd0-11e8-8a65-9cafa0addd67.png" height="140">
    </a>
</p>
<h1 align="center">modularJS</h1>
<p align="center">Dead simple modular JavaScript framework for ES modules.</p>

## Installation
```sh
npm install modujs
```

## Why
Just what's missing from JavaScript to seamlessly work in a modular way with the DOM and ES modules.

- Automatically init visible modules.
- Easily call other modules methods.
- Quickly set scoped events with delegation.
- Simply select DOM elements scoped in their module.

## Usage
#### Main file
```js
import modular from 'modujs';
import * as modules from './modules';

const app = new modular({
    modules: modules
});
app.init(app);
```
#### Module example
```html
<div data-module-example>
    <h2>Example</h2>
    <button data-example="button">Button</button>
</div>
```
```js
import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            click: {
                button: 'doSomething'
            }
        }
    }

    doSomething() {
        console.log('Hello world');
    }
}
```

#### Modules file
```js
export {default as example} from './modules/example';
```

## Objects
| Object | Description | Example |
| ------ | ----------- | ------- | 
| `this.el` | The module element. | `this.el.classList.add('is-open')` |
| `this.events` | The module events. | `this.events = { click: 'open' }` |


## Methods
| Method | Description | Example |
| ------ | ----------- | ------- | 
| `this.$('query'[, 'context'])` | Module scoped query selector. | `this.$('dropdown', e.currentTarget)` |
| `this.parent('name', 'context')` | Module scoped parent selector. | `this.parent('item', e.currentTarget)` |
| `this.call('function', arg, 'module'[, 'id'])` | Call another module method. | `this.call('scrollTo', section, 'scroll', 'main')` |
| `this.on('event', 'module', function[, 'id'])` | Listen to another module event. | `this.on('select', 'Select', this.changeSomething, 'first')` |
| `this.getData('name'[, 'context'])` | Get module or target data attribute. | `this.getData('name', e.currentTarget)` |
| `this.setData('name', 'value'[, 'context'])` | Set module or target data attribute. | `this.setData('name', 'value', e.currentTarget)` |

## Custom methods
| Method | Description |
| ------ | ----------- |
| `init() { [...] }` | Automatically called on app init. Use this instead of the `constructor`, if you want to use the methods above. |
| `destroy() { [...] }` | Automatically called on app destroy. Use this if you need to destroy anything specific. The events are already destroyed. |

## App methods
| Method | Description |
| ------ | ----------- |
| `this.call('init', 'app')` | Init all modules. |
| `this.call('update', scope, 'app')` | Update scoped modules. |
| `this.call('destroy'[, scope], 'app')` | Destroy all or scoped modules. |

## Examples
#### Modal example
```html
<div data-module-modal="one">
    <h2 data-modal="text">Modal</h2>
    <button data-modal="accept">Ok</button>
    <button data-modal="cancel">Cancel</button>
</div>
```
```js
import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            click: {
                accept: 'accept',
                cancel: 'close'
            }
        }
    }
    
    init() { // Init is called automatically
        this.open();
    }

    open() {
        this.el.classlist.add('is-open');   
    }

    accept() {
        this.$('text').textContent = 'Thank you!';
        this.$('accept').style.display = 'none';
        this.$('cancel').textContent = 'Close';
    }

    close() {
        this.el.classlist.remove('is-open');
    }
}
```
#### Call example
```html
<div data-module-example>
    <button data-example="one">One</button>
    <button data-example="all">All</button>
</div>
```
```js
import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            click: {
                one: 'openSpecificModal',
                all: 'openAllModals'
            }
        }
    }

    openSpecificModal() {
        this.call('open', false, 'modal', 'one');
    }

    openAllModals() {
        this.call('open', 'modal');
    }
}
```
#### Accordion example
```html
<div data-module-accordion data-accordion-open="true">
    <section data-accordion="section">
        <header data-accordion="header">
            <h2>Title</h2>
        </header>
        <div data-accordion="main">
            <p>Content</p>
        </div>
    </section>
    <section data-accordion="section">
        <header data-accordion="header">
            <h2>Title</h2>
        </header>
        <div data-accordion="main">
            <p>Content</p>
        </div>
    </section>
</div>
```
```js
import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);

        this.events = {
            click: {
                header: 'toggleSection'
            }
        }
    }

    init() {
        if (this.data('open')) {
            this.$('section')[0].classList.add('is-open');
        }
    }

    toggleSection(e) {
        const target = e.currentTarget;
        const section = this.parent('section', target);
        const main = this.$('main', target);
        
        if (section.classList.contains('is-open')) {
            section.classList.remove('is-open');
        } else {
            this.$('section.is-open').classList.remove('is-open');
            section.classList.add('is-open');
            this.call('scrollto', section, 'scroll', 'main');
        }
    }
}
```
