class TitleScreen extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("titleBg", "escape_card_game_titlescreen.png");
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create() {
        let w = this.game.config.width;
        let h = this.game.config.height;

        this.add.image(w / 2, h / 2, "titleBg").setDisplaySize(w, h);

        let btnX = w * 0.75;
        let btnYStart = h * 0.7;
        let btnSpacing = 70;

        let startBtn = this.add.bitmapText(btnX, btnYStart, "rocketSquare", "Start Game")
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        startBtn.on("pointerover", () => { startBtn.setTint(0xffff00); });
        startBtn.on("pointerout", () => { startBtn.clearTint(); });
        startBtn.on("pointerdown", () => {
            this.scene.start("arrayBoom");
        });

        let creditBtn = this.add.bitmapText(btnX, btnYStart + btnSpacing, "rocketSquare", "Credit")
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        creditBtn.on("pointerover", () => { creditBtn.setTint(0xffff00); });
        creditBtn.on("pointerout", () => { creditBtn.clearTint(); });
        creditBtn.on("pointerdown", () => {
            this.scene.start("creditScreen");
        });

        let tutorialBtn = this.add.bitmapText(btnX, btnYStart + btnSpacing * 2, "rocketSquare", "Tutorial")
            .setOrigin(0.5).setInteractive({ useHandCursor: true });
        tutorialBtn.on("pointerover", () => { tutorialBtn.setTint(0xffff00); });
        tutorialBtn.on("pointerout", () => { tutorialBtn.clearTint(); });
        tutorialBtn.on("pointerdown", () => {
            this.scene.start("tutorialScreen");
        });
    }
}
