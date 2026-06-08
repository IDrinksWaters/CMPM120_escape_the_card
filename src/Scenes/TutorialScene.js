class TutorialScene extends Phaser.Scene {
    constructor() {
        super("tutorialScreen");

        this.my = { sprite: {}, text: {} };
        this.my.sprite.bullet = [];
        this.my.sprite.enemy = [];
        this.playerSpeed = 400;
        this.bulletSpeed = 800;
        this.lastFired = 0;
        this.fireRate = 200;

        this.tutorialStep = 0;
        this.moveGoalReached = false;
        this.shootGoalReached = false;
        this.enemiesDestroyed = 0;
        this.ENEMIES_TO_DESTROY = 3;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("Alice", "main_character.png");
        this.load.image("fire", "fire.png");
        this.load.image("card_clubs", "card_clubs_A.png");
        this.load.image("bg", "garden_background.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let w = this.game.config.width;
        let h = this.game.config.height;
        let my = this.my;

        this.bg = this.add.tileSprite(0, 0, w, h, "bg").setOrigin(0, 0);
        this.add.rectangle(0, 0, w, h, 0x000000, 0.4).setOrigin(0, 0);

        my.sprite.Alice = this.add.sprite(w / 2, h - 40, "Alice");
        my.sprite.Alice.setScale(0.040);

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.zKey = this.input.keyboard.addKey("Z");
        this.qKey = this.input.keyboard.addKey("Q");

        this.instructionText = this.add.bitmapText(w / 2, h * 0.15, "rocketSquare", "")
            .setOrigin(0.5).setCenterAlign().setMaxWidth(500).setScale(0.9);

        this.stepText = this.add.bitmapText(w / 2, h * 0.08, "rocketSquare", "")
            .setOrigin(0.5).setScale(0.7);

        this.add.bitmapText(w / 2, h - 30, "rocketSquare", "Press Q to return to Title")
            .setOrigin(0.5).setScale(0.6).setTint(0xaaaaaa);

        this.tutorialStep = 0;
        this.moveGoalReached = false;
        this.shootGoalReached = false;
        this.enemiesDestroyed = 0;
        this.my.sprite.bullet = [];
        this.my.sprite.enemy = [];

        this.showStep(0);
    }

    showStep(step) {
        this.tutorialStep = step;
        let w = this.game.config.width;
        let h = this.game.config.height;

        if (step === 0) {
            this.stepText.setText("Step 1: Movement");
            this.instructionText.setText(
                "Use ARROW KEYS to move.\n" +
                "Try moving in all 4 directions!"
            );
            this.moveGoalReached = false;
            this.moveProgress = { left: false, right: false, up: false, down: false };
            this.progressText = this.add.bitmapText(w / 2, h * 0.25, "rocketSquare", "")
                .setOrigin(0.5).setScale(0.7).setTint(0x00ff00);
        } else if (step === 1) {
            this.stepText.setText("Step 2: Shooting");
            this.instructionText.setText(
                "Press Z to fire!\n" +
                "Your bullets fly upward.\n" +
                "Try shooting now!"
            );
            this.shootGoalReached = false;
            if (this.progressText) this.progressText.destroy();
        } else if (step === 2) {
            this.stepText.setText("Step 3: Destroy Enemies");
            this.instructionText.setText(
                "Enemies will appear!\n" +
                "Destroy " + this.ENEMIES_TO_DESTROY + " enemies to complete the tutorial."
            );
            if (this.progressText) this.progressText.destroy();
            this.startSpawningEnemies();
        } else if (step === 3) {
            this.stepText.setText("Tutorial Complete!");
            this.instructionText.setText(
                "You've learned the basics!\n\n" +
                "Arrow Keys: Move\n" +
                "Z: Fire\n" +
                "SHIFT: Slow down\n" +
                "X: Ultimate (when charged)\n\n" +
                "Press Q to return to Title."
            );
            if (this.progressText) this.progressText.destroy();
        }
    }

    startSpawningEnemies() {
        this.spawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnTutorialEnemy,
            callbackScope: this,
            loop: true
        });
    }

    spawnTutorialEnemy() {
        if (this.enemiesDestroyed >= this.ENEMIES_TO_DESTROY) return;
        let w = this.game.config.width;
        let enemy = this.add.sprite(Math.random() * (w - 60) + 30, -20, "card_clubs");
        enemy.setScale(0.5);
        enemy.type = "clubs";
        enemy.hp = 1;
        enemy.maxHp = 1;
        enemy.scorePoints = 0;
        enemy.speedY = 150;
        this.my.sprite.enemy.push(enemy);
    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;
        let w = this.game.config.width;
        let h = this.game.config.height;

        if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
            this.scene.start("titleScreen");
            return;
        }

        this.bg.tilePositionY -= 1;

        // Movement
        if (this.left.isDown) {
            if (my.sprite.Alice.x > my.sprite.Alice.displayWidth / 2) {
                my.sprite.Alice.x -= this.playerSpeed * dt;
            }
            if (this.tutorialStep === 0 && !this.moveProgress.left) {
                this.moveProgress.left = true;
                this.checkMoveComplete();
            }
        }
        if (this.right.isDown) {
            if (my.sprite.Alice.x < w - my.sprite.Alice.displayWidth / 2) {
                my.sprite.Alice.x += this.playerSpeed * dt;
            }
            if (this.tutorialStep === 0 && !this.moveProgress.right) {
                this.moveProgress.right = true;
                this.checkMoveComplete();
            }
        }
        if (this.up.isDown) {
            if (my.sprite.Alice.y > my.sprite.Alice.displayHeight / 2) {
                my.sprite.Alice.y -= this.playerSpeed * dt;
            }
            if (this.tutorialStep === 0 && !this.moveProgress.up) {
                this.moveProgress.up = true;
                this.checkMoveComplete();
            }
        }
        if (this.down.isDown) {
            if (my.sprite.Alice.y < h - my.sprite.Alice.displayHeight / 2) {
                my.sprite.Alice.y += this.playerSpeed * dt;
            }
            if (this.tutorialStep === 0 && !this.moveProgress.down) {
                this.moveProgress.down = true;
                this.checkMoveComplete();
            }
        }

        // Shooting
        if (this.zKey.isDown && this.tutorialStep >= 1) {
            let now = this.time.now;
            if (now > this.lastFired + this.fireRate) {
                let bx = my.sprite.Alice.x;
                let by = my.sprite.Alice.y - my.sprite.Alice.displayHeight / 2;
                let bullet = this.add.sprite(bx, by, "fire");
                this.my.sprite.bullet.push(bullet);
                this.lastFired = now;

                if (this.tutorialStep === 1 && !this.shootGoalReached) {
                    this.shootGoalReached = true;
                    this.time.delayedCall(500, () => {
                        this.showStep(2);
                    });
                }
            }
        }

        // Move bullets
        my.sprite.bullet = my.sprite.bullet.filter(bullet => bullet.y > -(bullet.displayHeight / 2));
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }

        // Move enemies
        for (let i = my.sprite.enemy.length - 1; i >= 0; i--) {
            let enemy = my.sprite.enemy[i];
            if (enemy.dead) continue;
            enemy.y += enemy.speedY * dt;
            if (enemy.y > h + enemy.displayHeight) {
                enemy.y = -20;
                enemy.x = Math.random() * (w - 60) + 30;
            }
        }

        // Bullet-enemy collision
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemy) {
                if (enemy.dead) continue;
                if (this.collides(bullet, enemy)) {
                    enemy.hp -= 1;
                    bullet.y = -100;

                    if (enemy.hp <= 0 && !enemy.dead) {
                        enemy.dead = true;
                        enemy.destroy();
                        this.enemiesDestroyed++;
                        this.checkEnemiesComplete();
                    }
                    break;
                }
            }
        }

        my.sprite.enemy = my.sprite.enemy.filter(e => !e.dead);
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }

    checkMoveComplete() {
        let p = this.moveProgress;
        let done = p.left && p.right && p.up && p.down;
        let parts = [];
        if (p.left) parts.push("Left: OK"); else parts.push("Left: ...");
        if (p.right) parts.push("Right: OK"); else parts.push("Right: ...");
        if (p.up) parts.push("Up: OK"); else parts.push("Up: ...");
        if (p.down) parts.push("Down: OK"); else parts.push("Down: ...");
        this.progressText.setText(parts.join("  "));

        if (done && !this.moveGoalReached) {
            this.moveGoalReached = true;
            this.time.delayedCall(800, () => {
                this.showStep(1);
            });
        }
    }

    checkEnemiesComplete() {
        if (this.enemiesDestroyed >= this.ENEMIES_TO_DESTROY && this.tutorialStep === 2) {
            if (this.spawnTimer) this.spawnTimer.remove();
            this.time.delayedCall(500, () => {
                this.showStep(3);
            });
        }
    }
}
