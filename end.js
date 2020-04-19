import Platform from "./platform.js";

export default class End extends Platform {
  constructor(world, x, y, rad) {
    super(world, "END", x, y, 2.5 * 2, 2, rad, false, { }, true, window.fixtureUserData["END"], null, "NO_COLLISION");
  }
}