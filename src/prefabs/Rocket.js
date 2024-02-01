// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame)

      scene.add.existing(this)
      this.isFiring = false
      this.moveSpeed = 2
      this.sfxShot = scene.sound.add('sfx-shot')
    }

    update() {
        //movement by mouse
        mouse.on("pointermove",(pointer) =>{this.x = Phaser.Math.Clamp(pointer.x, 47, 578)},this)
        
        // fire by mouse
        if(mouse.activePointer.leftButtonDown() && !this.isFiring) {
          this.isFiring = true
          this.sfxShot.play()
        }
          
          // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed
        }
    
          // reset on miss
          if (this.y <= borderUISize * 3 + borderPadding) {
            game.settings.gameTimer -= 10000
            this.isFiring = false
            this.y = game.config.height - borderUISize - borderPadding
        }
    }

    reset(){
        this.isFiring = false
        this.y = game.config.height - borderUISize - borderPadding
    }
}