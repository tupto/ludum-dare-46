
export default class Camera {
  constructor(world, focusBody, ctx) {
    this.world = world;
    this.focusBody = focusBody;
    this.viewport = {};
  }

  createViewport(ctx) {
    this.viewport.width = ctx.canvas.width;
    this.viewport.height = ctx.canvas.height;
    this.viewport.left = (this.focusBody.GetPosition().x * 30) - (this.viewport.width / 2.0);
    this.viewport.top = (this.focusBody.GetPosition().y * 30) - (this.viewport.height / 2.0);
    if (this.viewport.left < 0) {
      this.viewport.left = 0;
    }
    if (this.viewport.top > 0) {
      this.viewport.top = 0;
    }
    this.viewport.right = this.viewport.left + this.viewport.width;
    this.viewport.bottom = this.viewport.top + this.viewport.height;
  }

  clearCtx(ctx) {
    ctx.clearRect(Math.floor(this.viewport.left) - 10, Math.floor(this.viewport.top) - 10,
    Math.ceil(this.viewport.width) + 20, Math.ceil(this.viewport.height) + 20);
    ctx.fillStyle = "blue";
    ctx.fillRect(Math.floor(this.viewport.left) - 10, Math.floor(this.viewport.top) - 10,
      Math.ceil(this.viewport.width) + 20, Math.ceil(this.viewport.height) + 20);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  transformCtx(ctx) {
    ctx.resetTransform();
    ctx.translate(
      -this.viewport.left, -this.viewport.top
    );
  }
}