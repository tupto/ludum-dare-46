import Rope from "./rope.js";
import Baby from "./baby.js";

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

const ROPE_LINKS = 20;
const ROPE_WIDTH = 0.25;
const ROPE_HEIGHT = 0.1;

const JUMP_KEY = 32;
const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const HOLD_KEY = 16;

export default class Player {
  constructor(world, respawnPoint) {
    this.spawnPoint = respawnPoint;
    this.world = world;
    this.armContacts = 0;
    this.groundContacts = 0;
    this.jumpTimer = 0;
    this.jumpTimerMax = 1;
    this.jumpWaitTimer = 0.1;
    this.jumpWaitTimerMax = 0.1;
    this.jumpPower = 300;
    this.climbPower = 100;
    this.jumping = false;
    this.falling = false;
    this.doingJump = false;
    this.holding = false;

    let bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = this.spawnPoint.x + ROPE_LINKS * ROPE_WIDTH;
    bodyDef.position.y = this.spawnPoint.y -0.5;

    let fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 1;
    fixtureDef.friction = 0.25;
    fixtureDef.restitution = 0;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(1);
    fixtureDef.filter.categoryBits = window.collisionCategories["PLAYER"];
    fixtureDef.filter.maksBits = window.collisionMasks["PLAYER"];

    this.body = world.CreateBody(bodyDef)
    this.body.CreateFixture(fixtureDef);
    this.body.SetFixedRotation(true);

    //Feet
    fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = new b2CircleShape(0.8);
    fixtureDef.shape.SetLocalPosition(new b2Vec2(0, 0.3)) 
    fixtureDef.isSensor = true;
    fixtureDef.userData = window.fixtureUserData["PLAYER_FEET"];

    this.body.CreateFixture(fixtureDef);

    //Arms
    fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = new b2CircleShape(0.8);
    fixtureDef.shape.SetLocalPosition(new b2Vec2(-0.5, 0));
    fixtureDef.isSensor = true;
    fixtureDef.userData = window.fixtureUserData["PLAYER_ARMS"];
    this.body.CreateFixture(fixtureDef);

    fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.shape = new b2CircleShape(0.8);
    fixtureDef.shape.SetLocalPosition(new b2Vec2(0.5, 0));
    fixtureDef.isSensor = true;
    fixtureDef.userData = window.fixtureUserData["PLAYER_ARMS"];
    this.body.CreateFixture(fixtureDef);

    this.baby = new Baby(world, this.spawnPoint.x, this.spawnPoint.y);
    this.rope = new Rope(world, this.spawnPoint.x + ROPE_WIDTH, this.spawnPoint.y, ROPE_LINKS, ROPE_WIDTH, ROPE_HEIGHT, true);

    let revJointDef = new b2RevoluteJointDef();
    revJointDef.collideConnected = false;

    revJointDef.Initialize(this.body, this.rope.bodies[this.rope.bodies.length - 1], new b2Vec2(this.spawnPoint.x + (ROPE_WIDTH * ROPE_LINKS), this.spawnPoint.y));
    world.CreateJoint(revJointDef);
    revJointDef.Initialize(this.baby.body, this.rope.bodies[0], new b2Vec2(this.spawnPoint.x + ROPE_WIDTH, this.spawnPoint.y));
    world.CreateJoint(revJointDef);
  }

  update(world) {
    this.jumpWaitTimer += 1/60;
    if (this.groundContacts > 0) {
      this.jumping = false;
      this.doingJump = false;
      this.falling = false;
    }
    if (this.jumping) {
      if (this.body.GetLinearVelocity().y < 0) {
        this.jumping = false;
        this.doingJump = false;
        this.falling = true;
      }
    }
    if (this.falling && !this.holding) {
      this.body.ApplyForce(new b2Vec2(0, 20 * this.body.GetMass()), this.body.GetWorldCenter());
    }
    if (this.holding) {
      if (!this.jumping) {
        this.body.SetLinearVelocity(new b2Vec2(0, 0));
      } else {
        this.jumpTimer = this.jumpTimerMax;
      }
      this.body.ApplyForce(new b2Vec2(-this.world.GetGravity().x * this.body.GetMass(), -this.world.GetGravity().y * this.body.GetMass()), this.body.GetWorldCenter());
    }

    //if ((JUMP_KEY in window.pressedKeys) && this.holding) {
//
    //  debugger;
    //}

    if ((JUMP_KEY in window.pressedKeys) && this.doingJump) {
      if (this.jumpTimer = this.jumpTimerMax) {
        this.jumpTimer -= this.jumpTimerMax;
      } else {
        let impulse = this.body.GetMass() * (-this.jumpPower * (this.jumpTimer / this.jumpTimerMax));
        this.body.ApplyForce(new b2Vec2(0, impulse));
      }
    }
    if ((JUMP_KEY in window.pressedKeys) &&
      this.groundContacts > 0 &&
      this.jumpWaitTimer >= this.jumpWaitTimerMax && !this.doingJump) {

      this.jumping = true;
      this.jumpTimer = this.jumpTimerMax;
      this.jumpWaitTimer -= this.jumpWaitTimerMax;
      this.doingJump = true;
      let impulse = this.body.GetMass() * -this.jumpPower;
      this.body.ApplyForce(new b2Vec2(0, impulse), this.body.GetWorldCenter());
    }
    if ((JUMP_KEY in window.pressedKeys) && this.armContacts > 0 && this.holding) {
      let impulse = this.body.GetMass() * -this.jumpPower;
      this.body.ApplyForce(new b2Vec2(0, impulse), this.body.GetWorldCenter());
    }
    if ((HOLD_KEY in window.pressedKeys) && this.armContacts > 0 && !this.holding) {
      this.doingJump = false;
      this.jumping = false;
      this.falling = false;
      this.holding = true;
      this.body.SetLinearVelocity(new b2Vec2(0, 0));
      this.body.ApplyForce(new b2Vec2(-this.world.GetGravity().x * this.body.GetMass(), -this.world.GetGravity().y * this.body.GetMass()), this.body.GetWorldCenter());
    } else if (!(HOLD_KEY in window.pressedKeys) || this.armContacts === 0) {
      this.holding = false;
      this.falling = true;
    }
    if ((LEFT_KEY in window.pressedKeys)) {
      let force = this.body.GetMass() * -30;
      this.body.ApplyForce(new b2Vec2(force, 0), this.body.GetWorldCenter());
    }
    if ((RIGHT_KEY in window.pressedKeys)) {
      let force = this.body.GetMass() * 30;
      this.body.ApplyForce(new b2Vec2(force, 0), this.body.GetWorldCenter());
    }

    this.baby.update();
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    this.rope.render(ctx);

    if (window.sprites["PLAYER"] !== null) {
      ctx.drawImage(window.sprites["PLAYER"],
        (this.body.GetPosition().x * 30) - 30,
        (this.body.GetPosition().y * 30) - 30,
        60, 60);
    }

    this.baby.render(ctx);
  }
}