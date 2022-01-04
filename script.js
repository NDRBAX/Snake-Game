window.onload = function() {
    let canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 600;
    canvas.style.border = '1px solid';
    document.body.appendChild(canvas);
    // Creation of the frame with the canvas method
    let ctx = canvas.getContext('2D');
    // Define the context to be able to draw in the canvas
    ctx.fillStyle = '#ff0000';
    // Choice of the color with which I will draw
    ctx.fillRect(30, 30, 100, 50);
}