import { Application } from 'pixi.js';


class PixiApp {
    constructor() {
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight
        });

        this.create();
    }

    create() {
        document.body.style.padding = '0';
        document.body.style.margin = '0';

        this.app.renderer.backgroundColor = 0x000000;

        document.getElementById('root').appendChild(this.app.view);
    }
}

new PixiApp();