var canvas = document.createElement("canvas");
canvas.width = 512;
canvas.height = 480;
document.appendChild(canvas);

var ctx = canvas.getContext("2d");

var pressedKeys = {};
canvas.addEventListener("keydown", (e) => {
  keyboard[e.charCode] = true;
}, false);
canvas.addEventListener("keyup", (e) => {
  delete keyboard[e.charCode];
}, false);

var mouse = { x: 0, y: 0, leftClickDown: false, rightClickDown: false }
canvas.addEventListener("mousemove", (e) => {
  let canvasBB = canvas.getBoundingClientRect();
  mouse.x = e.clientX - canvasBB.x;
  mouse.y = e.clientY - canvasBB.y;
}, false);
canvas.addEventListener("click", (e) => {
  mouse.leftClickDown = e.button === 0;
  mouse.rightClickDown = e.button === 2;
}, false);

var prevTime = Date.now();
/**
 * Main game loop
 */
function main() {
  var now = Date.now();
  var delta = now - prevTime;

  update(delta / 1000);
  render();

  prevTime = now;

  requestAnimationFrame(main);
}

/**
 * Update the game
 * @param {number} deltaTime 
 */
function update(deltaTime) {

}

/**
 * Render the game
 */
function render() {

}

/**
 * Load an image
 * @param {string} fileName 
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(fileName) {
  return new Promise((resolve, reject) => {
    var img = new Image();

    img.onload = (e) => { resolve(img); }
    img.onerror = (e) => { reject(e); }

    img.src = fileName;
  });
}

/**
 * Load a sound
 * @param {string} fileName 
 * @returns {Promise<HTMLAudioElement>}
 */
function loadSound(fileName) {
  return new Promise((resolve, reject) => {
    var audio = new Audio();
    audio.setAttribute("preload", "auto");
    audio.setAttribute("controls", "none");
    audio.style.display = "none";

    audio.onload = (e) => { resolve(audio); }
    audio.onerror = (e) => { reject(e); }

    audio.src = fileName;

    document.appendChild(audio);
  });
}