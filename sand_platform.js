import Platform from "./platform.js";

export default class SandPlatform extends Platform {
  constructor(world, x, y, w, h, rad) {
    super(world, "SAND", x, y, w, h, rad, false, { friction: 0.5 });
  }
}