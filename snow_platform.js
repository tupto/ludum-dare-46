import Platform from "./platform.js";

export default class SnowPlatform extends Platform {
  constructor(world, x, y, w, h, rad) {
    super(world, "SNOW", x, y, w, h, rad, false, { friction: 0.999 }, false, window.fixtureUserData["SNOW"]);
  }
}