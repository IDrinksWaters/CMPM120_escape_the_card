class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];
        this.my.sprite.trackingBullet = [];
        this.maxBullets = 10;
        this.my.sprite.enemy = [];

        this.myScore = 0;

        // === LIVES SYSTEM (TWEAKABLE) ===
        this.lives = 10;
        this.isGameOver = false;
        this.isGameWon = false;
        this.isRespawning = false;
        this.gameFrozen = false;
        this.invincible = false;
        this.lastHitX = 0;
        this.lastHitY = 0;
        this.FREEZE_DURATION = 2000;
        this.RESPAWN_FADE_DURATION = 1000;
        this.POST_RESPAWN_INVINCIBILITY = 1500;

        this.lastFired = 0;
        this.fireRate = 200;

        this.my.sprite.enemyBullet = [];
        this.heartsLastShot = 0;
        this.heartsFireRate = 1200;

        this.spadesUnlocked = false;
        this.heartsUnlocked = false;
        this.diamondsUnlocked = false;

        this.lastClubSpawn = 0;
        this.clubSpawnRate = 1000;

        this.lastSpadeSpawn = 0;
        this.spadeSpawnRate = 1800;

        this.lastHeartSpawn = 0;
        this.heartSpawnRate = 2200;

        this.lastDiamondSpawn = 0;
        this.diamondSpawnRate = 3000;

        // === ENEMY HEALTH (TWEAKABLE) ===
        // All HP values multiplied by 3 from original
        this.ENEMY_HP_CLUBS = 3;               // Original 1 * 3
        this.ENEMY_HP_SPADES = 6;              // Original 2 * 3
        this.ENEMY_HP_HEARTS = 9;              // Original 3 * 3
        this.ENEMY_HP_DIAMONDS = 15;           // Original 5 * 3

        // === ELITE JACK ENEMY (TWEAKABLE) ===
        this.ENEMY_HP_JACK = 70;               // Jack HP — tweak here
        this.JACK_SPAWN_INTERVAL = 30000;
        this.JACK_MOVE_DISTANCE = 0.25;
        this.JACK_SPEED = 450;                  // 150 * 3 (200% faster) — tweak here
        this.JACK_FIRE_RATE = 1500;
        this.JACK_BULLET_SPEED = 220;
        this.JACK_BULLET_COUNT = 4;
        this.jacksSpawned = false;
        this.jackKills = 0;
        this.JACK_COUNT = 2;
        this.jacksDefeatedTime = 0;

        // === ELITE QUEEN ENEMY (TWEAKABLE) ===
        this.ENEMY_HP_QUEEN = 500;            // Queen HP — tweak here
        this.QUEEN_SPAWN_DELAY = 30000;
        this.QUEEN_MOVE_DISTANCE = 0.4;
        this.QUEEN_SPEED = 450;                // 150 * 3 (200% faster) — tweak here
        this.QUEEN_SPIN_SPEED = 3;
        this.QUEEN_FIRE_RATE = 10;
        this.queenSpawned = false;
        this.queenDefeatedTime = 0;

        // === ELITE KING ENEMY (TWEAKABLE) ===
        // King spawns 30s after Queen is defeated.
        // Moves to 2/5 from top, shoots 8-bullet fan at player every 2s.
        // Spawns 4 jacks on arrival (2 left, 2 right) and every 10s after.
        this.ENEMY_HP_KING = 500;              // King HP — tweak here
        this.KING_SPAWN_DELAY = 30000;
        this.KING_MOVE_DISTANCE = 0.25;        // 2/5 from top
        this.KING_SPEED = 450;                  // 150 * 3 (200% faster) — tweak here
        this.KING_FIRE_RATE = 500;           // 8-bullet fan every 2s — tweak here
        this.KING_BULLET_COUNT = 8;           // Bullets per fan — tweak here
        this.KING_BULLET_SPEED = 250;         // Speed of King's bullets — tweak here
        this.KING_JACK_RESPAWN_INTERVAL = 10000; // Respawn jacks every 10s — tweak here
        this.KING_JACK_COUNT = 4;             // Number of jacks per wave — tweak here
        this.kingSpawned = false;
        this.kingDefeatedTime = 0;

        // === PLAYER DAMAGE (TWEAKABLE) ===
        this.playerDamage = 1;
        // Attack speed bar no longer increases damage

        // === PLAYER HITBOX (TWEAKABLE) ===
        this.PLAYER_HITBOX_SCALE = 0.2;

        // === ATTACK PATTERN TIERS (TWEAKABLE) ===
        this.BIG_FLAME_OFFSET = 12;
        this.TRACKING_SIDE_OFFSET = 20;
        this.TRACKING_BULLET_SPEED = 500;
        this.SMALL_FLAME_SCALE = 0.5;         // Half of big flame's default scale
        this.SMALL_FLAME_DAMAGE_RATIO = 0.3;   // Small flame = 30% of big flame damage — tweak here
        this.EXPLOSION_RADIUS = 40;

        // === DROP SYSTEM (TWEAKABLE) ===
        this.my.sprite.drops = [];
        this.ENERGY_POINT_CHANCE = 0.80;
        this.ATTACK_SPEED_POINT_CHANCE = 0.10;
        this.DROP_SPEED = 150;
        this.DROP_PICKUP_RANGE = 1.5;
        this.DROP_MAGNET_RANGE = 150;
        this.DROP_MAGNET_SPEED = 500;

        // === PROGRESS BARS (TWEAKABLE) ===
        this.energyPointCount = 0;
        this.ULTIMATE_MAX = 100;
        // === ULTIMATE SYSTEM ===
        this.ultimateActive = false;
        this.ultimateTimer = 0;
        this.ultimateLaserParts = [];
        this.ultimateFireRingBullets = [];
        this.ultimateLaserDamageTimer = 0;

        this.ULTIMATE_DURATION = 5000;
        this.ULTIMATE_BURST_DAMAGE = 50;

        this.ULTIMATE_LASER_DAMAGE_PER_TICK = 2;
        this.ULTIMATE_LASER_TICK = 20; // 0.02 second

        this.ULTIMATE_LASER_WIDTH_MULTIPLIER = 3;
        this.ULTIMATE_LASER_FIRE_SPACING = 20;
        this.ULTIMATE_LASER_SPIN_SPEED = 8;
        this.ULTIMATE_FIRE_RING_SPEED = 700;

        // 3D spiral laser settings
        this.ULTIMATE_LASER_FIRE_SPACING = 14;
        this.ULTIMATE_LASER_SPIN_SPEED = 7;

        this.ULTIMATE_LASER_STRANDS = 5;
        this.ULTIMATE_LASER_RADIUS = 32;
        this.ULTIMATE_LASER_WAVE_LENGTH = 50;
        this.ULTIMATE_LASER_CORE_SCALE = 0.38;
        this.ULTIMATE_LASER_START_OFFSET = 45;

        this.attackSpeedEnergy = 0;
        this.ATTACK_SPEED_BAR_MAX = 100;
        this.ATTACK_SPEED_PER_10_POINTS = 0.10;

        // === ATTACK SPEED POINT BONUS (TWEAKABLE) ===
        this.attackSpeedPointCount = 0;
        this.ATTACK_SPEED_POINT_BONUS = 0.05;

        // === ATTACK DAMAGE POINT (PLACEHOLDER) ===
        this.attackDamagePointCount = 0;

        // === JOKER BOSS (TWEAKABLE) ===
        this.jokerBoss = null;
        this.jokerSpawned = false;
        this.JOKER_SPAWN_DELAY = 30000;
        this.JOKER_SCORE_POINTS = 300;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("Alice", "main_character.png");
        this.load.image("fire", "fire.png");
        this.load.image("card_hearts", "card_hearts_A.png");
        this.load.image("card_clubs", "card_clubs_A.png");
        this.load.image("card_diamonds", "card_diamonds_A.png");
        this.load.image("card_spades", "card_spades_A.png");
        this.load.image("enemyBullet_hearts", "card_hearts_suit.png");
        this.load.image("enemyBullet_diamonds", "card_diamonds_suit.png");
        this.load.image("bg", "garden_background.png");

        // === ELITE ENEMY ASSETS (from Kenney Playing Cards Pack) ===
        this.load.image("card_jack", "card_hearts_J.png");
        this.load.image("card_queen", "card_diamonds_Q.png");
        this.load.image("card_king", "card_diamonds_K.png");
        this.load.image("queenBullet", "card_clubs_suit.png");

        // === DROP SYSTEM ASSETS ===
        this.load.image("pointDrop", "card_back.png");

        this.load.image("card_joker_red_asset", "card_joker_red.png");
        this.load.image("card_joker_black_asset", "card_joker_black.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("hitSound", "impactMetal_light_000.ogg");
        this.load.audio("backgroundMusic", "上海アリス幻樂団 - 世界は可愛く出来ている.mp3");
    }

    shootAtPlayer(enemy) {
        let my = this.my;
        let dx = my.sprite.Alice.x - enemy.x;
        let dy = my.sprite.Alice.y - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) { dx /= dist; dy /= dist; }
        let bullet = this.add.sprite(enemy.x, enemy.y, "enemyBullet_hearts");
        bullet.setScale(0.5);
        bullet.speed = 180;
        bullet.dirX = dx;
        bullet.dirY = dy;
        my.sprite.enemyBullet.push(bullet);
    }

    shootSpread(enemy) {
        let my = this.my;
        let directions = [
            { x: -0.5, y: 1 },
            { x: 0, y: 1 },
            { x: 0.5, y: 1 }
        ];
        for (let dir of directions) {
            let bullet = this.add.sprite(enemy.x, enemy.y, "enemyBullet_diamonds");
            bullet.setScale(0.5);
            bullet.speed = 200;
            let dist = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
            bullet.dirX = dir.x / dist;
            bullet.dirY = dir.y / dist;
            my.sprite.enemyBullet.push(bullet);
        }
    }

    shootJackVolley(enemy) {
        let my = this.my;
        let count = this.JACK_BULLET_COUNT;
        for (let i = 0; i < count; i++) {
            let angle = (-Math.PI / 3) + (i / (count - 1)) * (2 * Math.PI / 3);
            let dirX = Math.sin(angle);
            let dirY = Math.cos(angle);
            let bullet = this.add.sprite(enemy.x, enemy.y, "enemyBullet_hearts");
            bullet.setScale(0.5);
            bullet.speed = this.JACK_BULLET_SPEED;
            bullet.dirX = dirX;
            bullet.dirY = dirY;
            my.sprite.enemyBullet.push(bullet);
        }
    }

    shootQueenBullet(enemy) {
        let my = this.my;
        let angle = Math.random() * Math.PI * 2;
        let dirX = Math.cos(angle);
        let dirY = Math.sin(angle);
        let maxSpeed = this.JACK_BULLET_SPEED;
        let speed = Math.random() * maxSpeed + maxSpeed * 0.5;
        let bullet = this.add.sprite(enemy.x, enemy.y, "queenBullet");
        bullet.setScale(0.5);
        bullet.setTint(0xcc44ff);
        bullet.speed = speed;
        bullet.dirX = dirX;
        bullet.dirY = dirY;
        my.sprite.enemyBullet.push(bullet);
    }

    // === KING ELITE SHOOTING PATTERN ===
    // Alternates between 7 and 8 bullets in a fan aimed at the player
    shootKingFan(enemy) {
        let my = this.my;
        // Alternating bullet count: starts at 7, then 8, then 7, etc.
        let count = enemy.fanToggle === 0 ? 7 : 8;
        enemy.fanToggle = enemy.fanToggle === 0 ? 1 : 0;
        let spreadAngle = Math.PI * 2 / 3; // 120° fan arc — tweak here

        // Direction to player
        let dx = my.sprite.Alice.x - enemy.x;
        let dy = my.sprite.Alice.y - enemy.y;
        let baseAngle = Math.atan2(dy, dx);

        for (let i = 0; i < count; i++) {
            let angle = baseAngle - spreadAngle / 2 + (i / (count - 1)) * spreadAngle;
            let dirX = Math.cos(angle);
            let dirY = Math.sin(angle);

            let bullet = this.add.sprite(enemy.x, enemy.y, "enemyBullet_hearts");
            bullet.setScale(0.5);
            bullet.setTint(0xff4444); // Red tint for King bullets — tweak here
            bullet.speed = this.KING_BULLET_SPEED;
            bullet.dirX = dirX;
            bullet.dirY = dirY;
            my.sprite.enemyBullet.push(bullet);
        }
    }

    isEliteOnScreen() {
        for (let enemy of this.my.sprite.enemy) {
            if ((enemy.type === "jack" || enemy.type === "queen" || enemy.type === "king" || enemy.type === "joker") && enemy.visible && !enemy.dead) {
                return true;
            }
        }
        return false;
    }

    getBarPercent() {
        return this.attackSpeedEnergy / this.ATTACK_SPEED_BAR_MAX;
    }

    create() {
        let my = this.my;

        this.bg = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg").setOrigin(0, 0);
        this.darkOverlay = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000, 0.6).setOrigin(0, 0);

        my.sprite.Alice = this.add.sprite(game.config.width/2, game.config.height - 40, "Alice");
        my.sprite.Alice.setScale(0.040);

        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,
            repeat: 5,
            hideOnComplete: true
        });

        this.hitSound = this.sound.add("hitSound");

        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.z = this.input.keyboard.addKey("Z");
        this.shift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.x = this.input.keyboard.addKey("X");

        // === DEBUG SPAWN KEYS ===
        this.jKey = this.input.keyboard.addKey("J");
        this.qKey = this.input.keyboard.addKey("Q");
        this.kKey = this.input.keyboard.addKey("K");
        this.mKey = this.input.keyboard.addKey("M");
        this.bKey = this.input.keyboard.addKey("B");

        this.playerSpeed = 400;
        this.bulletSpeed = 800;

        document.getElementById('description').innerHTML = '<h2>Escape the Card Game!</h2><br>LEFT: left // RIGHT: right // UP: up // DOWN: down // Z: fire/emit // X: ultimate // SHIFT: slow down // R: restart<br>DEBUG: J: Jack // Q: Queen // K: King // M: Joker';

        my.text.score = this.add.bitmapText(350, 0, "rocketSquare", "Score " + this.myScore);
        my.text.lives = this.add.bitmapText(430, 20, "rocketSquare", "Lives " + this.lives);

        this.add.text(10, 5, "Escape from Card Game!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: { width: 60 }
        });

        let barY = game.config.height - 60;
        this.add.bitmapText(10, barY - 30, "rocketSquare", "Ultimate").setDepth(3);
        this.ultimateBarBg = this.add.rectangle(10, barY, 160, 14, 0x333333).setOrigin(0, 0).setDepth(1);
        this.ultimateBarFill = this.add.rectangle(12, barY + 2, 0, 10, 0x6666ff).setOrigin(0, 0).setDepth(2);

        let barY2 = game.config.height - 20;
        this.add.bitmapText(10, barY2 - 30, "rocketSquare", "Atk Spd").setDepth(3);
        this.attackSpeedBarBg = this.add.rectangle(10, barY2, 160, 14, 0x333333).setOrigin(0, 0).setDepth(1);
        this.attackSpeedBarFill = this.add.rectangle(12, barY2 + 2, 0, 10, 0x00cc00).setOrigin(0, 0).setDepth(2);

        this.gameStartTime = this.time.now;

        this.bgm = this.sound.add("backgroundMusic", { loop: true, volume: 0.2 });
        this.bgm.play();
    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        if ((this.isGameOver || this.isGameWon) && Phaser.Input.Keyboard.JustDown(this.r)) {
            this.restartGame();
            return;
        }

        if (this.isGameOver || this.isGameWon) return;
        if (this.gameFrozen) return;

        // === DEBUG SPAWN KEYS ===
        if (Phaser.Input.Keyboard.JustDown(this.jKey)) { this.spawnJacks(); }
        if (Phaser.Input.Keyboard.JustDown(this.qKey)) { this.spawnQueen(); }
        if (Phaser.Input.Keyboard.JustDown(this.kKey)) { this.spawnKing(); }
        if (Phaser.Input.Keyboard.JustDown(this.mKey)) { this.spawnJoker(); }
        if (Phaser.Input.Keyboard.JustDown(this.bKey)) {
            this.energyPointCount = this.ULTIMATE_MAX;
            this.attackSpeedEnergy = this.ATTACK_SPEED_BAR_MAX;
            this.attackSpeedPointCount = 0;
            this.updateProgressBars();
        }

        this.bg.tilePositionY -= 2;

        // === BASIC SPAWNS — BLOCKED WHEN ELITE IS ON SCREEN ===
        if (!this.isEliteOnScreen() && !this.isJokerFightActive()) {
            if (this.time.now > this.lastClubSpawn + this.clubSpawnRate) {
                this.spawnClubs();
                this.lastClubSpawn = this.time.now;
            }
            if (this.myScore >= 200 && this.time.now > this.lastSpadeSpawn + this.spadeSpawnRate) {
                this.spawnSpades();
                this.lastSpadeSpawn = this.time.now;
            }
            if (this.myScore >= 500 && this.time.now > this.lastHeartSpawn + this.heartSpawnRate) {
                this.spawnHearts();
                this.lastHeartSpawn = this.time.now;
            }
            if (this.myScore >= 1000 && this.time.now > this.lastDiamondSpawn + this.diamondSpawnRate) {
                this.spawnDiamonds();
                this.lastDiamondSpawn = this.time.now;
            }
        }

        // === ELITE JACK SPAWN CHECK (ONE-TIME) ===
        if (!this.jacksSpawned && this.time.now > this.gameStartTime + this.JACK_SPAWN_INTERVAL) {
            this.spawnJacks();
            this.jacksSpawned = true;
        }

        // === ELITE QUEEN SPAWN CHECK ===
        if (this.jacksDefeatedTime > 0 && !this.queenSpawned && this.time.now > this.jacksDefeatedTime + this.QUEEN_SPAWN_DELAY) {
            this.spawnQueen();
            this.queenSpawned = true;
        }

        // === ELITE KING SPAWN CHECK ===
        if (this.queenDefeatedTime > 0 && !this.kingSpawned && this.time.now > this.queenDefeatedTime + this.KING_SPAWN_DELAY) {
            this.spawnKing();
            this.kingSpawned = true;
        }
        
        // === JOKER BOSS SPAWN CHECK ===
        if (
            this.kingDefeatedTime > 0 &&
            !this.jokerSpawned &&
            this.time.now > this.kingDefeatedTime + this.JOKER_SPAWN_DELAY
        ) {
            this.spawnJoker();
            this.jokerSpawned = true;
        }

        this.fireRate = 200;

        // Main character movement
        if (this.left.isDown) {
            if (my.sprite.Alice.x > (my.sprite.Alice.displayWidth/2)) {
                if (this.shift.isDown) { my.sprite.Alice.x -= this.playerSpeed * dt / 2; }
                else { my.sprite.Alice.x -= this.playerSpeed * dt; }
            }
        }
        if (this.right.isDown) {
            if (my.sprite.Alice.x < (game.config.width - (my.sprite.Alice.displayWidth/2))) {
                if (this.shift.isDown) { my.sprite.Alice.x += this.playerSpeed * dt / 2; }
                else { my.sprite.Alice.x += this.playerSpeed * dt; }
            }
        }
        if (this.up.isDown) {
            if (my.sprite.Alice.y > my.sprite.Alice.displayHeight / 2) {
                if (this.shift.isDown) { my.sprite.Alice.y -= this.playerSpeed * dt / 2; }
                else { my.sprite.Alice.y -= this.playerSpeed * dt; }
            }
        }
        if (this.down.isDown) {
            if (my.sprite.Alice.y < game.config.height - my.sprite.Alice.displayHeight / 2) {
                if (this.shift.isDown) { my.sprite.Alice.y += this.playerSpeed * dt / 2; }
                else { my.sprite.Alice.y += this.playerSpeed * dt; }
            }
        }

        if (this.invincible && !this.isRespawning) {
            my.sprite.Alice.alpha = Math.floor(this.time.now / 80) % 2 === 0 ? 1 : 0.3;
        }

        // === ULTIMATE INPUT ===
        if (
            Phaser.Input.Keyboard.JustDown(this.x) &&
            this.energyPointCount >= this.ULTIMATE_MAX &&
            !this.ultimateActive
        ) {
            this.useUltimate();
        }

        // === PLAYER BULLET FIRING WITH ATTACK PATTERN TIERS ===
        if (this.z.isDown) {
            let time = this.time.now;
            if (time > this.lastFired + this.getEffectiveFireRate()) {
                let barPct = this.getBarPercent();
                let bx = my.sprite.Alice.x;
                let by = my.sprite.Alice.y - (my.sprite.Alice.displayHeight / 2);
                let piercing = barPct >= 0.8;

                if (barPct < 0.2) {
                    this.spawnBigBullet(bx, by, piercing);
                } else {
                    this.spawnBigBullet(bx - this.BIG_FLAME_OFFSET, by, piercing);
                    this.spawnBigBullet(bx + this.BIG_FLAME_OFFSET, by, piercing);
                }

                if (barPct >= 0.4) {
                    this.spawnTrackingBullet(bx, by, false);
                }
                if (barPct >= 0.6) {
                    this.spawnTrackingBullet(bx - this.TRACKING_SIDE_OFFSET, by, false);
                    this.spawnTrackingBullet(bx + this.TRACKING_SIDE_OFFSET, by, false);
                }

                this.lastFired = time;
            }
        }

        //Enemy movement
        for (let enemy of my.sprite.enemy) {
            if (enemy.dead) continue;

            if (enemy.visible && enemy.type === "hearts") {
                if (this.time.now > this.heartsLastShot + this.heartsFireRate) {
                    this.shootAtPlayer(enemy);
                    this.heartsLastShot = this.time.now;
                }
                enemy.y += enemy.speedY * dt;
                enemy.x += enemy.speedX * enemy.moveX * dt;
                if (enemy.x > game.config.width - enemy.displayWidth / 2) {
                    enemy.x = game.config.width - enemy.displayWidth / 2;
                    enemy.moveX = -1;
                }
                if (enemy.x < enemy.displayWidth / 2) {
                    enemy.x = enemy.displayWidth / 2;
                    enemy.moveX = 1;
                }
                if (enemy.y > game.config.height + enemy.displayHeight / 2) {
                    enemy.y = -20;
                    enemy.x = Math.random() * game.config.width;
                }
            }

            if (enemy.type === "clubs") {
                enemy.y += enemy.speedY * dt;
                if (enemy.y > game.config.height + enemy.displayHeight / 2) {
                    enemy.y = -20;
                    enemy.x = Math.random() * game.config.width;
                }
            }

            if (enemy.type === "diamonds") {
                enemy.stateTimer -= delta;
                if (enemy.y < 20) {
                    enemy.y += enemy.speed * dt;
                    continue;
                }
                if (enemy.state === "waiting") {
                    if (enemy.stateTimer <= 0) {
                        enemy.state = "moving";
                        enemy.stateTimer = 500;
                        let angle = Math.random() * Math.PI * 2;
                        enemy.dirX = Math.cos(angle);
                        enemy.dirY = Math.sin(angle);
                    }
                } else if (enemy.state === "moving") {
                    enemy.x += enemy.dirX * enemy.speed * dt;
                    enemy.y += enemy.dirY * enemy.speed * dt;
                    if (enemy.x < enemy.displayWidth / 2 || enemy.x > game.config.width - enemy.displayWidth / 2) {
                        enemy.dirX *= -1;
                    }
                    if (enemy.y < enemy.displayHeight / 2 || enemy.y > game.config.height / 2) {
                        enemy.dirY *= -1;
                    }
                    if (enemy.stateTimer <= 0) {
                        enemy.state = "waiting";
                        enemy.stateTimer = 1000;
                        enemy.dirX = 0;
                        enemy.dirY = 0;
                        this.shootSpread(enemy);
                    }
                }
            }

            if (enemy.type === "spades") {
                let dx = my.sprite.Alice.x - enemy.x;
                let dy = my.sprite.Alice.y - enemy.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) { dx /= dist; dy /= dist; }
                enemy.x += dx * enemy.speed * dt;
                enemy.y += dy * enemy.speed * dt;
            }

            if (enemy.type === "jack") {
                if (enemy.state === "moving") {
                    enemy.y += this.JACK_SPEED * dt;
                    if (enemy.y >= enemy.targetY) {
                        enemy.y = enemy.targetY;
                        enemy.state = "shooting";
                        enemy.lastShot = this.time.now;
                        // King's jacks: random fire rate between 1-2 seconds each cycle
                        if (enemy.isKingJack) {
                            enemy.currentFireRate = 1000 + Math.random() * 1000;
                        }
                    }
                } else if (enemy.state === "shooting") {
                    // King's jacks use randomized fire rate; regular jacks use fixed rate
                    let fireRate = enemy.isKingJack ? enemy.currentFireRate : this.JACK_FIRE_RATE;
                    if (this.time.now > enemy.lastShot + fireRate) {
                        this.shootJackVolley(enemy);
                        enemy.lastShot = this.time.now;
                        // King's jacks: pick a new random interval for next shot
                        if (enemy.isKingJack) {
                            enemy.currentFireRate = 1000 + Math.random() * 1000;
                        }
                    }
                }
            }

            if (enemy.type === "queen") {
                if (enemy.state === "moving") {
                    enemy.y += this.QUEEN_SPEED * dt;
                    if (enemy.y >= enemy.targetY) {
                        enemy.y = enemy.targetY;
                        enemy.state = "shooting";
                        enemy.lastShot = this.time.now;
                    }
                } else if (enemy.state === "shooting") {
                    enemy.angle += this.QUEEN_SPIN_SPEED * delta;
                    if (this.time.now > enemy.lastShot + this.QUEEN_FIRE_RATE) {
                        this.shootQueenBullet(enemy);
                        enemy.lastShot = this.time.now;
                    }
                }
            }

            // === KING ELITE ENEMY ===
            // Moves to position, then shoots fan at player every 2s.
            // Spawns 4 jacks on arrival, and every 10s after.
            if (enemy.type === "king") {
                if (enemy.state === "moving") {
                    enemy.y += this.KING_SPEED * dt;
                    if (enemy.y >= enemy.targetY) {
                        enemy.y = enemy.targetY;
                        enemy.state = "shooting";
                        enemy.lastShot = this.time.now;
                        enemy.lastJackSpawn = this.time.now;
                        // Spawn 4 jacks on arrival
                        this.spawnKingJacks(enemy);
                    }
                } else if (enemy.state === "shooting") {
                    // Shoot 8-bullet fan at player every KING_FIRE_RATE ms
                    if (this.time.now > enemy.lastShot + this.KING_FIRE_RATE) {
                        this.shootKingFan(enemy);
                        enemy.lastShot = this.time.now;
                    }

                    // Respawn 4 jacks every KING_JACK_RESPAWN_INTERVAL ms
                    if (this.time.now > enemy.lastJackSpawn + this.KING_JACK_RESPAWN_INTERVAL) {
                        this.spawnKingJacks(enemy);
                        enemy.lastJackSpawn = this.time.now;
                    }
                }
            }
        }

        // === JOKER BOSS UPDATE ===
        if (this.jokerBoss && this.jokerBoss.active) {
            this.jokerBoss.update(this.time.now, delta, dt);
        }


        // === ENEMY BULLET COLLISION WITH PLAYER (REDUCED HITBOX) ===
        for (let i = my.sprite.enemyBullet.length - 1; i >= 0; i--) {
            let bullet = my.sprite.enemyBullet[i];
            bullet.x += bullet.dirX * bullet.speed * dt;
            bullet.y += bullet.dirY * bullet.speed * dt;

            if (!this.invincible && !this.isRespawning && this.collidesPlayer(bullet, my.sprite.Alice)) {
                this.playerHit();
                bullet.destroy();
                my.sprite.enemyBullet.splice(i, 1);
                continue;
            }

            if (bullet.x < -bullet.displayWidth || bullet.x > game.config.width + bullet.displayWidth ||
                bullet.y < -bullet.displayHeight || bullet.y > game.config.height + bullet.displayHeight) {
                bullet.destroy();
                my.sprite.enemyBullet.splice(i, 1);
            }
        }

        // === JOKER BOSS SPECIAL BULLET COLLISIONS ===
        if (this.jokerBoss && this.jokerBoss.active) {
            let jokerBullets = this.jokerBoss.spiralBullets
                .concat(this.jokerBoss.giantBullets)
                .concat(this.jokerBoss.clubSweepBullets)
                .concat(this.jokerBoss.playerCenteredBullets)
                .concat(this.jokerBoss.fanBullets)
                .concat(this.jokerBoss.explodingFanBullets)
                .concat(this.jokerBoss.miniBullets);

            for (let i = jokerBullets.length - 1; i >= 0; i--) {
                let bullet = jokerBullets[i];
                if (!this.invincible && !this.isRespawning && this.collidesPlayer(bullet, my.sprite.Alice)) {
                    this.playerHit();
                }
            }
        }

        // === MOVE BIG BULLETS UPWARD ===
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight / 2));
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed * dt;
        }

        // === MOVE TRACKING BULLETS (HOME TOWARD NEAREST ENEMY) ===
        for (let i = my.sprite.trackingBullet.length - 1; i >= 0; i--) {
            let bullet = my.sprite.trackingBullet[i];

            let nearestEnemy = null;
            let nearestDist = Infinity;
            for (let enemy of my.sprite.enemy) {
                if (enemy.dead || !enemy.visible) continue;
                let dx = enemy.x - bullet.x;
                let dy = enemy.y - bullet.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestEnemy = enemy;
                }
            }

            if (nearestEnemy) {
                let dx = nearestEnemy.x - bullet.x;
                let dy = nearestEnemy.y - bullet.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    bullet.dirX = dx / dist;
                    bullet.dirY = dy / dist;
                }
            } else {
                bullet.dirX = 0;
                bullet.dirY = -1;
            }

            bullet.x += bullet.dirX * this.TRACKING_BULLET_SPEED * dt;
            bullet.y += bullet.dirY * this.TRACKING_BULLET_SPEED * dt;

            if (bullet.y < -bullet.displayHeight || bullet.y > game.config.height + bullet.displayHeight ||
                bullet.x < -bullet.displayWidth || bullet.x > game.config.width + bullet.displayWidth) {
                bullet.destroy();
                my.sprite.trackingBullet.splice(i, 1);
            }
        }

        // === BIG BULLET vs ENEMY COLLISION ===
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemy) {
                if (enemy.dead) continue;
                if (bullet.isPiercing && bullet.hitEnemies.has(enemy)) continue;

                if (this.collides(enemy, bullet)) {
                    let dmg = this.getEffectiveDamage();
                    enemy.hp -= dmg;

                    if (bullet.isPiercing) {
                        bullet.hitEnemies.add(enemy);
                    } else {
                        bullet.y = -100;
                    }

                    if (enemy.hp <= 0 && !enemy.dead) {
                        this.killEnemy(enemy);
                    }

                    if (!bullet.isPiercing) break;
                }
            }
        }

        // === TRACKING BULLET vs ENEMY COLLISION ===
        // Small flames deal 30% of big flame damage
        for (let i = my.sprite.trackingBullet.length - 1; i >= 0; i--) {
            let bullet = my.sprite.trackingBullet[i];
            let bulletHit = false;

            for (let enemy of my.sprite.enemy) {
                if (enemy.dead) continue;

                if (this.collides(enemy, bullet)) {
                    let smallDmg = this.getEffectiveDamage() * this.SMALL_FLAME_DAMAGE_RATIO;
                    enemy.hp -= smallDmg;

                    if (bullet.hasExplosion) {
                        this.createTrackingExplosion(bullet.x, bullet.y, smallDmg);
                    }

                    if (enemy.hp <= 0 && !enemy.dead) {
                        this.killEnemy(enemy);
                    }

                    bulletHit = true;
                    break;
                }
            }

            if (bulletHit) {
                bullet.destroy();
                my.sprite.trackingBullet.splice(i, 1);
            }
        }

        // === PLAYER-ENEMY BODY COLLISION (REDUCED HITBOX) ===
        for (let enemy of my.sprite.enemy) {
            if (enemy.visible && !enemy.dead && !this.invincible && !this.isRespawning && this.collidesPlayer(enemy, my.sprite.Alice)) {
                this.playerHit();
                enemy.dead = true;
                enemy.destroy();
            }
        }

        my.sprite.enemy = my.sprite.enemy.filter(enemy => !enemy.dead);

        // === DROP MOVEMENT WITH MAGNET PICKUP ===
        for (let i = my.sprite.drops.length - 1; i >= 0; i--) {
            let drop = my.sprite.drops[i];

            let dx = my.sprite.Alice.x - drop.x;
            let dy = my.sprite.Alice.y - drop.y;
            let distToPlayer = Math.sqrt(dx * dx + dy * dy);

            if (distToPlayer < this.DROP_MAGNET_RANGE && !this.isRespawning) {
                if (distToPlayer > 0) {
                    drop.x += (dx / distToPlayer) * this.DROP_MAGNET_SPEED * dt;
                    drop.y += (dy / distToPlayer) * this.DROP_MAGNET_SPEED * dt;
                }
            } else {
                drop.y += drop.speed * dt;
            }

            if (!this.isRespawning && this.collidesPickup(drop, my.sprite.Alice)) {
                this.pickupDrop(drop);
                drop.destroy();
                my.sprite.drops.splice(i, 1);
                continue;
            }

            if (drop.y > game.config.height + drop.displayHeight) {
                drop.destroy();
                my.sprite.drops.splice(i, 1);
            }
        }

        this.updateUltimate(delta);
        this.updateProgressBars();
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    collidesPlayer(a, player) {
        let scale = this.PLAYER_HITBOX_SCALE;
        let pw = player.displayWidth * scale;
        let ph = player.displayHeight * scale;
        if (Math.abs(a.x - player.x) > (a.displayWidth/2 + pw/2)) return false;
        if (Math.abs(a.y - player.y) > (a.displayHeight/2 + ph/2)) return false;
        return true;
    }

    collidesPickup(drop, player) {
        let range = this.DROP_PICKUP_RANGE;
        let scale = this.PLAYER_HITBOX_SCALE;
        let pw = player.displayWidth * scale;
        let ph = player.displayHeight * scale;
        if (Math.abs(drop.x - player.x) > (drop.displayWidth/2 + pw/2) * range) return false;
        if (Math.abs(drop.y - player.y) > (drop.displayHeight/2 + ph/2) * range) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    updateLivesDisplay() {
        let my = this.my;
        my.text.lives.setText("Lives " + this.lives);
    }

    updateProgressBars() {
        let ultimateFillWidth = (this.energyPointCount / this.ULTIMATE_MAX) * 156;
        this.ultimateBarFill.width = Math.max(0, ultimateFillWidth);
        let atkSpeedFillWidth = (this.attackSpeedEnergy / this.ATTACK_SPEED_BAR_MAX) * 156;
        this.attackSpeedBarFill.width = Math.max(0, atkSpeedFillWidth);
    }

    getEffectiveFireRate() {
        let barBonus = Math.floor(this.attackSpeedEnergy / 10) * this.ATTACK_SPEED_PER_10_POINTS;
        let pointBonus = this.attackSpeedPointCount * this.ATTACK_SPEED_POINT_BONUS;
        let totalBonus = Math.min(barBonus + pointBonus, 2.0);
        return this.fireRate / (1 + totalBonus);
    }

    // === EFFECTIVE DAMAGE ===
    // Attack speed bar no longer increases damage.
    // Damage is only the base playerDamage.
    getEffectiveDamage() {
        return this.playerDamage;
    }

    spawnBigBullet(x, y, piercing) {
        let bullet = this.add.sprite(x, y, "fire");
        // No setScale — uses default (v6) size
        bullet.isPiercing = piercing;
        bullet.hitEnemies = new Set();
        this.my.sprite.bullet.push(bullet);
    }

    spawnTrackingBullet(x, y, hasExplosion) {
        let bullet = this.add.sprite(x, y, "fire");
        bullet.setScale(this.SMALL_FLAME_SCALE);
        bullet.isSmall = true;
        bullet.hasExplosion = hasExplosion;
        bullet.dirX = 0;
        bullet.dirY = -1;
        this.my.sprite.trackingBullet.push(bullet);
    }

    useUltimate() {
        let my = this.my;

        // Spend all ultimate energy
        this.energyPointCount = 0;
        this.updateProgressBars();

        // Fire ring that flies outward
        this.createUltimateFireRing(my.sprite.Alice.x, my.sprite.Alice.y);

        // Clear all enemy bullets immediately
        this.clearAllEnemyBullets();

        // Deal initial burst damage to all enemies
        this.damageAllEnemies(this.ULTIMATE_BURST_DAMAGE);

        // Start forward fire laser
        this.ultimateActive = true;
        this.ultimateTimer = this.ULTIMATE_DURATION;
        this.ultimateLaserDamageTimer = 0;

        this.createUltimateFireLaser();
    }

    createUltimateFireRing(x, y) {
        let count = 36;

        for (let i = 0; i < count; i++) {
            let angle = (i / count) * Math.PI * 2;

            let fire = this.add.sprite(x, y, "fire");
            fire.setScale(0.6);
            fire.setDepth(6);

            fire.dirX = Math.cos(angle);
            fire.dirY = Math.sin(angle);
            fire.speed = this.ULTIMATE_FIRE_RING_SPEED;
            fire.rotation = angle;
            fire.spinSpeed = 10;

            this.ultimateFireRingBullets.push(fire);
        }
    }

    createUltimateFireLaser() {
        // Clear old laser parts just in case
        for (let part of this.ultimateLaserParts) {
            part.destroy();
        }
        this.ultimateLaserParts = [];

        let playerY = this.my.sprite.Alice.y - this.ULTIMATE_LASER_START_OFFSET;
        let rows = Math.ceil(playerY / this.ULTIMATE_LASER_FIRE_SPACING) + 8;

        for (let r = 0; r < rows; r++) {
            for (let s = 0; s < this.ULTIMATE_LASER_STRANDS; s++) {
                let fire = this.add.sprite(
                    this.my.sprite.Alice.x,
                    this.my.sprite.Alice.y,
                    "fire"
                );

                fire.setScale(this.ULTIMATE_LASER_CORE_SCALE);
                fire.setDepth(5);

                fire.laserRow = r;
                fire.laserStrand = s;

                // Two strands are opposite each other, like twisted rope
                fire.phaseOffset = (s / this.ULTIMATE_LASER_STRANDS) * Math.PI * 2;

                // Slight randomness makes it feel more organic, not too mechanical
                fire.randomOffset = Math.random() * 0.4 - 0.2;
                fire.baseScale = this.ULTIMATE_LASER_CORE_SCALE + Math.random() * 0.08;

                this.ultimateLaserParts.push(fire);
            }
        }
    }

    clearAllEnemyBullets() {
        // Normal enemy bullets
        for (let bullet of this.my.sprite.enemyBullet) {
            bullet.destroy();
        }
        this.my.sprite.enemyBullet = [];

        // Joker boss special bullets
        if (this.jokerBoss) {
            let jokerBulletGroups = [
                this.jokerBoss.spiralBullets,
                this.jokerBoss.giantBullets,
                this.jokerBoss.clubSweepBullets,
                this.jokerBoss.playerCenteredBullets,
                this.jokerBoss.fanBullets,
                this.jokerBoss.explodingFanBullets,
                this.jokerBoss.miniBullets
            ];

            for (let group of jokerBulletGroups) {
                for (let bullet of group) {
                    bullet.destroy();
                }
                group.length = 0;
            }
        }
    }

    damageAllEnemies(amount) {
        let enemies = [...this.my.sprite.enemy];

        for (let enemy of enemies) {
            if (enemy.dead || !enemy.visible) continue;

            enemy.hp -= amount;

            if (enemy.hp <= 0 && !enemy.dead) {
                this.killEnemy(enemy);
            }
        }
    }

    updateUltimate(delta) {
        let dt = delta / 1000;

        // Update outward fire ring even if laser is not active anymore
        this.updateUltimateFireRing(dt);

        if (!this.ultimateActive) return;

        this.ultimateTimer -= delta;
        this.ultimateLaserDamageTimer -= delta;

        // Keep fire laser attached to player and update spiral visual
        this.updateUltimateFireLaser(delta);

        // Damage and clear bullets every 0.01 second
        if (this.ultimateLaserDamageTimer <= 0) {
            this.damageEnemiesTouchingUltimateLaser(this.ULTIMATE_LASER_DAMAGE_PER_TICK);
            this.clearEnemyBulletsTouchingUltimateLaser();

            this.ultimateLaserDamageTimer = this.ULTIMATE_LASER_TICK;
        }

        if (this.ultimateTimer <= 0) {
            this.ultimateActive = false;
            this.destroyUltimateFireLaser();
        }
    }

    updateUltimateFireRing(dt) {
        let w = game.config.width;
        let h = game.config.height;

        for (let i = this.ultimateFireRingBullets.length - 1; i >= 0; i--) {
            let fire = this.ultimateFireRingBullets[i];

            fire.x += fire.dirX * fire.speed * dt;
            fire.y += fire.dirY * fire.speed * dt;
            fire.rotation += fire.spinSpeed * dt;

            // Fire ring also clears enemy bullets it touches
            this.clearEnemyBulletsTouchingSprite(fire);

            if (
                fire.x < -fire.displayWidth ||
                fire.x > w + fire.displayWidth ||
                fire.y < -fire.displayHeight ||
                fire.y > h + fire.displayHeight
            ) {
                fire.destroy();
                this.ultimateFireRingBullets.splice(i, 1);
            }
        }
    }

    updateUltimateFireLaser(delta) {
        let my = this.my;

        let playerX = my.sprite.Alice.x;
        let playerY = my.sprite.Alice.y - this.ULTIMATE_LASER_START_OFFSET;

        let t = this.time.now / 1000;
        let rows = Math.ceil(playerY / this.ULTIMATE_LASER_FIRE_SPACING) + 8;

        let index = 0;

        for (let r = 0; r < rows; r++) {
            for (let s = 0; s < this.ULTIMATE_LASER_STRANDS; s++) {
                let fire = this.ultimateLaserParts[index];

                if (fire) {
                    let yOffset = r * this.ULTIMATE_LASER_FIRE_SPACING;

                    // Main rope spiral:
                    // angle changes with time and also changes along the laser length.
                    let ropeAngle =
                        t * this.ULTIMATE_LASER_SPIN_SPEED +
                        (yOffset / this.ULTIMATE_LASER_WAVE_LENGTH) * Math.PI * 2 +
                        fire.phaseOffset +
                        fire.randomOffset;

                    // This makes the strand wrap left and right around the center line
                    let xOffset = Math.cos(ropeAngle) * this.ULTIMATE_LASER_RADIUS;

                    // This is the fake front/back depth
                    let depth = Math.sin(ropeAngle);

                    // When the flame is in front, make it bigger/brighter.
                    // When behind, make it smaller/dimmer.
                    let scale = fire.baseScale + (depth + 1) * 0.13;
                    let alpha = 0.35 + (depth + 1) * 0.30;

                    // Tiny waving motion makes it feel like flame, not a perfect math rope
                    let flameWiggle = Math.sin(t * 18 + r * 0.45 + s * 2) * 4;

                    fire.x = playerX + xOffset + flameWiggle;
                    fire.y = playerY - yOffset;

                    fire.setScale(scale);
                    fire.alpha = alpha;

                    // Front strand should appear above the back strand
                    fire.setDepth(depth > 0 ? 8 : 4);

                    // Rotate the sprite itself so it feels alive
                    fire.rotation += (depth > 0 ? 12 : 8) * (delta / 1000);
                }

                index++;
            }
        }
    }

    destroyUltimateFireLaser() {
        for (let part of this.ultimateLaserParts) {
            part.destroy();
        }

        this.ultimateLaserParts = [];
    }

    damageEnemiesTouchingUltimateLaser(amount) {
        if (!this.ultimateActive) return;

        let my = this.my;
        let playerX = my.sprite.Alice.x;
        let playerY = my.sprite.Alice.y - this.ULTIMATE_LASER_START_OFFSET;

        let laserWidth = my.sprite.Alice.displayWidth * this.ULTIMATE_LASER_WIDTH_MULTIPLIER;

        let enemies = [...this.my.sprite.enemy];

        for (let enemy of enemies) {
            if (enemy.dead || !enemy.visible) continue;

            let withinX = Math.abs(enemy.x - playerX) <= laserWidth / 2 + enemy.displayWidth / 2;
            let withinY = enemy.y <= playerY && enemy.y >= -enemy.displayHeight;

            if (withinX && withinY) {
                enemy.hp -= amount;

                if (enemy.hp <= 0 && !enemy.dead) {
                    this.killEnemy(enemy);
                }
            }
        }
    }

    clearEnemyBulletsTouchingUltimateLaser() {
        if (!this.ultimateActive) return;

        let my = this.my;
        let playerX = my.sprite.Alice.x;
        let playerY = my.sprite.Alice.y - this.ULTIMATE_LASER_START_OFFSET;

        let laserWidth = my.sprite.Alice.displayWidth * this.ULTIMATE_LASER_WIDTH_MULTIPLIER;

        // Normal enemy bullets
        for (let i = this.my.sprite.enemyBullet.length - 1; i >= 0; i--) {
            let bullet = this.my.sprite.enemyBullet[i];

            let withinX = Math.abs(bullet.x - playerX) <= laserWidth / 2 + bullet.displayWidth / 2;
            let withinY = bullet.y <= playerY && bullet.y >= -bullet.displayHeight;

            if (withinX && withinY) {
                bullet.destroy();
                this.my.sprite.enemyBullet.splice(i, 1);
            }
        }

        // Joker boss special bullets
        if (this.jokerBoss) {
            let jokerBulletGroups = [
                this.jokerBoss.spiralBullets,
                this.jokerBoss.giantBullets,
                this.jokerBoss.clubSweepBullets,
                this.jokerBoss.playerCenteredBullets,
                this.jokerBoss.fanBullets,
                this.jokerBoss.explodingFanBullets,
                this.jokerBoss.miniBullets
            ];

            for (let group of jokerBulletGroups) {
                for (let i = group.length - 1; i >= 0; i--) {
                    let bullet = group[i];

                    let withinX = Math.abs(bullet.x - playerX) <= laserWidth / 2 + bullet.displayWidth / 2;
                    let withinY = bullet.y <= playerY && bullet.y >= -bullet.displayHeight;

                    if (withinX && withinY) {
                        bullet.destroy();
                        group.splice(i, 1);
                    }
                }
            }
        }
    }

    clearEnemyBulletsTouchingSprite(sprite) {
        // Normal enemy bullets
        for (let i = this.my.sprite.enemyBullet.length - 1; i >= 0; i--) {
            let bullet = this.my.sprite.enemyBullet[i];

            if (this.collides(sprite, bullet)) {
                bullet.destroy();
                this.my.sprite.enemyBullet.splice(i, 1);
            }
        }

        // Joker boss special bullets
        if (this.jokerBoss) {
            let jokerBulletGroups = [
                this.jokerBoss.spiralBullets,
                this.jokerBoss.giantBullets,
                this.jokerBoss.clubSweepBullets,
                this.jokerBoss.playerCenteredBullets,
                this.jokerBoss.fanBullets,
                this.jokerBoss.explodingFanBullets,
                this.jokerBoss.miniBullets
            ];

            for (let group of jokerBulletGroups) {
                for (let i = group.length - 1; i >= 0; i--) {
                    let bullet = group[i];

                    if (this.collides(sprite, bullet)) {
                        bullet.destroy();
                        group.splice(i, 1);
                    }
                }
            }
        }
    }

    createTrackingExplosion(x, y, explosionDmg) {
        this.add.sprite(x, y, "whitePuff03").setScale(0.2).play("puff");

        for (let enemy of this.my.sprite.enemy) {
            if (enemy.dead || !enemy.visible) continue;
            let dx = enemy.x - x;
            let dy = enemy.y - y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.EXPLOSION_RADIUS) {
                enemy.hp -= explosionDmg;
                if (enemy.hp <= 0 && !enemy.dead) {
                    this.killEnemy(enemy);
                }
            }
        }
    }

    killEnemy(enemy) {
        if (enemy.dead) return;

        this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");

        // === TRACK DEFEATS FOR ELITE SPAWN CHAIN ===
        if (enemy.type === "jack" && !enemy.isKingJack) {
            this.jackKills++;
            if (this.jackKills >= this.JACK_COUNT) {
                this.jacksDefeatedTime = this.time.now;
            }
        }
        if (enemy.type === "queen") {
            this.queenDefeatedTime = this.time.now;
        }
        if (enemy.type === "king") {
            this.kingDefeatedTime = this.time.now;
        }

        // === JOKER PHASE TRANSITION ===
        if (enemy.type === "joker" && enemy.jokerBoss) {
            let jokerBoss = enemy.jokerBoss;

            this.hitSound.play();

            jokerBoss.transitionToNextPhase();

            enemy.dead = true;
            enemy.destroy();

            // Only final phase gives rewards and ends the game
            if (jokerBoss.dead) {
                this.spawnJokerEnergyDrops(enemy.x, enemy.y, enemy.maxHp);
                this.myScore += enemy.scorePoints;
                this.updateScore();

                jokerBoss.cleanup();

                this.gameWin();
            }

            return;
        }

        // === DROP SPAWNING: count equals enemy's max HP ===
        for (let d = 0; d < enemy.maxHp; d++) {
            let offsetX = (Math.random() - 0.5) * 20;
            let offsetY = (Math.random() - 0.5) * 20;
            let roll = Math.random();
            if (roll < this.ENERGY_POINT_CHANCE) {
                this.spawnDrop(enemy.x + offsetX, enemy.y + offsetY, "energy");
            } else if (roll < this.ENERGY_POINT_CHANCE + this.ATTACK_SPEED_POINT_CHANCE) {
                this.spawnDrop(enemy.x + offsetX, enemy.y + offsetY, "attackSpeed");
            } else {
                this.spawnDrop(enemy.x + offsetX, enemy.y + offsetY, "attackDamage");
            }
        }

        this.myScore += enemy.scorePoints;
        this.updateScore();
        this.hitSound.play();

        enemy.dead = true;
        enemy.destroy();
    }

    playerHit() {
        if (this.invincible || this.isRespawning || this.isGameOver) return;

        this.lives--;
        this.updateLivesDisplay();

        // === DEATH PENALTY: Ultimate resets to 0, attack speed bar unchanged ===
        this.energyPointCount = 0;
        this.attackSpeedPointCount = 0;
        this.attackDamagePointCount = 0;

        this.add.sprite(this.my.sprite.Alice.x, this.my.sprite.Alice.y, "whitePuff03")
            .setScale(0.5).play("puff");

        this.lastHitX = this.my.sprite.Alice.x;
        this.lastHitY = this.my.sprite.Alice.y;

        if (this.lives <= 0) {
            this.gameOver();
            return;
        }

        this.my.sprite.Alice.visible = false;
        this.gameFrozen = true;
        this.isRespawning = true;

        this.time.delayedCall(this.FREEZE_DURATION, () => {
            this.gameFrozen = false;
            this.respawnPlayer();
        });
    }

    respawnPlayer() {
        let my = this.my;
        my.sprite.Alice.x = game.config.width / 2;
        my.sprite.Alice.y = game.config.height - 40;
        my.sprite.Alice.visible = true;
        my.sprite.Alice.alpha = 0;
        this.invincible = true;

        this.tweens.add({
            targets: my.sprite.Alice,
            alpha: 1,
            duration: this.RESPAWN_FADE_DURATION,
            onComplete: () => {
                this.time.delayedCall(this.POST_RESPAWN_INVINCIBILITY, () => {
                    this.invincible = false;
                    this.isRespawning = false;
                    my.sprite.Alice.alpha = 1;
                });
            }
        });
    }

    restartGame() {
        this.tweens.killAll();

        this.myScore = 0;
        this.lives = 10;
        this.isGameOver = false;
        this.isGameWon = false;
        this.isRespawning = false;
        this.gameFrozen = false;
        this.invincible = false;
        this.lastFired = 0;
        this.energyPointCount = 0;
        this.attackSpeedEnergy = 0;
        this.attackSpeedPointCount = 0;
        this.attackDamagePointCount = 0;

        this.lastClubSpawn = 0;
        this.lastSpadeSpawn = 0;
        this.lastHeartSpawn = 0;
        this.lastDiamondSpawn = 0;

        this.jacksSpawned = false;
        this.jackKills = 0;
        this.jacksDefeatedTime = 0;
        this.queenSpawned = false;
        this.queenDefeatedTime = 0;
        this.kingSpawned = false;
        this.kingDefeatedTime = 0;

        this.jokerSpawned = false;
        if (this.jokerBoss) {
            this.jokerBoss.active = false;
            this.jokerBoss.dead = false;
            this.jokerBoss.cleanup();
        }

        this.spadesUnlocked = false;
        this.heartsUnlocked = false;
        this.diamondsUnlocked = false;

        this.my.sprite.bullet = [];
        this.my.sprite.trackingBullet = [];
        this.my.sprite.enemy = [];
        this.my.sprite.enemyBullet = [];
        this.my.sprite.drops = [];

        this.scene.restart();

        this.ultimateActive = false;
        this.ultimateTimer = 0;
        this.ultimateLaserDamageTimer = 0;

        this.destroyUltimateFireLaser();

        for (let fire of this.ultimateFireRingBullets) {
            fire.destroy();
        }
        this.ultimateFireRingBullets = [];
    }

    spawnDrop(x, y, type, energyValue) {
        let drop;

        // Smaller unified point size
        let scale = 0.2;

        // All points use the same asset
        drop = this.add.sprite(x, y, "pointDrop");

        // Different colors still show different point types
        if (type === "energy") {
            drop.setTint(0x00ffff);        // blue/cyan
        } else if (type === "attackSpeed") {
            drop.setTint(0xffff00);        // yellow
        } else if (type === "attackDamage") {
            drop.setTint(0xff6600);        // orange
        }

        drop.setScale(scale);
        drop.dropType = type;
        drop.speed = this.DROP_SPEED;
        drop.energyValue = energyValue || 1;

        this.my.sprite.drops.push(drop);
    }

    // === JOKER PHASE DEATH ENERGY DROPS ===
    // Spawns larger-value energy pickups to avoid performance issues
    // from spawning hundreds of individual +1 drops.
    spawnJokerEnergyDrops(x, y, totalEnergy) {
        let dropCount = 10;
        let energyPerDrop = totalEnergy / dropCount;

        for (let d = 0; d < dropCount; d++) {
            let offsetX = (Math.random() - 0.5) * 40;
            let offsetY = (Math.random() - 0.5) * 40;
            this.spawnDrop(x + offsetX, y + offsetY, "energy", energyPerDrop);
        }
    }

    pickupDrop(drop) {
        if (drop.dropType === "energy") {
            let value = drop.energyValue || 1;
            this.energyPointCount = Math.min(this.energyPointCount + value, this.ULTIMATE_MAX);
            this.attackSpeedEnergy = Math.min(this.attackSpeedEnergy + value, this.ATTACK_SPEED_BAR_MAX);
            this.myScore += value;
            this.updateScore();
        } else if (drop.dropType === "attackSpeed") {
            this.attackSpeedPointCount++;
        } else if (drop.dropType === "attackDamage") {
            this.attackDamagePointCount++;
        }
    }

    spawnClubs() {
        let enemy = this.add.sprite(Math.random() * game.config.width, -20, "card_clubs");
        enemy.setScale(0.5);
        enemy.scorePoints = 10;
        enemy.type = "clubs";
        enemy.hp = this.ENEMY_HP_CLUBS;
        enemy.maxHp = this.ENEMY_HP_CLUBS;
        enemy.speedY = 250;
        this.my.sprite.enemy.push(enemy);
    }

    spawnSpades() {
        let enemy = this.add.sprite(Math.random() * game.config.width, -20, "card_spades");
        enemy.setScale(0.5);
        enemy.scorePoints = 15;
        enemy.type = "spades";
        enemy.hp = this.ENEMY_HP_SPADES;
        enemy.maxHp = this.ENEMY_HP_SPADES;
        enemy.speed = 120;
        this.my.sprite.enemy.push(enemy);
    }
    spawnHearts() {
        let enemy = this.add.sprite(Math.random() * game.config.width, -20, "card_hearts");
        enemy.setScale(0.5);
        enemy.scorePoints = 25;
        enemy.type = "hearts";
        enemy.hp = this.ENEMY_HP_HEARTS;
        enemy.maxHp = this.ENEMY_HP_HEARTS;
        enemy.speedY = 20;
        enemy.speedX = 200;
        enemy.moveX = 1;
        this.my.sprite.enemy.push(enemy);
    }

    spawnDiamonds() {
        let enemy = this.add.sprite(Math.random() * game.config.width, -20, "card_diamonds");
        enemy.setScale(0.5);
        enemy.scorePoints = 30;
        enemy.type = "diamonds";
        enemy.hp = this.ENEMY_HP_DIAMONDS;
        enemy.maxHp = this.ENEMY_HP_DIAMONDS;
        enemy.state = "waiting";
        enemy.stateTimer = 1000;
        enemy.speed = 400;
        enemy.dirX = 0;
        enemy.dirY = 0;
        this.my.sprite.enemy.push(enemy);
    }

    spawnJacks() {
        let targetY = this.JACK_MOVE_DISTANCE * game.config.height;

        let jack1 = this.add.sprite(game.config.width * 0.25, -30, "card_jack");
        jack1.setScale(0.7);
        jack1.scorePoints = 50;
        jack1.type = "jack";
        jack1.hp = this.ENEMY_HP_JACK;
        jack1.maxHp = this.ENEMY_HP_JACK;
        jack1.isKingJack = false;
        jack1.state = "moving";
        jack1.targetY = targetY;
        jack1.lastShot = 0;
        this.my.sprite.enemy.push(jack1);

        let jack2 = this.add.sprite(game.config.width * 0.75, -30, "card_jack");
        jack2.setScale(0.7);
        jack2.scorePoints = 50;
        jack2.type = "jack";
        jack2.hp = this.ENEMY_HP_JACK;
        jack2.maxHp = this.ENEMY_HP_JACK;
        jack2.isKingJack = false;
        jack2.state = "moving";
        jack2.targetY = targetY;
        jack2.lastShot = 0;
        this.my.sprite.enemy.push(jack2);
    }

    spawnQueen() {
        let targetY = this.QUEEN_MOVE_DISTANCE * game.config.height;

        let queen = this.add.sprite(game.config.width / 2, -50, "card_queen");
        queen.setScale(1);
        queen.scorePoints = 100;
        queen.type = "queen";
        queen.hp = this.ENEMY_HP_QUEEN;
        queen.maxHp = this.ENEMY_HP_QUEEN;
        queen.state = "moving";
        queen.targetY = targetY;
        queen.lastShot = 0;
        this.my.sprite.enemy.push(queen);
    }

    // === SPAWN ELITE KING ===
    // King spawns at center top, moves to 2/5 of screen.
    // On arrival, spawns 4 jacks. Every 10s, respawns 4 jacks.
    // Shoots 8-bullet fan at player every 2s.
    spawnKing() {
        let targetY = this.KING_MOVE_DISTANCE * game.config.height;

        let king = this.add.sprite(game.config.width / 2, -50, "card_king");
        king.setScale(1);
        king.scorePoints = 200;
        king.type = "king";
        king.hp = this.ENEMY_HP_KING;
        king.maxHp = this.ENEMY_HP_KING;
        king.state = "moving";
        king.targetY = targetY;
        king.lastShot = 0;
        king.lastJackSpawn = 0;
        king.fanToggle = 0;                  // Starts with 7 bullets, then alternates to 8
        this.my.sprite.enemy.push(king);
    }

    // === SPAWN KING'S JACKS ===
    // 4 jacks: 2 on left side, 2 on right side.
    // Move from top to slightly below King's Y position.
    // These jacks are marked isKingJack so they don't count toward
    // the initial jackKills tracker (Jack→Queen→King chain).
    spawnKingJacks(king) {
        let targetY = king.y + 15; // Slightly below King — tweak here
        let positions = [
            game.config.width * 0.15,
            game.config.width * 0.35,
            game.config.width * 0.65,
            game.config.width * 0.85
        ];

        for (let posX of positions) {
            let jack = this.add.sprite(posX, -30, "card_jack");
            jack.setScale(0.7);
            jack.scorePoints = 50;
            jack.type = "jack";
            jack.hp = this.ENEMY_HP_JACK;
            jack.maxHp = this.ENEMY_HP_JACK;
            jack.isKingJack = true;
            jack.state = "moving";
            jack.targetY = targetY;
            jack.lastShot = 0;
            jack.speed = this.JACK_SPEED;
            jack.currentFireRate = 1000 + Math.random() * 1000; // Random 1-2s interval
            this.my.sprite.enemy.push(jack);
        }
    }

    // === SPAWN JOKER BOSS (3-PHASE FRAMEWORK) ===
    // Debug: press M to spawn. No attack patterns or phase behavior implemented yet.
    spawnJoker() {
        if (this.jokerSpawned) return;
        this.jokerSpawned = true;
        this.jokerBoss = new JokerBoss(this);
        this.jokerBoss.activate();
    }

    isJokerFightActive() {
        return this.jokerBoss && this.jokerBoss.active && !this.jokerBoss.dead;
    }

    gameOver() {
        if (this.isGameOver) return;

        this.isGameOver = true;

        // === DEATH PENALTY ON GAME OVER: Ultimate resets to 0, attack speed bar unchanged ===
        this.energyPointCount = 0;
        this.attackSpeedPointCount = 0;
        this.attackDamagePointCount = 0;
        this.updateProgressBars();

        this.bgm.stop();

        this.add.text(game.config.width / 2, game.config.height / 2 - 40, "GAME OVER", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#ff0000"
        }).setOrigin(0.5);

        this.add.text(game.config.width / 2, game.config.height / 2 + 30, "FINAL SCORE: " + this.myScore, {
            fontFamily: "Arial",
            fontSize: "48px",
            color: "#ff0000"
        }).setOrigin(0.5);

        this.add.text(game.config.width / 2, game.config.height / 2 + 90, "Press R to Restart", {
            fontFamily: "Arial",
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5);
    }

    gameWin() {
        if (this.isGameWon) return;

        this.isGameWon = true;
        this.gameFrozen = true;

        // Stop background music if needed
        if (this.bgm) {
            this.bgm.stop();
        }

        // Clear enemy bullets
        for (let bullet of this.my.sprite.enemyBullet) {
            bullet.destroy();
        }
        this.my.sprite.enemyBullet = [];

        // Clear Joker bullets
        if (this.jokerBoss) {
            this.jokerBoss.cleanup();
        }

        // Victory overlay
        this.add.rectangle(
            game.config.width / 2,
            game.config.height / 2,
            game.config.width,
            game.config.height,
            0x000000,
            0.75
        ).setDepth(100);

        this.add.bitmapText(
            game.config.width / 2 - 170,
            game.config.height / 2 - 80,
            "rocketSquare",
            "VICTORY!"
        ).setScale(2).setDepth(101);

        this.add.bitmapText(
            game.config.width / 2 - 230,
            game.config.height / 2,
            "rocketSquare",
            "You defeated Joker!"
        ).setScale(1).setDepth(101);

        this.time.delayedCall(3000, () => {
            this.scene.start("creditScreen");
        });
    }

}