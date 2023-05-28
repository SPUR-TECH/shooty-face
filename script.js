addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    let startingY, movingY;
    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                if (((e.key === 'ArrowUp') ||
                        (e.key === 'ArrowDown')
                    ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                }
                console.log(this.game.keys);
            });
            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                console.log(this.game.keys);
            });

            const fire = document.getElementById("shoot")
            fire.addEventListener("click", e => {
                e.preventDefault()
                this.game.player.shootTop();
            });
            const moveUp = document.getElementById("moveUp")
            window.addEventListener("touchstart", e => {
                startingY = e.touches[0].clientY;

            });

            window.addEventListener("touchmove", e => {
                movingY = e.touches[0].clientY;
            });

            window.addEventListener("touchend", e => {
                if (startingY + 1 < movingY) {
                    console.log('down')
                } else if (startingY - 1 > movingY) {
                    console.log('up')
                }
            });
        }
    }

    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 36.25;
            this.height = 20;
            this.speed = Math.random() * 0.2 + 2.8;
            this.markedForDeletion = false;
            this.image = document.getElementById('fireball');
            this.frameX = 0;
            this.maxFrame = 3;
            this.fps = 10;
            this.timer = 0;
            this.interval = 1000 / this.fps;
        }
        update(deltaTime) {
            this.x += this.speed;
            if (this.timer > this.interval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }

    class Particle {

    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.speedY = 0;
            this.maxSpeed = 4;
            this.projectiles = [];
            this.image = document.getElementById('player');
        }

        update() {
            if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;

            else if (startingY + 1 < movingY) this.speedY = this.maxSpeed;
            else if (startingY - 1 > movingY) this.speedY = -this.maxSpeed;

            else this.speedY = 0;
            this.y += this.speedY;

            // Handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

            // sprite animation
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        }

        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });
        }

        shootTop() {
            this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
            console.log(this.projectiles);
        }

    }

    class Enemy {

    }

    class Layer {

    }

    class background {

    }

    class UI {

    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.keys = [];
        }

        update() {
            this.player.update();
        }

        draw(context) {
            this.player.draw(context)
        }
    }

    const game = new Game(canvas.width, canvas.height);
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});