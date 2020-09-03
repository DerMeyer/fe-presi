import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { gsap, TweenMax } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

import Sparkle from './Sparkle';
import Explosion from './Explosion';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);


class PixiApp {
    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            resolution: window.devicePixelRatio
        });

        this.viewport = new Viewport({
            worldWidth: this.app.stage.width,
            worldHeight: this.app.stage.height
        });

        this.initApp();
    }

    initApp() {
        document.body.style.padding = '0';
        document.body.style.margin = '0';

        this.app.renderer.backgroundColor = 0x00008B;

        document.getElementById('root').appendChild(this.app.view);

        const rect = this.drawRect();
        this.moveRect(rect);
        this.addElement(rect);

        const starTexture = PIXI.Texture.from('star.png');
        const star = new PIXI.Sprite(starTexture);
        this.addElement(star);

        const sparkle = this.initSparkle();
        this.addElement(sparkle);

        const explosion = this.initExplosion(starTexture);
        this.addElement(explosion);
    }

    addElement(element) {
        //this.app.stage.addChild(pixiElement);

        this.app.stage.addChild(this.viewport);
        this.viewport.addChild(element);
    }

    drawRect() {
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xFF69B4);
        graphics.drawRect(200, 200, 400, 400);
        graphics.endFill();

        return graphics;
    }

    moveRect(rect) {
        const container = new PIXI.Container();
        container.addChild(rect);

        TweenMax.to(rect, 5, {
            pixi: {
                x: 1500,
                y: 500
            },
            delay: 2
        });

        return container;
    }

    initSparkle() {
        return new Sparkle(this.app.screen.width, this.app.screen.height);
    }

    initExplosion(texture) {
        return new Explosion(
            new PIXI.Point(this.app.screen.width / 2, this.app.screen.height / 2),
            400,
            5,
            texture,
            {
                textureCount: 120,
                randomOffset: 120,
                randomScaleMin: 0.5,
                randomScaleMax: 2
            }
        );
    }
}

new PixiApp();