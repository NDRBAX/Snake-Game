window.onload = function() {
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let delay = 100;
    let snakee;
    let applee;
    let ctx;
    // Determine the variables so that they can be used by both functions

    init();
    // Call the function to run the initialization of the game

    function init() {
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '5px black solid';
        document.body.appendChild(canvas);
        // Creation of the frame with the canvas method
        ctx = canvas.getContext('2d');
        // Define the context to be able to draw in the canvas
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
        ], 'right');
        applee = new Apple([10, 10]);
        refreshCanvas();
    }
    // Function that allows you to create the movement, initialize the canvas

    function refreshCanvas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.advance();
        snakee.draw();
        applee.draw();
        setTimeout(refreshCanvas, delay);
    }
    // Set a time limit after which the initialization will take place

    function drawBlock(ctx, position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = '#0f056b';
            for (let i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            let nextPosition = this.body[0].slice();
            switch (this.direction) {
                case 'left':
                    nextPosition[0]--;
                    break;
                case 'right':
                    nextPosition[0]++;
                    break;
                case 'down':
                    nextPosition[1]++;
                    break;
                case 'up':
                    nextPosition[1]--;
                    break;
                default:
                    throw ('Invalid direction');
                    break;
            }
            this.body.unshift(nextPosition);
            this.body.pop();
        };

        this.setDirection = function(newDirection) {
            let allowedDirections;
            switch (this.direction) {
                case 'left':
                case 'right':
                    allowedDirections = ['up', 'down'];
                    break;
                case 'down':
                case 'up':
                    allowedDirections = ['left', 'right'];
                    break;
                default:
                    throw ('Invalid direction');
                    break;
                    // Configuration of travel rules for the snake
            }
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            } //Allow to change direction if the travel rules are respected
        };


    }
    // Creation of the snake prototype function

    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save(); // Permet de sauvegarder les anciennes configurations... 
            ctx.fillStyle = '#72bf08'; // ...puis d'appliquer le nouveau style... 
            ctx.beginPath();
            let radius = blockSize / 2;
            let x = position[0] * blockSize + radius;
            let y = position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore(); // ...et enfin de restaurer les anciens paramètres. 
        }
    }

    document.onkeydown = function handleKeyDown(e) {
            let key = e.keyCode;
            let newDirection;
            switch (key) {
                case 37:
                    newDirection = 'left';
                    break;
                case 38:
                    newDirection = 'up';
                    break;
                case 39:
                    newDirection = 'right';
                    break;
                case 40:
                    newDirection = 'down';
                    break;
                default:
                    return;
            }
            snakee.setDirection(newDirection);
        }
        // Configure commands with key codes
}