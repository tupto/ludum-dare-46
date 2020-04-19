/**
 * 
 * @param {CanvasRenderingContext2D} context 
 * @param {HTMLImageElement|CanvasPattern} image 
 * @param {number} rads 
 * @param {number} x 
 * @param {number} y 
 * @param {number} axisX 
 * @param {number} axisY 
 */
export function rotateAndDrawImage ( context, image, rads , x, y, axisX, axisY, width = null, height = null) {
  context.translate(x, y);
  context.rotate(rads);
  if (image instanceof CanvasPattern) {
    context.fillStyle = image;
    context.fillRect(200, 200, width, height);
  } else {
    context.drawImage(image, -axisX, -axisY, width, height);
  }
  context.rotate(-rads);
  context.translate(-x, -y);
}

/**
 * Load an image
 * @param {string} fileName 
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(fileName) {
  return new Promise((resolve, reject) => {
    var img = new Image();

    img.onload = (e) => { resolve(img); }
    img.onerror = (e) => { throw(e); }

    img.src = fileName;
  });
}

/**
 * Load a sound
 * @param {string} fileName 
 * @returns {Promise<HTMLAudioElement>}
 */
export function loadSound(fileName) {
  return new Promise((resolve, reject) => {
    console.log("loading " + fileName);
    var audio = new Audio();
    audio.setAttribute("preload", "auto");
    //audio.setAttribute("controls", "none");
    //audio.style.display = "none";

    audio.onload = (e) => { resolve(audio); };
    audio.onerror = (e) => { reject(e); }

    audio.src = fileName;

    document.body.appendChild(audio);
  });
}