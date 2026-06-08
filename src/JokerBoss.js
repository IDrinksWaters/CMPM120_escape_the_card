class JokerBoss {
    constructor(scene) {
        this.scene = scene;
        this.sprite = null;
        this.currentPhase = 0;
        this.active = false;
        this.dead = false;

        this.spiralBullets = [];
        this.giantBullets = [];
        this.clubSweepBullets = [];
        this.playerCenteredBullets = [];
        this.fanBullets = [];
        this.explodingFanBullets = [];
        this.miniBullets = [];

        this.transitioning = false;
        this.transitionTimer = 0;
        this.transitionTargetPhase = 0;
        this.transitionPos = { x: 0, y: 0 };

        this.blinkTimer = 0;
        this.blinkActive = false;

        this.infinityT = 0;

        this.clubSweepTimer = 0;
        this.giantBulletTimer = 0;
        this.giantWaveToggle = 0;

        this.phase3AttackIndex = 0;
        this.phase3State = "moving";
        this.phase3StateTimer = 0;
        this.phase3MoveTarget = { x: 0, y: 0 };

        this.fanSequenceStep = 0;
        this.fanLastShot = 0;
        this.fanSequenceComplete = false;

        // === PHASE 3 TELEPORT ATTACK SETTINGS ===
        this.phase3Side = 0; // 0 = left, 1 = right
        this.phase3TeleportAttackType = "fan";
        this.phase3LastPlayerTrap = 0;

        this.PHASE3_TRAP_INTERVAL = 4000;      // Every 2 seconds
        this.PHASE3_TRAP_WAIT = 2000;          // Wait 1 second, then fire inward
        this.PHASE3_TRAP_RADIUS = 120;
        this.PHASE3_TRAP_BULLET_SCALE = 1.5;
        this.PHASE3_TRAP_BULLET_SPEED = 180;

        this.PHASE3_TELEPORT_Y_RATIO = 0.16;   // Similar to previous top-area y
        this.PHASE3_FAN_DELAY = 200;           // 0.2 second between fan waves
        this.PHASE3_AFTER_ATTACK_WAIT = 2000;   // 2 second after attack

        this.explodingFanComplete = false;
        this.explodingFanExplodedCount = 0;

        // === PLAYER-CENTERED ATTACK RADIUS (TWEAKABLE) ===
        // Controls how far from the player the 5 giant bullets spawn.
        // Larger values give more escape time. Adjust for difficulty.
        this.PLAYER_CENTERED_ATTACK_RADIUS = 120;

        this.phases = [
            {
                hp: 500,
                maxHp: 500,
                speed: 300,
                moveDistance: 0.2,
                state: "moving",
                targetY: 0,
                lastShot: 0,
                fireRate: 300,
                bulletSpeed: 100,
                rotationSpeed: 3.5,
                muzzleRadius: 35,
                spriteKey: "card_joker_black_asset",
                scale: 1.0
            },
            {
                hp: 500,
                maxHp: 500,
                speed: 300,
                moveDistance: 0.2,
                state: "moving",
                targetY: 0,
                lastShot: 0,
                fireRate: 500,
                spriteKey: "card_joker_black_asset",
                scale: 1.2,

                // Phase 2 movement
                infinityCenterX: 0,
                infinityCenterY: 0,
                infinityWidth: 120,
                infinityHeight: 40,
                infinitySpeed: 1.5,

                // Phase 2 giant bullet attack
                giantBulletCount: 5,
                giantBulletScale: 2.5,
                giantBulletSpeed: 190,
                giantBulletFireRate: 550,

                // Phase 2 club sweep attack
                clubSpeedY: 1100,
                clubSpeedX: 1300,
                clubWaitTime: 500,
                clubSweepFireRate: 1000
            },
            {
                hp: 500,
                maxHp: 500,
                speed: 350,
                spriteKey: "card_joker_red_asset",
                scale: 1.5
            }
        ];
    }

    activate() {
        this.active = true;
        this.dead = false;
        this.currentPhase = 0;
        this.transitioning = false;
        this.blinkActive = false;
        this.infinityT = 0;
        this.clubSweepTimer = 0;
        this.giantBulletTimer = 0;
        this.giantWaveToggle = 0;
        this.phase3AttackIndex = 0;
        this.phase3State = "moving";
        this.enterPhase(0);
    }

    enterPhase(phaseIndex) {
        let spawnX = this.scene.game.config.width / 2;
        let spawnY = -60;

        if (phaseIndex > 0) {
            spawnX = this.transitionPos.x;
            spawnY = this.transitionPos.y;
        }

        this.currentPhase = phaseIndex;

        if (this.sprite) {
            this.sprite.destroy();
        }

        if (phaseIndex === 0 || phaseIndex === 1) {
            let phase = this.phases[phaseIndex];
            phase.state = "moving";
            phase.targetY = phase.moveDistance * this.scene.game.config.height;
            phase.lastShot = 0;

            this.sprite = this.scene.add.sprite(
                spawnX,
                spawnY,
                phase.spriteKey
            );
            this.sprite.setScale(phase.scale);

            if (phaseIndex === 1) {
                this.blinkActive = true;
                this.blinkTimer = 0;
            }
        } else if (phaseIndex === 2) {
            let phase = this.phases[2];

            this.sprite = this.scene.add.sprite(
                this.scene.game.config.width / 2,
                -60,
                phase.spriteKey
            );

            this.sprite.setScale(phase.scale);
            this.blinkActive = true;
            this.blinkTimer = 0;

            // Phase 3 starts with teleport logic, not random movement
            this.phase3AttackIndex = 0;
            this.phase3State = "teleporting";
            this.phase3StateTimer = 0;
            this.phase3LastPlayerTrap = 0;

            this.fanSequenceStep = 0;
            this.fanLastShot = 0;
            this.fanSequenceComplete = false;

            this.explodingFanComplete = false;
            this.explodingFanExplodedCount = 0;
        }

        this.sprite.type = "joker";
        this.sprite.hp = this.phases[phaseIndex].hp;
        this.sprite.maxHp = this.phases[phaseIndex].maxHp;
        this.sprite.scorePoints = 300;
        this.sprite.dead = false;
        this.sprite.jokerBoss = this;

        this.scene.my.sprite.enemy.push(this.sprite);

        // Remove phase transition text
        if (this.phaseText) {
            this.phaseText.destroy();
            this.phaseText = null;
        }

        // Small entrance effect for the new phase
        this.sprite.alpha = 0.2;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 1,
            scale: this.phases[phaseIndex].scale,
            duration: 500
        });
    }

    transitionToNextPhase() {
        let nextPhase = this.currentPhase + 1;

        if (nextPhase < this.phases.length) {
            this.cleanup(); // Clear old phase bullets

            this.transitioning = true;
            this.transitionTimer = 2000;
            this.transitionTargetPhase = nextPhase;
            this.transitionPos = { x: this.sprite.x, y: this.sprite.y };
            this.blinkActive = false;

            for (let i = 0; i < 8; i++) {
                let offsetX = (Math.random() - 0.5) * 60;
                let offsetY = (Math.random() - 0.5) * 60;
                this.scene.add.sprite(
                    this.transitionPos.x + offsetX,
                    this.transitionPos.y + offsetY,
                    "whitePuff03"
                ).setScale(0.4 + Math.random() * 0.3).play("puff");
            }
        } else {
            this.dead = true;
            this.active = false;
        }
    }

    getCurrentPhase() {
        return this.phases[this.currentPhase];
    }

    update(time, delta, dt) {
        if (!this.active || this.dead) return;

        if (this.transitioning) {
            this.transitionTimer -= delta;
            this.updateAllBullets(dt, delta);
            if (this.transitionTimer <= 0) {
                this.transitioning = false;
                this.enterPhase(this.transitionTargetPhase);
            }
            return;
        }

        if (!this.sprite || this.sprite.dead) return;

        if (this.blinkActive && (this.currentPhase === 1 || this.currentPhase === 2)) {
            this.blinkTimer += delta;
            this.sprite.alpha = Math.floor(this.blinkTimer / 150) % 2 === 0 ? 1 : 0.3;
        }

        if (this.currentPhase === 0) {
            this.updatePhase1(time, delta, dt);
        } else if (this.currentPhase === 1) {
            this.updatePhase2(time, delta, dt);
        } else if (this.currentPhase === 2) {
            this.updatePhase3(time, delta, dt);
        }

        this.updateAllBullets(dt, delta);
    }

    updateAllBullets(dt, delta) {
        this.updateSpiralBullets(dt, delta);
        this.updateGiantBullets(dt);
        this.updateClubSweepBullets(dt, delta);
        this.updatePlayerCenteredBullets(dt, delta);
        this.updateFanBullets(dt);
        this.updateExplodingFanBullets(dt, delta);
        this.updateMiniBullets(dt);
    }

    // ========================================
    // PHASE 1: Spiral Whirlpool Attack
    // ========================================
    updatePhase1(time, delta, dt) {
        let phase = this.phases[0];

        // Boss body keeps rotating during phase 1
        if (this.sprite) {
            this.sprite.rotation += phase.rotationSpeed * dt;
        }

        if (phase.state === "moving") {
            this.sprite.y += phase.speed * dt;

            if (this.sprite.y >= phase.targetY) {
                this.sprite.y = phase.targetY;
                phase.state = "shooting";
                phase.lastShot = time;
            }
        } else if (phase.state === "shooting") {
            if (time > phase.lastShot + phase.fireRate) {
                this.fireSpiralWave();
                phase.lastShot = time;
            }
        }
    }

    fireSpiralWave() {
        let phase = this.phases[0];

        // Five directions, but rotated by the boss's current angle
        let baseAngles = [0, 72, 144, 216, 288];

        for (let i = 0; i < baseAngles.length; i++) {
            let angle = this.sprite.rotation + baseAngles[i] * Math.PI / 180;

            // Bullet spawns from a rotating muzzle point around the boss
            let spawnX = this.sprite.x + Math.cos(angle) * phase.muzzleRadius;
            let spawnY = this.sprite.y + Math.sin(angle) * phase.muzzleRadius;

            let bullet = this.scene.add.sprite(
                spawnX,
                spawnY,
                "enemyBullet_hearts"
            );

            bullet.setScale(0.5);
            bullet.setTint(0xaa44ff);

            bullet.originalSpeed = phase.bulletSpeed;
            bullet.speed = phase.bulletSpeed;
            bullet.dirX = Math.cos(angle);
            bullet.dirY = Math.sin(angle);

            bullet.bounceCount = 0;
            bullet.maxBounces = 1;
            bullet.isSpiralBullet = true;

            this.spiralBullets.push(bullet);
        }
    }

    updateSpiralBullets(dt, delta) {
        let w = this.scene.game.config.width;
        let h = this.scene.game.config.height;

        for (let i = this.spiralBullets.length - 1; i >= 0; i--) {
            let bullet = this.spiralBullets[i];

            bullet.x += bullet.dirX * bullet.speed * dt;
            bullet.y += bullet.dirY * bullet.speed * dt;

            let hw = bullet.displayWidth / 2;
            let hh = bullet.displayHeight / 2;

            let hitLeft = bullet.x < hw;
            let hitRight = bullet.x > w - hw;
            let hitTop = bullet.y < hh;
            let hitBottom = bullet.y > h - hh;

            let hitBoundary = hitLeft || hitRight || hitTop || hitBottom;

            if (hitBoundary) {
                bullet.bounceCount++;

                if (bullet.bounceCount > bullet.maxBounces) {
                    bullet.destroy();
                    this.spiralBullets.splice(i, 1);
                    continue;
                }

                // Keep bullet inside the screen before choosing new direction
                bullet.x = Phaser.Math.Clamp(bullet.x, hw, w - hw);
                bullet.y = Phaser.Math.Clamp(bullet.y, hh, h - hh);

                // Pick a random angle that points back into the play area
                let angle;

                if (hitLeft) {
                    // Must go right
                    angle = -Math.PI / 2 + Math.random() * Math.PI;
                } else if (hitRight) {
                    // Must go left
                    angle = Math.PI / 2 + Math.random() * Math.PI;
                } else if (hitTop) {
                    // Must go down
                    angle = Math.random() * Math.PI;
                } else if (hitBottom) {
                    // Must go up
                    angle = Math.PI + Math.random() * Math.PI;
                }

                bullet.dirX = Math.cos(angle);
                bullet.dirY = Math.sin(angle);
                bullet.speed = bullet.originalSpeed * 0.5;
            }

            // After bouncing once, remove it when it fully leaves the screen
            if (bullet.bounceCount >= 1 &&
                (bullet.x < -bullet.displayWidth || bullet.x > w + bullet.displayWidth ||
                bullet.y < -bullet.displayHeight || bullet.y > h + bullet.displayHeight)) {
                bullet.destroy();
                this.spiralBullets.splice(i, 1);
            }
        }
    }

    // ========================================
    // PHASE 2: Rotating Giant Bullets + Club Sweep
    // ========================================
    updatePhase2(time, delta, dt) {
        let phase = this.phases[1];

        if (phase.state === "moving") {
            this.sprite.y += phase.speed * dt;
            if (this.sprite.y >= phase.targetY) {
                this.sprite.y = phase.targetY;
                phase.state = "infinity";
                phase.infinityCenterX = this.scene.game.config.width / 2;
                phase.infinityCenterY = this.sprite.y;
                this.clubSweepTimer = this.scene.time.now;
                this.giantBulletTimer = this.scene.time.now;
            }
        } else if (phase.state === "infinity") {
            this.infinityT += phase.infinitySpeed * dt;
            let cx = phase.infinityCenterX;
            let cy = phase.infinityCenterY;
            let a = phase.infinityWidth;
            let b = phase.infinityHeight;
            let denom = 1 + Math.sin(this.infinityT) * Math.sin(this.infinityT);
            this.sprite.x = cx + (a * Math.cos(this.infinityT)) / denom;
            this.sprite.y = cy + (b * Math.sin(this.infinityT) * Math.cos(this.infinityT)) / denom;

            if (time > this.giantBulletTimer + phase.giantBulletFireRate) {
                this.fireGiantBullets();
                this.giantBulletTimer = time;
            }

            if (time > this.clubSweepTimer + phase.clubSweepFireRate) {
                this.fireClubSweep();
                this.clubSweepTimer = time;
            }
        }
    }

    fireGiantBullets() {
        let phase = this.phases[1];

        let count = phase.giantBulletCount;
        let angleStep = Math.PI * 2 / count;

        // Wave 1 shoots normal 5 directions.
        // Wave 2 rotates by half of the gap, so bullets go through the previous gaps.
        let offset = this.giantWaveToggle === 0 ? 0 : angleStep / 2;

        // Start from upward direction, then rotate around
        let startAngle = -Math.PI / 2 + offset;

        this.giantWaveToggle = this.giantWaveToggle === 0 ? 1 : 0;

        for (let i = 0; i < count; i++) {
            let angle = startAngle + i * angleStep;

            let bullet = this.scene.add.sprite(
                this.sprite.x,
                this.sprite.y,
                "enemyBullet_diamonds"
            );

            bullet.setScale(phase.giantBulletScale);
            bullet.setTint(0xff4488);

            bullet.speed = phase.giantBulletSpeed;
            bullet.dirX = Math.cos(angle);
            bullet.dirY = Math.sin(angle);
            bullet.isGiantBullet = true;

            this.giantBullets.push(bullet);
        }
    }

    updateGiantBullets(dt) {
        for (let i = this.giantBullets.length - 1; i >= 0; i--) {
            let bullet = this.giantBullets[i];
            bullet.x += bullet.dirX * bullet.speed * dt;
            bullet.y += bullet.dirY * bullet.speed * dt;
            let w = this.scene.game.config.width;
            let h = this.scene.game.config.height;
            if (bullet.x < -bullet.displayWidth || bullet.x > w + bullet.displayWidth ||
                bullet.y < -bullet.displayHeight || bullet.y > h + bullet.displayHeight) {
                bullet.destroy();
                this.giantBullets.splice(i, 1);
            }
        }
    }

    fireClubSweep() {
        let playerX = this.scene.my.sprite.Alice.x;
        let playerY = this.scene.my.sprite.Alice.y;
        let w = this.scene.game.config.width;

        let phase = this.phases[1];

        let leftClub = this.scene.add.sprite(w * 0.08, -20, "card_clubs");
        leftClub.setScale(0.5);
        leftClub.setTint(0xff6666);
        leftClub.clubState = "movingToPlayerY";
        leftClub.targetY = playerY;
        leftClub.targetX = playerX;
        leftClub.waitTimer = 0;
        leftClub.speedY = phase.clubSpeedY;
        leftClub.speedX = phase.clubSpeedX;
        leftClub.isClubBullet = true;
        this.clubSweepBullets.push(leftClub);

        let rightClub = this.scene.add.sprite(w * 0.92, -20, "card_clubs");
        rightClub.setScale(0.5);
        rightClub.setTint(0xff6666);
        rightClub.clubState = "movingToPlayerY";
        rightClub.targetY = playerY;
        rightClub.targetX = playerX;
        rightClub.waitTimer = 0;
        rightClub.speedY = phase.clubSpeedY;
        rightClub.speedX = phase.clubSpeedX;
        rightClub.isClubBullet = true;
        this.clubSweepBullets.push(rightClub);
    }

    updateClubSweepBullets(dt, delta) {
        for (let i = this.clubSweepBullets.length - 1; i >= 0; i--) {
            let club = this.clubSweepBullets[i];
            if (club.clubState === "movingToPlayerY") {
                if (club.y < club.targetY) club.y += club.speedY * dt;
                if (club.y >= club.targetY) {
                    club.y = club.targetY;
                    club.clubState = "waiting";
                    club.waitTimer = this.phases[1].clubWaitTime;
                }
            } else if (club.clubState === "waiting") {
                club.waitTimer -= delta;
                if (club.waitTimer <= 0) {
                    club.clubState = "movingToPlayerX";
                    club.horizDir = (club.targetX - club.x) > 0 ? 1 : -1;
                }
            } else if (club.clubState === "movingToPlayerX") {
                club.x += club.horizDir * club.speedX * dt;
            }
            let w = this.scene.game.config.width;
            let h = this.scene.game.config.height;
            if (club.x < -club.displayWidth || club.x > w + club.displayWidth ||
                club.y < -club.displayHeight || club.y > h + club.displayHeight) {
                club.destroy();
                this.clubSweepBullets.splice(i, 1);
            }
        }
    }

    // ========================================
    // PHASE 3: Player-Centered + Fan + Exploding Fan
    // ========================================
    pickPhase3MoveTarget() {
        let w = this.scene.game.config.width;
        let h = this.scene.game.config.height;
        let margin = 60;
        return {
            x: margin + Math.random() * (w - margin * 2),
            y: h * 0.1 + Math.random() * (h * 0.15)
        };
    }

    phase3Teleport() {
        let w = this.scene.game.config.width;
        let h = this.scene.game.config.height;

        // 50% chance: left or right fixed position
        this.phase3Side = Math.random() < 0.5 ? 0 : 1;

        let targetX = this.phase3Side === 0 ? w * 0.25 : w * 0.75;
        let targetY = h * this.PHASE3_TELEPORT_Y_RATIO;

        // Flash effect at old position
        this.scene.add.sprite(this.sprite.x, this.sprite.y, "whitePuff03")
            .setScale(0.4)
            .play("puff");

        this.sprite.x = targetX;
        this.sprite.y = targetY;

        // Flash effect at new position
        this.scene.add.sprite(this.sprite.x, this.sprite.y, "whitePuff03")
            .setScale(0.5)
            .play("puff");
    }

    updatePhase3(time, delta, dt) {
        // Independent player-centered trap every 2 seconds
        if (this.phase3LastPlayerTrap === 0) {
            this.phase3LastPlayerTrap = time;
        }

        if (time > this.phase3LastPlayerTrap + this.PHASE3_TRAP_INTERVAL) {
            this.firePlayerCenteredAttack();
            this.phase3LastPlayerTrap = time;
        }

        // Boss teleport attack loop
        if (this.phase3State === "teleporting") {
            this.phase3Teleport();

            // After teleport, randomly choose one of two attacks
            if (Math.random() < 0.5) {
                this.phase3TeleportAttackType = "fan";
                this.fanSequenceStep = 0;
                this.fanLastShot = time - this.PHASE3_FAN_DELAY;
                this.fanSequenceComplete = false;
            } else {
                this.phase3TeleportAttackType = "explodingFan";
                this.fireExplodingFan();
            }

            this.phase3State = "attacking";

        } else if (this.phase3State === "attacking") {
            if (this.phase3TeleportAttackType === "fan") {
                let fanCounts = [7, 8, 9];

                if (this.fanSequenceStep < fanCounts.length &&
                    time > this.fanLastShot + this.PHASE3_FAN_DELAY) {

                    this.firePhase3Fan(fanCounts[this.fanSequenceStep]);
                    this.fanLastShot = time;
                    this.fanSequenceStep++;
                }

                // Do not wait until bullets leave screen.
                // After the three waves are fired, go to short cooldown.
                if (this.fanSequenceStep >= fanCounts.length) {
                    this.phase3State = "cooldown";
                    this.phase3StateTimer = this.PHASE3_AFTER_ATTACK_WAIT;
                }

            } else if (this.phase3TeleportAttackType === "explodingFan") {
                // After firing the 3 exploding bullets, only wait briefly before next teleport.
                this.phase3State = "cooldown";
                this.phase3StateTimer = this.PHASE3_AFTER_ATTACK_WAIT;
            }

        } else if (this.phase3State === "cooldown") {
            this.phase3StateTimer -= delta;

            if (this.phase3StateTimer <= 0) {
                this.phase3State = "teleporting";
            }
        }
    }

    startPhase3Attack(type, time) {
        if (type === "playerCentered") {
            this.firePlayerCenteredAttack();
            this.phase3AttackType = "playerCentered";
            this.phase3AttackTimer = 1500;
        } else if (type === "fanAttack") {
            this.fanSequenceStep = 0;
            this.fanLastShot = time;
            this.fanSequenceComplete = false;
            this.phase3AttackType = "fanAttack";
        } else if (type === "explodingFan") {
            this.fireExplodingFan();
            this.explodingFanComplete = false;
            this.phase3AttackType = "explodingFan";
        }
    }

    updatePhase3Attack(time, delta, dt) {
        if (this.phase3AttackType === "playerCentered") {
            this.phase3AttackTimer -= delta;
            if (this.phase3AttackTimer <= 0) {
                this.phase3State = "cooldown";
                this.phase3StateTimer = 500;
            }
        } else if (this.phase3AttackType === "fanAttack") {
            if (!this.fanSequenceComplete) {
                let fanCounts = [8, 7, 8];
                let fanDelay = 400;
                if (this.fanSequenceStep < 3 && time > this.fanLastShot + fanDelay) {
                    this.firePhase3Fan(fanCounts[this.fanSequenceStep]);
                    this.fanLastShot = time;
                    this.fanSequenceStep++;
                    if (this.fanSequenceStep >= 3) {
                        this.fanSequenceComplete = true;
                    }
                }
            }
            if (this.fanSequenceComplete && this.fanBullets.length === 0) {
                this.phase3State = "cooldown";
                this.phase3StateTimer = 500;
            }
        } else if (this.phase3AttackType === "explodingFan") {
            if (this.explodingFanComplete && this.explodingFanBullets.length === 0 && this.miniBullets.length === 0) {
                this.phase3State = "cooldown";
                this.phase3StateTimer = 500;
            }
        }
    }

    // --- Player-Centered Attack ---
    firePlayerCenteredAttack() {
        let playerX = this.scene.my.sprite.Alice.x;
        let playerY = this.scene.my.sprite.Alice.y;
        let radius = this.PHASE3_TRAP_RADIUS;

        for (let i = 0; i < 5; i++) {
            let angle = (i / 5) * Math.PI * 2;
            let spawnX = playerX + Math.cos(angle) * radius;
            let spawnY = playerY + Math.sin(angle) * radius;

            let bullet = this.scene.add.sprite(spawnX, spawnY, "enemyBullet_diamonds");
            bullet.setScale(this.PHASE3_TRAP_BULLET_SCALE);
            bullet.setTint(0xff8800);

            bullet.pcState = "waiting";
            bullet.waitTimer = this.PHASE3_TRAP_WAIT;
            bullet.centerTargetX = playerX;
            bullet.centerTargetY = playerY;
            bullet.speed = this.PHASE3_TRAP_BULLET_SPEED;
            bullet.dirX = 0;
            bullet.dirY = 0;

            this.playerCenteredBullets.push(bullet);
        }
    }

    updatePlayerCenteredBullets(dt, delta) {
        for (let i = this.playerCenteredBullets.length - 1; i >= 0; i--) {
            let bullet = this.playerCenteredBullets[i];
            if (bullet.pcState === "waiting") {
                bullet.waitTimer -= delta;
                if (bullet.waitTimer <= 0) {
                    bullet.pcState = "moving";
                    let dx = bullet.centerTargetX - bullet.x;
                    let dy = bullet.centerTargetY - bullet.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist > 0) {
                        bullet.dirX = dx / dist;
                        bullet.dirY = dy / dist;
                    } else {
                        bullet.dirX = 0;
                        bullet.dirY = 1;
                    }
                }
            } else if (bullet.pcState === "moving") {
                bullet.x += bullet.dirX * bullet.speed * dt;
                bullet.y += bullet.dirY * bullet.speed * dt;
            }
            let w = this.scene.game.config.width;
            let h = this.scene.game.config.height;
            if (bullet.pcState === "moving" &&
                (bullet.x < -bullet.displayWidth || bullet.x > w + bullet.displayWidth ||
                 bullet.y < -bullet.displayHeight || bullet.y > h + bullet.displayHeight)) {
                bullet.destroy();
                this.playerCenteredBullets.splice(i, 1);
            }
        }
    }

    // --- Fan Attack (Type 1) ---
    firePhase3Fan(count) {
        let w = this.scene.game.config.width;

        // If boss is on the left, shoot down-right.
        // If boss is on the right, shoot down-left.
        let onLeftSide = this.sprite.x < w / 2;

        let baseAngle;
        if (onLeftSide) {
            baseAngle = Math.PI / 4;       // down-right
        } else {
            baseAngle = Math.PI * 3 / 4;   // down-left
        }

        let spreadAngle = Math.PI / 2; // 90 degree fan

        for (let i = 0; i < count; i++) {
            let angle;

            if (count === 1) {
                angle = baseAngle;
            } else {
                angle = baseAngle - spreadAngle / 2 + (i / (count - 1)) * spreadAngle;
            }

            let bullet = this.scene.add.sprite(
                this.sprite.x,
                this.sprite.y,
                "enemyBullet_hearts"
            );

            bullet.setScale(0.55);
            bullet.setTint(0xff4444);
            bullet.speed = 260;
            bullet.dirX = Math.cos(angle);
            bullet.dirY = Math.sin(angle);
            bullet.isFanBullet = true;

            this.fanBullets.push(bullet);
        }
    }

    updateFanBullets(dt) {
        for (let i = this.fanBullets.length - 1; i >= 0; i--) {
            let bullet = this.fanBullets[i];
            bullet.x += bullet.dirX * bullet.speed * dt;
            bullet.y += bullet.dirY * bullet.speed * dt;
            let w = this.scene.game.config.width;
            let h = this.scene.game.config.height;
            if (bullet.x < -bullet.displayWidth || bullet.x > w + bullet.displayWidth ||
                bullet.y < -bullet.displayHeight || bullet.y > h + bullet.displayHeight) {
                bullet.destroy();
                this.fanBullets.splice(i, 1);
            }
        }
    }

    // --- Exploding Fan (Type 2) ---
    fireExplodingFan() {
        this.explodingFanComplete = false;
        this.explodingFanExplodedCount = 0;

        let w = this.scene.game.config.width;
        let onLeftSide = this.sprite.x < w / 2;

        // If boss is on the left, shoot down-right.
        // If boss is on the right, shoot down-left.
        let baseAngle;
        if (onLeftSide) {
            baseAngle = Math.PI / 4;       // down-right
        } else {
            baseAngle = Math.PI * 3 / 4;   // down-left
        }

        let spread = Math.PI / 8; // small spread around diagonal direction

        for (let i = 0; i < 3; i++) {
            let angle;

            if (i === 1) {
                angle = baseAngle;
            } else if (i === 0) {
                angle = baseAngle - spread;
            } else {
                angle = baseAngle + spread;
            }

            let bullet = this.scene.add.sprite(
                this.sprite.x,
                this.sprite.y,
                "enemyBullet_diamonds"
            );

            bullet.setScale(1.8);
            bullet.setTint(0xff66cc);

            bullet.speed = 230;
            bullet.dirX = Math.cos(angle);
            bullet.dirY = Math.sin(angle);

            bullet.travelDist = 0;
            bullet.explodeDist = 220;
            bullet.hasExploded = false;
            bullet.isExplodingFanBullet = true;

            this.explodingFanBullets.push(bullet);
        }
    }

    updateExplodingFanBullets(dt, delta) {
        for (let i = this.explodingFanBullets.length - 1; i >= 0; i--) {
            let bullet = this.explodingFanBullets[i];
            if (bullet.hasExploded) {
                bullet.destroy();
                this.explodingFanBullets.splice(i, 1);
                continue;
            }
            bullet.x += bullet.dirX * bullet.speed * dt;
            bullet.y += bullet.dirY * bullet.speed * dt;
            bullet.travelDist += bullet.speed * dt;
            if (bullet.travelDist >= bullet.explodeDist) {
                this.explodeFanBullet(bullet);
                bullet.hasExploded = true;
            }
        }
    }

    explodeFanBullet(bullet) {
        this.scene.add.sprite(bullet.x, bullet.y, "whitePuff03").setScale(0.3).play("puff");
        this.explodingFanExplodedCount++;
        if (this.explodingFanExplodedCount >= 3) {
            this.explodingFanComplete = true;
        }

        for (let j = 0; j < 6; j++) {
            let angle = (j / 6) * Math.PI * 2;
            let mini = this.scene.add.sprite(bullet.x, bullet.y, "enemyBullet_hearts");
            mini.setScale(0.4);
            mini.setTint(0xff88cc);
            mini.speed = 200;
            mini.dirX = Math.cos(angle);
            mini.dirY = Math.sin(angle);
            mini.isMiniBullet = true;
            this.miniBullets.push(mini);
        }
    }

    updateMiniBullets(dt) {
        for (let i = this.miniBullets.length - 1; i >= 0; i--) {
            let bullet = this.miniBullets[i];
            bullet.x += bullet.dirX * bullet.speed * dt;
            bullet.y += bullet.dirY * bullet.speed * dt;
            let w = this.scene.game.config.width;
            let h = this.scene.game.config.height;
            if (bullet.x < -bullet.displayWidth || bullet.x > w + bullet.displayWidth ||
                bullet.y < -bullet.displayHeight || bullet.y > h + bullet.displayHeight) {
                bullet.destroy();
                this.miniBullets.splice(i, 1);
            }
        }
    }

    cleanup() {
        for (let b of this.spiralBullets) b.destroy();
        this.spiralBullets = [];
        for (let b of this.giantBullets) b.destroy();
        this.giantBullets = [];
        for (let b of this.clubSweepBullets) b.destroy();
        this.clubSweepBullets = [];
        for (let b of this.playerCenteredBullets) b.destroy();
        this.playerCenteredBullets = [];
        for (let b of this.fanBullets) b.destroy();
        this.fanBullets = [];
        for (let b of this.explodingFanBullets) b.destroy();
        this.explodingFanBullets = [];
        for (let b of this.miniBullets) b.destroy();
        this.miniBullets = [];
    }
}
