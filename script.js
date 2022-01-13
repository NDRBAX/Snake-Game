window.onload = function() {
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let delay = 100;
    let snakee;
    let applee;
    let ctx;
    // Determine the variables so that they can be used by both functions
    let widthInBlocks = canvasWidth / blockSize;
    let heightInBlocks = canvasHeight / blockSize;
    // Convert pixels to block
    init();
    // Call the function to run the initialization of the game
    function init() {
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '30px black solid';
        canvas.style.margin = '50px auto';
        canvas.style.backgroundColor = '#ddd';
        canvas.style.display = 'block';

        document.body.appendChild(canvas);
        // Creation of the frame with the canvas method
        ctx = canvas.getContext('2d');
        // Define the context to be able to draw in the canvas
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4],
        ], 'right');
        applee = new Apple([10, 10]);
        refreshCanvas();
    } // Function that allows you to create the movement, initialize the canvas

    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            // GAME OVER
        } else {
            if (snakee.isEatingApple(applee)) {
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                    // The snake eat the apple
                } while (applee.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            setTimeout(refreshCanvas, delay);
        }
    } // Set a time limit after which the initialization will take place

    function drawBlock(ctx, position) {
        let x = position[0] * blockSize;
        let y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

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
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
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
            } // Configuration of travel rules for the snake
            if (allowedDirections.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            } //Allow to change direction if the travel rules are respected
        };

        this.checkCollision = function() {
            let wallCollision = false;
            let snakeCollision = false;
            let head = this.body[0];
            let rest = this.body.slice(1);
            let snakeX = head[0];
            var snakeY = head[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthInBlocks - 1;
            let maxY = heightInBlocks - 1;
            let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;

            for (let i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }
            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat) {
            let head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        }
    } // Creation of the snake prototype function

    function Apple(position) {
        this.position = position;

        this.draw = function() {
            ctx.save(); // Permet de sauvegarder les anciennes configurations... 
            ctx.fillStyle = '#72bf08'; // ...puis d'appliquer le nouveau style... 
            ctx.beginPath();
            let radius = blockSize / 2;
            let x = this.position[0] * blockSize + radius;
            let y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore(); // ...et enfin de restaurer les anciens paramètres. 
        };
        this.setNewPosition = function() {
            let newX = Math.round(Math.random() * (widthInBlocks - 1));
            let newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.positon = [newX, newY];
        }; // Random creation of a new apple each time the apple is eaten
        this.isOnSnake = function(snakeToCheck) {
            let isOnSnake = false;
            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if (this.positon[0] === snakeToCheck.body[i][0] && this.positon[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    } // Creation of the apple protoype function

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
    }; // Configure commands with key codes
}