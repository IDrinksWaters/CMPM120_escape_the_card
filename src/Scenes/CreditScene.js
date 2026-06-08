class CreditScene extends Phaser.Scene {
    constructor() {
        super("creditScreen");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let w = this.game.config.width;
        let h = this.game.config.height;

        let container = this.add.container(0, h);

        container.add(this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.9));

        container.add(this.add.bitmapText(w / 2, h * 0.3, "rocketSquare", "Credits")
            .setOrigin(0.5).setScale(1.5));

        let credits = [
            "Gongjue Sun - player upgrades and ultimate abilities",
            "Yiting Lin - Elite enemy types, attack / movement pattern",
            "Max Lui - Final Boss and UI implementation"
        ];

        let startY = h * 0.4;
        let lineSpacing = 40;
        for (let i = 0; i < credits.length; i++) {
            container.add(this.add.text(w / 2, startY + i * lineSpacing, credits[i], {
                fontFamily: "Arial",
                fontSize: "20px",
                color: "#ffffff",
                align: "center"
            }).setOrigin(0.5));
        }

        container.add(this.add.bitmapText(w / 2, h * 0.82, "rocketSquare", "Press Q to return to Title")
            .setOrigin(0.5).setScale(0.7).setTint(0xaaaaaa));

        container.add(this.add.bitmapText(w / 2, h * 0.87, "rocketSquare", "Press R to Restart")
            .setOrigin(0.5).setScale(0.7).setTint(0xaaaaaa));

        this.tweens.add({
            targets: container,
            y: 0,
            duration: 1500,
            ease: "Power2"
        });

        this.qKey = this.input.keyboard.addKey("Q");
        this.rKey = this.input.keyboard.addKey("R");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
            this.scene.start("titleScreen");
        }
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("arrayBoom");
        }
    }
}
