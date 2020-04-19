import IcePlatform from "./ice_platform.js";
import SnowPlatform from "./snow_platform.js";
import SandPlatform from "./sand_platform.js";
import MovingSnowPlatform from "./moving_snow_platform.js";
import MovingIcePlatform from "./moving_ice_platform.js";
import IceRockObstacle from "./ice_rock_obstacle.js";
import Camp from "./camp.js";
import End from "./end.js";

export default class Level {
  constructor(world) {
    this.world = world;
    this.platforms = [];
    this.camps = [];
    this.camps.push(new Camp(world, 4, 7.5, 0));
    //this.platforms.push(new MovingSnowPlatform(world, 1, 4.5, 1, 0.5, 0, {
    //  rangeX: 10, rangeY: 0, moveTime: 5
    //}))
    this.platforms.push(new SnowPlatform(world, -20, -25, 20, 50, 0));
    this.platforms.push(new SnowPlatform(world, 25, 14, 25, 5, 0));
    this.platforms.push(new IceRockObstacle(world, 25, 8.5, 0.5));
    this.platforms.push(new IceRockObstacle(world, 29, 8.5, 0.5));
    this.platforms.push(new IceRockObstacle(world, 33, 8.5, 0.5));
    this.platforms.push(new IceRockObstacle(world, 37, 8.5, 0.5));
    this.platforms.push(new IceRockObstacle(world, 41.5, 8, 1));
    this.platforms.push(new IceRockObstacle(world, 45.5, 8.5, 0.5));
    this.platforms.push(new IceRockObstacle(world, 49.5, 8.5, 0.5));
    this.platforms.push(new IceRockObstacle(world, 53.5, 8.5, 0.5));
    this.platforms.push(new SnowPlatform(world, 50, 14, 25, 5, 0));
    this.platforms.push(new SnowPlatform(world, 75, 14, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 75, 5, 10, 10, 0));
    this.camps.push(new Camp(world, 75, -6.5, 0));
    this.platforms.push(new MovingSnowPlatform(world, 87, -4.5, 2, 0.5, 0, {
      rangeX: 27, rangeY: 0, moveTime: 5
    }))
    this.platforms.push(new IcePlatform(world, 126, 5, 10, 10, 0));
    this.platforms.push(new MovingIcePlatform(world, 138, -4.5, 2, 0.5, 0, {
      rangeX: 14, rangeY: 0, moveTime: 5
    }))
    this.platforms.push(new MovingIcePlatform(world, 170, -4.5, 2, 0.5, 0, {
      rangeX: -14, rangeY: 0, moveTime: 5
    }))
    this.platforms.push(new IcePlatform(world, 182, 5, 10, 10, 0));
    this.camps.push(new Camp(world, 177, -6.5, 0));

    //Climb right side
    this.platforms.push(new IcePlatform(world, 202, 5, 10, 10, 0));
    this.platforms.push(new IcePlatform(world, 202, -10, 10, 5, 0));
    this.platforms.push(new SnowPlatform(world, 202, -24, 10, 9, 0));
    this.platforms.push(new IcePlatform(world, 202, -43, 10, 10, 0));
    this.platforms.push(new SnowPlatform(world, 202, -58, 10, 5, 0));

    //Climb left side
    this.platforms.push(new IcePlatform(world, 180, -20, 8, 10, 0));
    this.platforms.push(new SnowPlatform(world, 178, -40, 6, 10, 0));
    this.platforms.push(new IcePlatform(world, 180, -60, 8, 10, 0));

    //Climb top
    this.platforms.push(new SnowPlatform(world, 190, -80, 22, 10, 0));

    this.camps.push(new Camp(world, 202, -64.5, 0));

    //Final run
    //ground
    this.platforms.push(new IcePlatform(world, 222, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 242, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 262, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 282, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 302, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 322, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 342, -58, 10, 5, 0));
    this.platforms.push(new IcePlatform(world, 362, -58, 10, 5, 0));

    this.platforms.push(new IcePlatform(world, 222, -80, 10, 10, 0));
    for (var i = 0; i < 35; i++) {
      if (i % 3 == 0) {
        this.platforms.push(new MovingSnowPlatform(world, 222 + (i * 4), -90, 2, 20, 0, {
          rangeX: 0, rangeY: 8, moveTime: 2
        }));

        if (i > 30) {
          this.platforms.push(new IceRockObstacle(world, 222 + (i * 4), -64, 1));
        }
        else if (i >= 15) {
          this.platforms.push(new IceRockObstacle(world, 222 + (i * 4), -63.5, 0.5));
        }
      } else {
        this.platforms.push(new SnowPlatform(world, 222 + (i * 4), -90, 2, 20, 0))
      }
    }

    this.platforms.push(new SandPlatform(world, 390, -58, 30, 5, 0));
    this.camps.push(new End(world, 390, -64.5, 0));
  }

  update() {
    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i].update();
    }
  }

  render(ctx) {
    for (let i = 0; i < this.platforms.length; i++) {
      this.platforms[i].render(ctx);
    }
    for (let i = 0; i < this.camps.length; i++) {
      this.camps[i].render(ctx);
    }
  }
}