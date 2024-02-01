/*************************************************************
Name: Shaoan Wang
Title: Rocket Patrol Pro Max
Time taken: 20 hours

3-Point Tier
-  Display the time remaining (in seconds) on the screen

5-Point Tier
- Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points 
- Implement mouse control for player movement and left mouse click to fire 
- Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses 

1-Point Tier
- Track a high score that persists across scenes and display it in the UI 
- Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) 
- Allow the player to control the Rocket after it's fired 

total - 21
*************************************************************/



let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config)

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyRESET, keyLEFT, keyRIGHT
let mouse

