import Platform from "./platform.js";

export default class IcePlatform extends Platform {
  constructor(world, x, y, w, h, rad) {
    super(world, "ICE", x, y, w, h, rad, false, { friction: 0.05 });
  }
}