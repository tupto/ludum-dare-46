import Obstacle from "./obstacle.js";

export default class IcePlatform extends Obstacle {
  constructor(world, x, y, r) {
    super(world, "ICE_ROCK", x, y, r, { });
  }
}