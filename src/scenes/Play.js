class Play extends Phaser.Scene {
    constructor() {
        super("playScene")
    }

    init(){
        this.sound.bgm = this.sound.add('loop-bgm',{
            volume:0.8,
            loop:true,
        })
    }
    

    create() {

        this.sound.bgm.play();
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        // add spaceships (x4)
        this.ship00 = new Spaceship(this, game.config.width, borderUISize*4, 'spaceship2', 0, 50).setOrigin(0, 0)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*7 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        // define keys
        //keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        // define mouses
        mouse = this.input
        // initialize score
        this.p1Score = 0
        this.highScore = parseInt(localStorage.getItem("score")) || 0
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 150
        }
        this.scoreLeft = this.add.text(borderUISize*2 + borderPadding*1, borderUISize + borderPadding*2, "score:" + this.p1Score, scoreConfig)
        //this.highscoreLeft = this.add.text(borderUISize*6 + borderPadding, borderUISize + borderPadding*2, "High:" + highScore, scoreConfig)
        this.gameClock = game.settings.gameTimer
        this.highscore = this.add.text(borderUISize*7 + borderPadding*2,borderUISize + borderPadding*2,"High:" + this.highScore, scoreConfig)
        //this.timedis = this.add.text(borderUISize*12 + borderPadding*3,borderUISize + borderPadding*2,"Time:" + this.formatTime(this.gameClock), scoreConfig)
        
        // this.timedEvent = this.time.addEvent(
        //     {
        //         delay: 1000,
        //         callback: () =>
        //         {
        //             this.gameClock -= 1000; 
        //             this.timedis.text = "Time:" +
        //                 this.formatTime(this.gameClock);
        //         },
        //         scope: this,
        //         loop: true
        //     }
        // )
        

        // GAME OVER flag
        this.gameOver = false

        // 60-second play clock
        scoreConfig.fixedWidth = 0
        
        this.clockRight = this.add.text(borderUISize*12 + borderPadding*3,borderUISize + borderPadding*2,"Time:" + game.settings.gameTimer/1000, scoreConfig)
        this.clockInterval = setInterval(myTimer, 1000)
        function myTimer() {
            game.settings.gameTimer -= 1000
        }
        

    }

    update() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }
        if(game.settings.gameTimer <= 0){
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }

        if(this.gameOver) this.time.removeAllEvents()
        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.sound.bgm.stop()
            this.scene.restart()
        }
        this.starfield.tilePositionX -= 4

        if(!this.gameOver) {
            this.clockRight.text = 'Time:' + game.settings.gameTimer/1000
            this.p1Rocket.update()
            this.ship00.update2()               // update spaceships (x3)
            this.ship01.update()               // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
        }else{
            this.clockRight.text = 'Time:' + 0 
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
            if (game.settings.easy){
                game.settings.gameTimer += 1000
            }else{
                game.settings.gameTimer += 2000
            }
            
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
            if (game.settings.easy){
                game.settings.gameTimer += 2000
            }else{
                game.settings.gameTimer += 3000
            }
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
            if (game.settings.easy){
                game.settings.gameTimer += 3000
            }else{
                game.settings.gameTimer += 4000
            }
        }
        if (this.checkCollision(this.p1Rocket, this.ship00)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship00)
            if (game.settings.easy){
                game.settings.gameTimer += 5000
            }else{
                game.settings.gameTimer += 5000
            }
        }
        if(!this.gameOver) {           
            this.p1Rocket.update()
            this.ship00.update()          // update rocket sprite
            this.ship01.update()           // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.bgm.stop()
            this.scene.start("menuScene")
        } 
    }

    // formatTime(seconds){
    //     // Minutes
    //     var minutes = Math.floor(seconds/60)
    //     // Seconds
    //     var partInSeconds = seconds%60
    //     // Adds left zeros to seconds
    //     partInSeconds = partInSeconds.toString().padStart(2,'0')
    //     // Returns formated time
    //     return `${minutes}:${partInSeconds}`
    // }
    
    
    // onEvent ()
    // {
    //     this.initialTime -= 1 // One second
    //     text.setText('Countdown:' + formatTime(this.initialTime))
    // }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true
        } else {
          return false
        }
      }

      shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')             // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
          ship.reset()                         // reset ship position
          ship.alpha = 1                       // make ship visible again
          boom.destroy()                       // remove explosion sprite
        })    
        // score add and text update
        if(!this.gameOver){
            this.p1Score += ship.points
            //this.timeScore += ship.points/10
            if(this.p1Score > this.highScore){
                this.highScore = this.p1Score
                localStorage.setItem("score", this.highScore)
                this.highscore.text = "High:" + this.highScore
            }
            this.scoreLeft.text = "score:" + this.p1Score
            //this.timedis.text = "time:" + this.timeScore
        }
        this.sound.play('sfx-explosion')          
      }

      //copy from https://phaser.discourse.group
      /*
      formatTime(ms){
        let seconds = ms/1000
        // Minutes
        let minutes = Math.floor(seconds/60);
        //seconds
        let partSeconds = seconds%60;
        // Adds left zeros to seconds
        partSeconds = partSeconds.toString().padStart(2, "0");
        // Returns formated time
        return `${minutes}:${partSeconds}`;
    }*/
}