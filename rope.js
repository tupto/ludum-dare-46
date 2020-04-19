import { loadImage, rotateAndDrawImage } from "./utils.js";

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;

export default class Rope {
  constructor(world, startX, startY, numLinks, linkWidth, linkHeight, playerRope = false) {
    this.numLinks = numLinks;
    this.linkWidth = linkWidth;
    this.linkHeight = linkHeight;

    let bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = startX;
    bodyDef.position.y = startY;

    let fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 2;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.0;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fixtureDef.shape.SetAsBox(this.linkWidth, this.linkHeight);

    //if (playerRope) {
      fixtureDef.filter.categoryBits = window.collisionCategories["PLAYER_ROPE"];
      fixtureDef.filter.maskBits = window.collisionMasks["PLAYER_ROPE"];
    //} else {
    //  fixtureDef.fiter.categoryBits = window.collisionCategories["OTHER"];
    //  fixtureDef.filter.maskBits = window.collisionCategories["OTHER"];
    //}

    let jointDef = new b2RevoluteJointDef();
    jointDef.collideConnected = false;

    this.bodies = [];
    for (let i = 0; i < numLinks; i++) {
      bodyDef.position.x = startX + (i * linkWidth);

      this.bodies[i] = world.CreateBody(bodyDef);
      this.bodies[i].CreateFixture(fixtureDef);

      if (i !== 0) {
        jointDef.Initialize(this.bodies[i - 1], this.bodies[i], new b2Vec2(startX + (i * this.linkWidth), startY));
        jointDef.upperAngle = 0.785398;
        jointDef.lowerAngle = -0.785398;
        world.CreateJoint(jointDef);
      }
    }
  }

  render(ctx) {
    if (window.sprites["ROPE"] !== null) {
      for (let i = 0; i < this.numLinks; i++) {
        rotateAndDrawImage(ctx, window.sprites["ROPE"],
          this.bodies[i].GetAngle(),
          (this.bodies[i].GetPosition().x * 30),
          (this.bodies[i].GetPosition().y * 30),
          this.linkWidth * 60 / 2, this.linkHeight * 60 / 2,
          this.linkWidth * 30, this.linkHeight * 30);
      }
    }
  }
}