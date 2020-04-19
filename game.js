import Player from "./player.js";
import { loadImage, loadSound } from "./utils.js";
import IcePlatform from "./ice_platform.js";
import Camera from "./camera.js";
import Level from "./level.js";

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData =  Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

window.collisionCategories = {
  PLAYER: 0x0001,
  PLAYER_ROPE: 0x0002,
  BABY: 0x0004,
  SCENE: 0x0008,
  NO_COLLISION: 0x0010
}

window.collisionMasks = {
  PLAYER: window.collisionCategories["BABY"] | window.collisionCategories["SCENE"],
  PLAYER_ROPE: window.collisionCategories["SCENE"],
  BABY: window.collisionCategories["SCENE"] | window.collisionCategories["PLAYER"],
  SCENE: -1,
  NO_COLLISION: 0
}

window.fixtureUserData = {
  PLAYER: 1,
  PLAYER_FEET: 2,
  PLAYER_ARMS: 3,
  BABY: 4,
  ICE: 5,
  SNOW: 6,
  CAMP: 7,
  END: 8
}

window.sprites = {
  PLAYER: null,
  BABY: null,
  ROPE: null,
  SPLAT: null,
  ICE: null,
  SNOW: null,
  CAMP: null,
  ICE_ROCK: null,
  SAND: null,
  END: null,
  THANKS_FOR_PLAYING: null
}
loadImage("./assets/dad.png").then((img) => {
  window.sprites["PLAYER"] = img;
});
loadImage("./assets/baby.png").then((img) => {
  window.sprites["BABY"] = img;
});
loadImage("./assets/rope.png").then((img) => {
  window.sprites["ROPE"] = img;
});
loadImage("./assets/splat.png").then((img) => {
  window.sprites["SPLAT"] = img;
});
loadImage("./assets/ice.png").then((img) => {
  window.sprites["ICE"] = img;
});
loadImage("./assets/snow.png").then((img) => {
  window.sprites["SNOW"] = img;
});
loadImage("./assets/camp.png").then((img) => {
  window.sprites["CAMP"] = img;
});
loadImage("./assets/ice_rock.png").then((img) => {
  window.sprites["ICE_ROCK"] = img;
});
loadImage("./assets/sand.png").then((img) => {
  window.sprites["SAND"] = img;
});
loadImage("./assets/end.png").then((img) => {
  window.sprites["END"] = img;
});
loadImage("./assets/thanks_for_playing.png").then((img) => {
  window.sprites["THANKS_FOR_PLAYING"] = img;
});

window.sounds = {
  BABY_HURT: null
}
loadSound("./assets/baby_hurt.mp3").then((audio) => {
  window.sprites["BABY_HURT"] = audio;
});

export default class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.respawnPoint = {
      x: 4,
      y: 10
    }
    this.gameOver = false;
    this.debugDraw = new b2DebugDraw();
    this.world = new b2World(new b2Vec2(0, 10), true);
    this.run = true;
    this.changedLastPress = false;
    this.completed = false;
  }

  init() {
    this.debugDraw.SetSprite(this.ctx);
    this.debugDraw.SetDrawScale(30.0);
    this.debugDraw.SetFillAlpha(0.3);
    this.debugDraw.SetLineThickness(1.0);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);

    this.contactListener = new ContactListener(this);
    this.world.SetContactListener(this.contactListener);

    this.player = new Player(this.world, this.respawnPoint);
    this.camera = new Camera(this.world, this.player.body);
    this.level = new Level(this.world);
  }

  reset() {
    let body = this.world.GetBodyList();
    while (body != null) {
      this.world.DestroyBody(body);
      body = body.GetNext();
    }
    console.log(this.world.GetBodyCount());

    this.init(this.ctx)
  }

  update() {
    if (!this.gameOver) {
      this.player.update(this.world);
      if (this.player.body.GetPosition().y * 60 > 1000) {
        this.gameOver = true;
      }
    } else {
      if (82 in window.pressedKeys) {
        this.gameOver = false;
        this.reset();
      }
    }
    this.level.update();

    if (this.player.baby.health <= 0) {
      this.gameOver = true;
    }

    if (80 in window.pressedKeys && !this.changedLastPress) {
      this.run = !this.run;
      this.changedLastPress = true;
    } else if (!(80 in window.pressedKeys) && this.changedLastPress) {
      this.changedLastPress = false;
    }
    if (this.run) {
      this.world.Step(1 / 60, 10 ,10);
    }
  
    this.world.ClearForces();
  }
  
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  render() {
    if (this.completed) {
      this.ctx.resetTransform();
      if (window.sprites["THANKS_FOR_PLAYING"] != null) {
        this.ctx.drawImage(window.sprites["THANKS_FOR_PLAYING"], 0, 0);
      }

      this.ctx.fillStyle = "red";
      this.ctx.font = "30px Arial";
      this.ctx.textAlign = "left";
      this.ctx.fillText("Thanks for\nplaying...", 20, 50);
      return;
    }
    this.camera.createViewport(this.ctx);
    this.camera.clearCtx(this.ctx);
    this.camera.transformCtx(this.ctx);

    //this.world.DrawDebugData();
    this.level.render(this.ctx);
    this.player.render(this.ctx);

    if (this.gameOver) {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(this.camera.viewport.left + this.camera.viewport.width / 2 - 150,
        this.camera.viewport.top + this.camera.viewport.height / 2 - 50, 300, 100);
      this.ctx.fillStyle = "red";
      this.ctx.font = "30px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Oh dear...",
        this.camera.viewport.left + this.camera.viewport.width / 2,
        this.camera.viewport.top + this.camera.viewport.height / 2); 
      this.ctx.font = "20px Arial";
      this.ctx.fillText("Press R to go back to camp",
        this.camera.viewport.left + this.camera.viewport.width / 2,
        this.camera.viewport.top + this.camera.viewport.height / 2 + 30); 
    }
  }
}

