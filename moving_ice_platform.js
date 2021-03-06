import Platform from "./platform.js";

export default class MovingSnowPlatform extends Platform {
  constructor(world, x, y, w, h, rad, kinematicOptions) {
    super(world, "ICE", x, y, w, h, rad, false, { friction: 0.05 }, false, window.fixtureUserData["SNOW"], kinematicOptions);
  }
}