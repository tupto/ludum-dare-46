import { rotateAndDrawImage } from "./utils.js";
var b2Vec2 = Box2D.Common.Math.b2Vec2;

export default class Platform {
  constructor(world, spriteName, x, y, width, height, rads, tiled, fixtureOpions, isSensor = false, userData = 0, kinematicOptions = null, collisionType="SCENE") {
    this.spriteName = spriteName;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rads = rads;
    this.tiled = tiled;

    let bodyDef = new Box2D.Dynamics.b2BodyDef();
    if (kinematicOptions !== null) {
      this.isKinematic = true;
      this.rangeX = kinematicOptions.rangeX;
      this.rangeY = kinematicOptions.rangeY;
      this.maxTime = kinematicOptions.moveTime;
      this.moveTime = 0;
      bodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
      bodyDef.linearVelocity = new b2Vec2((this.rangeX) / this.maxTime, (this.rangeY) / this.maxTime);
    } else {
      this.isKinematic = false;
      bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    }
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
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fixtureDef.shape.SetAsOrientedBox(width, height, new b2Vec2(0, 0), rads);
    fixtureDef.isSensor = isSensor;
    fixtureDef.filter.categoryBits = window.collisionCategories[collisionType];
    fixtureDef.filter.maksBits = window.collisionMasks[collisionType];
    fixtureDef.userData = userData;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixtureDef);
  }

  update() {
    if (this.isKinematic) {
      this.moveTime += 1/60;
      if (this.moveTime >= this.maxTime) {
        this.moveTime -= this.maxTime;
        (this.rangeX - this.x) / this.maxTime, (this.rangeY - this.y) / this.maxTime
        this.body.SetLinearVelocity(new b2Vec2(
          -this.body.GetLinearVelocity().x,
          -this.body.GetLinearVelocity().y
        ));
      }
    }
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  render(ctx) {
    if (window.sprites[this.spriteName] !== null) {
      if (this.tiled) {
        if (document.getElementById("svg") == null) {
          let svg = document.createElement("svg");
          svg.id = "svg";
          document.body.appendChild(svg);
        }
        let img = window.sprites[this.spriteName];
        
        let matrix = document.getElementById("svg").createMatrix();
        matrix.scale(
          img.width / Math.min(this.width * 60, window.sprites[this.spriteName].width),
          img.height / Math.min(this.height * 60, window.sprites[this.spriteName].height)
        );

        let pattern = ctx.createPattern(img, 'repeat');
        pattern.setTransform(matrix);

        rotateAndDrawImage(ctx, pattern,
          this.rads,
          (this.body.x * 30), (this.body.y * 30),
          this.width * 30, this.height * 30,
          this.width * 60, this.height * 60);

        //let tileWidth = Math.min(this.width * 60, window.sprites[this.spriteName].width);
        //let tileHeight = Math.min(this.height * 60, window.sprites[this.spriteName].height);
        //let remainingWidth = this.width * 60;
        //let remainingHeight = this.height * 60;
        //let x = (this.x * 30) - (remainingWidth / 2) + (tileWidth / 2);
        //let y = this.y * 30;
//
        //while (remainingWidth > 0) {
        //  if (remainingWidth < tileWidth) {
        //    tileWidth = remainingWidth;
        //  }
//
        //  remainingHeight = this.height * 60;
        //  y = this.y * 30;
//
        //  while (remainingHeight > 0) {
        //    if (remainingHeight < tileHeight) {
        //      tileHeight = remainingHeight;
        //    }
  //
        //    let rx = (Math.cos(this.rads) * x) + (-Math.sin(this.rads) * y);
        //    let ry = (Math.sin(this.rads) * x) + (Math.cos(this.rads) * y);
        //    
        //    rotateAndDrawImage(ctx, window.sprites[this.spriteName],
        //      this.rads, rx, ry,
        //      this.width * 30, this.height * 30,
        //      tileWidth, tileHeight);
        //      ctx.fillStyle ="red";
        //      ctx.fillRect(x, y, 4, 4)
        //    
        //    y += tileHeight;
        //    remainingHeight -= tileHeight;
        //  }
        //  x += tileWidth;
        //  remainingWidth -= tileWidth;
        //}
      } else {
        rotateAndDrawImage(ctx, window.sprites[this.spriteName],
          this.rads,
          (this.body.GetPosition().x * 30), (this.body.GetPosition().y * 30),
          this.width * 30, this.height * 30,
          this.width * 60, this.height * 60);
      }
    }
  }
}