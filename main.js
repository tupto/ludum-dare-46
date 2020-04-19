import Game from "./game.js";

var canvas = document.createElement("canvas");
canvas.width = 1000;
canvas.height = 480;
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);
window.AudioContext = window.AudioContext||window.webkitAudioContext;

var ctx = canvas.getContext("2d");
var game = new Game(ctx);

var prevTime = Date.now();

window.pressedKeys = {};
addEventListener("keydown", (e) => {
  window.pressedKeys[e.keyCode] = true;
}, false);
addEventListener("keyup", (e) => {
  delete window.pressedKeys[e.keyCode];
}, false);

window.mouse = { x: 0, y: 0, leftClickDown: false, rightClickDown: false }
canvas.addEventListener("mousemove", (e) => {
  let canvasBB = canvas.getBoundingClientRect();
  window.mouse.x = e.clientX - canvasBB.x;
  window.mouse.y = e.clientY - canvasBB.y;
}, false);
canvas.addEventListener("click", (e) => {
  e.preventDefault();
  window.mouse.leftClickDown = e.button === 0;
  window.mouse.rightClickDown = e.button === 2;
}, false);

function init() {
  game.init();
}

/**
 * Main game loop
 */
function main() {
  var now = Date.now();
  var delta = now - prevTime;

  update(delta / 1000);
  render();

  prevTime = now;
}

/**
 * Update the game
 * @param {number} deltaTime 
 */
function update(deltaTime) {
  game.update(deltaTime);
}

/**
 * Render the game
 */
function render() {
  game.render();
}

init();
window.setInterval((main), 1000 / 60);