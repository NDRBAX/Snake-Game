window.onload = function() {
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var delay = 100;
    var snakee;
    var applee;
    var ctx;
    var soundGameOver;
    var soundEatApple;
    var soundSnakeRun;
    var timeOut;

    // Determine the variables so that they can be used by both functions
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    // Convert pixels to block
    init();
    // Call the function to run the initialization of the game
    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '30px hsl(235, 21%, 21%) solid';
        canvas.style.margin = '50px auto';
        canvas.style.display = 'block';
        canvas.style.backgroundColor = 'RosyBrown';
        document.body.appendChild(canvas);
        // Creation of the frame with the canvas method
        ctx = canvas.getContext('2d');
        // Define the context to be able to draw in the canvas
        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], 'right');
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    } // Function that allows you to create the movement, initialize the canvas

    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                    // The snake eat the apple
                } while (applee.isOnSnake(snakee));
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas, delay);
        }
    } // Set a time limit after which the initialization will take place

    function gameOver() {
        ctx.save();
        soundGameOver = new sound('sound-effect/game-over.mp3');
        ctx.font = 'bold 70px "Gloria Hallelujah"';
        ctx.fillStyle = 'hsl(235, 21%, 21%)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText('Game Over', centreX, centreY - 180);
        ctx.fillText('Game Over', centreX, centreY - 180);
        ctx.font = 'bold 30px "The Girl Next Door"';
        ctx.strokeText('Appuyer sur la touche Espace pour rejouer', centreX, centreY - 120);
        ctx.fillText('Appuyer sur la touche Espace pour rejouer', centreX, centreY - 120);
        ctx.restore();
    }

    function restart() {

        snakee = new Snake([
            [6, 4],
            [5, 4],
            [4, 4],
            [3, 4],
            [2, 4]
        ], 'right');
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    function drawScore() {
        ctx.save();
        ctx.font = 'bold 150px "Press Start 2P"';
        ctx.fillStyle = 'LightGrey';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = '#e50914';
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case 'left':
                    nextPosition[0] -= 1;
                    break;
                case 'right':
                    nextPosition[0] += 1;
                    break;
                case 'down':
                    nextPosition[1] += 1;
                    break;
                case 'up':
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw ('Invalid direction');
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };

        this.setDirection = function(newDirection) {
            var allowedDirections;
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
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;

            for (var i = 0; i < rest.length; i++) {
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }
            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appleToEat) {
            var head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                soundEatApple = new sound('sound-effect/retro-notification.mp3');
                return true;
            } else {
                return false
            }
        }
    } // Creation of the snake prototype function

    function Apple(position) {
        this.position = position;

        this.draw = function() {
            ctx.save(); // Permet de sauvegarder les anciennes configurations... 
            ctx.fillStyle = '#1db954'; // ...puis d'appliquer le nouveau style... 
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore(); // ...et enfin de restaurer les anciens paramètres. 
        };
        this.setNewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }; // Random creation of a new apple each time the apple is eaten
        this.isOnSnake = function(snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    } // Creation of the apple protoype function

    function sound(src) {
        this.sound = document.createElement('audio');
        this.sound.src = src;
        this.sound.setAttribute('preload', 'auto');
        this.sound.setAttribute('controls', 'none');
        this.sound.setAttribute('autoplay', 'true');
        this.sound.style.display = 'none';
        document.body.appendChild(this.sound);
        this.play = function() {
            this.sound.play();
        }
        this.stop = function() {
            this.sound.pause();
        }
    }

    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
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
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }; // Configure commands with key codes
}