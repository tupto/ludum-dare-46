import Splat from "./splat.js";
import { loadImage, rotateAndDrawImage } from "./utils.js";

var b2Vec2 = Box2D.Common.Math.b2Vec2;

export default class Baby {
  constructor(world, startX, startY) {
    this.world = world;
    this.splat = null;

    this.health = 100;
    this.maxHealth = 100;

    let bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = startX;
    bodyDef.position.y = startY;

    let fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 2;
    fixtureDef.friction = 0.1;
    fixtureDef.restitution = 0.5;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(0.5);
    fixtureDef.filter.categoryBits = window.collisionCategories["BABY"];
    fixtureDef.filter.maksBits = window.collisionMasks["BABY"];
    fixtureDef.userData = window.fixtureUserData["BABY"];

    this.body = world.CreateBody(bodyDef)
    this.body.CreateFixture(fixtureDef);
    this.body.SetFixedRotation(false);
  }

  update() {
    if (this.health <= 0 && this.splat === null) {
      this.splat = new Splat(this.world, this.body.GetPosition().x, this.body.GetPosition().y);
      this.world.DestroyBody(this.body);
    }
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    if (this.health > 0) {
      if (window.sprites["BABY"] !== null) {
        rotateAndDrawImage(ctx, window.sprites["BABY"],
          this.body.GetAngle(),
          (this.body.GetPosition().x * 30),
          (this.body.GetPosition().y * 30),
          15, 15,
          30, 30);
        
        ctx.fillStyle = "red";
        ctx.fillRect(
          (this.body.GetPosition().x * 30) - 15,
          (this.body.GetPosition().y * 30) - 25,
          30, 5
        );
        ctx.fillStyle = "green";
        ctx.fillRect(
          (this.body.GetPosition().x * 30) - 15,
          (this.body.GetPosition().y * 30) - 25,
          30 * (this.health / this.maxHealth), 5
        );
      }
    } else {
      if (this.splat !== null) {
        this.splat.render(ctx);
      }
    }
  }
}