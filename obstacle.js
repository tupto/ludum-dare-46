import { rotateAndDrawImage } from "./utils.js";
var b2Vec2 = Box2D.Common.Math.b2Vec2;

export default class Obstacle {
  constructor(world, spriteName, x, y, radius, fixtureOpions, userData = 0, collisionType="SCENE") {
    this.spriteName = spriteName;
    this.x = x;
    this.y = y;
    this.radius = radius;

    let bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    let fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    if (fixtureOpions.density !== undefined) {
      fixtureDef.density = fixtureOpions.density;
    }
    if (fixtureOpions.friction !== undefined) {
      fixtureDef.friction = fixtureOpions.friction;
    }
    if (fixtureOpions.restitution !== undefined) {
      fixtureDef.restitution = fixtureOpions.restitution;
    }
    fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(radius);
    fixtureDef.filter.categoryBits = window.collisionCategories[collisionType];
    fixtureDef.filter.maksBits = window.collisionMasks[collisionType];
    fixtureDef.userData = userData;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixtureDef);
  }

  update() {
    
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    if (window.sprites[this.spriteName] !== null) {
      rotateAndDrawImage(ctx, window.sprites[this.spriteName],
        this.rads,
        (this.x * 30), (this.y * 30),
        this.radius * 30, this.radius * 30,
        this.radius * 60, this.radius * 60);
    }
  }
}