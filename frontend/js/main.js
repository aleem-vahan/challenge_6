
var socket = io("http://localhost:5000");
socket.on('connect', () => {
    console.log('Connected to server.');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server.');
});

// Get the canvas element and context
// var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Define the Hero class
class Hero {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.draw = this.draw.bind(this)
        this.contains = this.contains.bind(this)
        this.intersects = this.intersects.bind(this)
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
    }

    contains(x, y) {
        var dx = this.x - x;
        var dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    intersects(other) {
        const distanceX = (other.x + other.width / 2) - (this.x + this.radius);
        const distanceY = (other.y + other.height / 2) - (this.y + this.radius);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        return distance < this.radius + Math.min(other.width, other.height) / 2;
    }
}

// Define the Minion class
class Minion {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = Math.random() * 30 + 20;
        this.height = Math.random() * 30 + 20;
        this.speed = speed;
        this.color = '#f00';
        this.draw = this.draw.bind(this)
        this.update = this.update.bind(this)
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
            this.speed = Math.random() * 2 + 1;
        }
    }
}

// Create the hero
var hero = new Hero(canvas.width / 2, canvas.height / 2, 20, '#0f0');

// Create an array to store the minions
var minions = [];

// Set up the game over flag
var isGameOver = false;

// Define the animate function
function animate() {
    if (isGameOver) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the hero
    hero.draw();

    // Draw the minions
    minions.forEach(function (minion) {
        minion.draw();
        minion.update();
    });

    // Request the next frame of animation
    requestAnimationFrame(animate);
}

// Spawn minions at random intervals
setInterval(function () {
    if (isGameOver) return;

    // Generate a random position and speed for the minion
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    // var speed = Math.random() * 2 + 1;
    var speed =  0.1;

    // Create a new minion and add it to the array
    var minion = new Minion(x, y, speed);
    minions.push(minion);
}, 10000);

// Handle hero dragging
var isDragging = false;
var offset = { x: 0, y: 0 };

canvas.addEventListener('mousedown', function (event) {
    if (isGameOver) return;

    var mouseX = event.clientX - canvas.offsetLeft;
    var mouseY = event.clientY - canvas.offsetTop;

    if (hero.contains(mouseX, mouseY)) {
        isDragging = true;
        offset.x = hero.x - mouseX;
        offset.y = hero.y - mouseY;
    }
});

canvas.addEventListener('mousemove', function (event) {
    if (isGameOver) return;

    if (isDragging) {
        hero.x = event.clientX - canvas.offsetLeft + offset.x;
        hero.y = event.clientY - canvas.offsetTop + offset.y;
    }
});

canvas.addEventListener('mouseup', function (event) {
    isDragging = false;
});

// Check for collisions between hero and minions
function checkCollisions() {
    minions.forEach(function (minion) {
        if (hero.intersects(minion)) {
            console.log(true)
            gameOver();
        }
    });
}

// End the game
function gameOver() {
    isGameOver = true;

    // Draw the game over screen
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#fff';
    context.font = '48px Arial';
    context.textAlign = 'center';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 50);

    // Add the replay button
    var button = document.createElement('button');
    button.textContent = 'Replay';
    button.style.position = 'absolute';
    button.style.left = (canvas.offsetLeft + canvas.width / 2 - 50) + 'px';
    button.style.top = (canvas.offsetTop + canvas.height / 2 + 50) + 'px';
    button.addEventListener('click', function () {
        location.reload();
    });
    document.body.appendChild(button);
}

// Start the game
animate();

// Check for collisions every 10 milliseconds
setInterval(checkCollisions, 10);