class ContactListener extends Box2D.Dynamics.b2ContactListener {
  constructor(game) {
    super();
    this.game = game;
  }

  BeginContact(contact) {
    let userDataA = contact.GetFixtureA().GetUserData();
    let userDataB = contact.GetFixtureB().GetUserData();
    if (userDataA === window.fixtureUserData["END"] ||
        userDataB === window.fixtureUserData["END"]) {
      if (userDataA === window.fixtureUserData["PLAYER_FEET"] ||
          userDataB === window.fixtureUserData["PLAYER_FEET"] ||
          userDataA === window.fixtureUserData["PLAYER_ARMS"] ||
          userDataB === window.fixtureUserData["PLAYER_ARMS"]) {
        this.game.completed = true;
        return;
      }
    }
    if (userDataA === window.fixtureUserData["CAMP"] ||
        userDataB === window.fixtureUserData["CAMP"]) {
      if (userDataA === window.fixtureUserData["PLAYER_FEET"] ||
          userDataB === window.fixtureUserData["PLAYER_FEET"] ||
          userDataA === window.fixtureUserData["PLAYER_ARMS"] ||
          userDataB === window.fixtureUserData["PLAYER_ARMS"]) {
        let camp = userDataA === window.fixtureUserData["CAMP"] ? contact.GetFixtureA().GetBody() : contact.GetFixtureB().GetBody();
        this.game.respawnPoint.x = camp.GetPosition().x;
        this.game.respawnPoint.y = camp.GetPosition().y + 2.5;
        this.game.player.baby.health = this.game.player.baby.maxHealth;
        return;
      }
    }

    if (userDataA === window.fixtureUserData["PLAYER_FEET"] || userDataB === window.fixtureUserData["PLAYER_FEET"]) {
      this.game.player.groundContacts++;
    }

    if (userDataA === window.fixtureUserData["PLAYER_ARMS"] || userDataB === window.fixtureUserData["PLAYER_ARMS"]) {
      if (userDataA !== window.fixtureUserData["SNOW"] && userDataB !== window.fixtureUserData["SNOW"]) {
        this.game.player.armContacts++;
      }
    }
  }

  EndContact(contact) {
    let userDataA = contact.GetFixtureA().GetUserData();
    let userDataB = contact.GetFixtureB().GetUserData();
    if (userDataA === window.fixtureUserData["CAMP"] || userDataB === window.fixtureUserData["CAMP"]) {
      return;
    }

    if (userDataA === window.fixtureUserData["PLAYER_FEET"] || userDataB === window.fixtureUserData["PLAYER_FEET"]) {
      this.game.player.groundContacts--;
    }

    if (userDataA === window.fixtureUserData["PLAYER_ARMS"] || userDataB === window.fixtureUserData["PLAYER_ARMS"]) {
      if (userDataA !== window.fixtureUserData["SNOW"] && userDataB !== window.fixtureUserData["SNOW"]) {
        this.game.player.armContacts--;
      }
    }
  }

  PostSolve(contact, impulse) {
    let userDataA = contact.GetFixtureA().GetUserData()
    let userDataB = contact.GetFixtureB().GetUserData()
    if (userDataA === window.fixtureUserData["BABY"] || userDataB === window.fixtureUserData["BABY"]) {
      let normalImpuse = Math.sqrt(
        impulse.normalImpulses[0] * impulse.normalImpulses[0] +
        impulse.normalImpulses[1] * impulse.normalImpulses[1]
      );
      let tangentImpulse = Math.sqrt(
        impulse.tangentImpulses[0] * impulse.tangentImpulses[0] +
        impulse.tangentImpulses[1] * impulse.tangentImpulses[1]
      );

      let largestImpulse = Math.max(normalImpuse, tangentImpulse);
      if (largestImpulse > 20) {
        this.game.player.baby.health -= largestImpulse / 2;
        if (window.sounds["BABY_HURT"]) {
          window.sounds["BABY_HURT"].play();
        }
      }
    }
  }
}