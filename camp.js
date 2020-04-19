import Platform from "./platform.js";

export default class Camp extends Platform {
  constructor(world, x, y, rad) {
    super(world, "CAMP", x, y, 2.5 * 2, 2, rad, false, { }, true, window.fixtureUserData["CAMP"], null, "NO_COLLISION");
  }
}