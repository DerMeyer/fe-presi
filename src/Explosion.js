import { Container, Sprite, Point } from 'pixi.js';
import { TimelineMax, TweenMax, TweenLite, Linear } from 'gsap';


class Explosion extends Container {
    constructor(
        center,
        diameter,
        duration,
        texture,
        {
            textureCount = 40,
            randomOffset = 40,
            randomScaleMin = 0.5,
            randomScaleMax = 2
        } = {}
    ) {
        super();
        this._center = center;
        this._diameter = diameter;
        this._duration = duration;
        this._texture = texture;
        this._textureCount = textureCount;
        this._randomOffset = randomOffset;
        this._randomScaleMin = randomScaleMin;
        this._randomScaleMax = randomScaleMax;
        console.log(center, diameter, duration, texture);// TODO remove dev code

        this.init();
    }

    init() {
        for (let i = 0; i < this._textureCount; i++) {
            this.createSprite(i);
        }
        setTimeout(() => {
            this.dispose();
        }, this._duration * 1000);
    }

    createSprite(positionIndex) {
        const randomOffsetX = (Math.random() - 0.5) * 2 * this._randomOffset;
        const randomOffsetY = (Math.random() - 0.5) * 2 * this._randomOffset;
        const randomScale = this._randomScaleMin + (this._randomScaleMax - this._randomScaleMin) * Math.random();
        const angle = 2 * Math.PI * (this._textureCount - positionIndex) / this._textureCount;
        const start = new Point(this._center.x + Math.sin(angle) * (this._diameter + randomOffsetX) / 2, this._center.y + Math.cos(angle) * (this._diameter + randomOffsetY) / 2);
        const target = new Point(this._center.x + Math.sin(angle) * (this._diameter + randomOffsetX), this._center.y + Math.cos(angle) * (this._diameter + randomOffsetY));

        const startTime = this._duration / 4 * Math.random();
        const spriteLifetime = this._duration - startTime - startTime * Math.random();
        const spriteFadetime = this._duration / (4 + Math.trunc(Math.random() * 2));

        const sprite = this.addChild(new Sprite(this._texture));
        sprite.alpha = 1;
        sprite.scale.set(0.3 * randomScale);
        sprite.anchor.set(0.5);
        sprite.x = start.x;
        sprite.y = start.y;

        TweenLite.to(sprite, Math.round(300 + 50 * Math.random()), {
            rotation: '+=360',
            ease: Linear.easeNone,
            repeat: -1
        });
        TweenMax.to(sprite, this._duration, {
            pixi: {
                x: target.x,
                y: target.y
            },
            delay: startTime
        });
        new TimelineMax({
            delay: startTime
        })
            .to(sprite, spriteFadetime, {
                pixi: {
                    alpha: 1
                }
            })
            .to(sprite, spriteFadetime, {
                pixi: {
                    alpha: 0
                },
                delay: spriteLifetime - spriteFadetime * 2
            });
    }

    dispose() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}

export default Explosion;