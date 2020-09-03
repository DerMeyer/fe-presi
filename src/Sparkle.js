import { Container, Graphics, BLEND_MODES } from 'pixi.js';
import { TimelineMax, TweenMax, Linear } from "gsap";


class Sparkle extends Container {
    constructor(
        width,
        height,
        {
            color = 0xFFCA00,
            targetCount = 30,
            blurMin = 2,
            blurMax = 4,
            alphaMin = 0.5,
            alphaMax = 0.8,
            radiusMin = 10,
            radiusMax = 60,
            lifetimeMin = 0.5,
            lifetimeMax = 2,
            fallingSpeedFactor = 1
        } = {}
    ) {
        super();
        this._width = width;
        this._height = height;
        this._color = color;
        this._targetCount = targetCount;
        this._blurMin = blurMin;
        this._blurMax = blurMax;
        this._alphaMin = alphaMin;
        this._alphaMax = alphaMax;
        this._radiusMin = radiusMin;
        this._radiusMax = radiusMax;
        this._lifetimeMin = lifetimeMin;
        this._lifetimeMax = lifetimeMax;
        this._fallingSpeedFactor = fallingSpeedFactor;
        this._numSparkles = 0;
        this._timeoutIDs = [];

        this.init();
    }

    init() {
        for (let i = 0; i < this._targetCount; i++) {
            this.addSparkle();
        }
        this.addSparklesByMissingCount();
    }

    addSparklesByMissingCount() {
        const recursionInterval = 100;
        const missingCount = this._targetCount - this._numSparkles;
        for (let i = 0; i < missingCount; i++) {
            const timeoutID = window.setTimeout(() => {
                this.addSparkle();
            }, Math.trunc(Math.random() * recursionInterval));
            this._timeoutIDs.push(timeoutID);
        }
        const timeoutID = window.setTimeout(() => {
            this.addSparklesByMissingCount();
        }, recursionInterval);
        this._timeoutIDs.push(timeoutID);
    }

    addSparkle() {
        this._numSparkles++;

        const offsetX = Math.trunc(Math.random() * this._width);
        const offsetY = Math.trunc(Math.random() * this._height * 1.5 - this._height * 0.5);
        const blur = Math.trunc(this._blurMin + (this._blurMax - this._blurMin) * Math.random());
        const alpha = Math.trunc((this._alphaMin + (this._alphaMax - this._alphaMin) * Math.random()) * 10) / 10;
        const radius = Math.trunc(this._radiusMin + (this._radiusMax - this._radiusMin) * Math.pow(Math.random(), 10));
        const lifetime = Math.trunc((this._lifetimeMin + (this._lifetimeMax - this._lifetimeMin) * Math.random()) * 100) / 100;
        const moveY = Math.trunc((this._height - Math.random() * this._height / 2) * this._fallingSpeedFactor);

        const sparkle = this.addChild(new Graphics());
        sparkle.beginFill(this._color);
        sparkle.drawCircle(offsetX, offsetY, radius);
        sparkle.endFill();
        sparkle.blendMode = BLEND_MODES.ADD;

        TweenMax.set(sparkle, {
            pixi: { blur }
        });
        const currentY = sparkle.y;
        TweenMax.to(sparkle, lifetime, {
            pixi: { y: currentY + moveY },
            ease: Linear.easeNone
        });
        new TimelineMax()
            .to(sparkle, Math.min(0.3, lifetime / 2), {
                pixi: { alpha }
            })
            .to(sparkle, Math.min(0.3, lifetime / 2), {
                pixi: { alpha: 0 },
                delay: Math.max(0, lifetime - 0.6),
                onComplete: () => {
                    this._numSparkles--;
                    this.removeGraphicsFromParent(sparkle);
                }
            });
    }

    dispose() {
        this._timeoutIDs.forEach(timeoutID => window.clearTimeout(timeoutID));
        this.removeGraphicsFromParent(this);
    }

    removeGraphicsFromParent(pixiGraphics) {
        if (pixiGraphics.parent) {
            pixiGraphics.parent.removeChild(pixiGraphics);
        }
    }
}

export default Sparkle;