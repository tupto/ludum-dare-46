import { loadImage } from "./utils.js";

var b2Vec2 = Box2D.Common.Math.b2Vec2;

const NUM_SPLATS = 10;
export default class Splat {
  constructor(world, x, y) {
    this.sprite = null;
    loadImage("./assets/splat.png").then((img) => {
      this.sprite = img;
    });

    let bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    let fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 0;
    fixtureDef.friction = 0;
    fixtureDef.restitution = 0;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
    fixtureDef.filter.categoryBits = window.collisionCategories["NO_COLLISION"];
    fixtureDef.filter.maskBits = window.collisionMasks["NO_COLLISION"];

    this.bodies = [];
    for (let i = 0; i < NUM_SPLATS; i++) {
      this.bodies[i] = world.CreateBody(bodyDef);
      this.bodies[i].CreateFixture(fixtureDef);
      this.bodies[i].SetLinearVelocity(
        new b2Vec2(Math.random() * 3, Math.random() * 3)
      );
    }
  }

  render(ctx) {
    if (window.sprites["SPLAT"] !== null) {
      for (let i = 0; i < NUM_SPLATS; i++) {
        ctx.drawImage(window.sprites["SPLAT"],
          (this.bodies[i].GetPosition().x * 30) - 15,
          (this.bodies[i].GetPosition().y * 30) - 15,
          30, 30);
      }
    }
  }
}