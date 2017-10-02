var game = new Phaser.Game(
  '100%',
  '100%',
  Phaser.CANVAS,
  'Phaser Class', {
    preload: preload,
    create: create,
    update: update
  }
)

var player, monsters, cursors, txtScore, score, txtTime, time

function preload() {
  //LOAD IMAGE AND SPRITE
  game.load.spritesheet('player', './../img/dude.png', 32, 48)
  game.load.image('monster', './../img/monster.jpg')
  game.load.image('background', './../img/bg.jpg')

  //LOAD AUDIO
  game.load.audio('music', './../music/music1.mp3')
  game.load.audio('ping', './../sound/ping.mp3')
}

function create() {
  //ADD BACKGROUND
  game.add.sprite(0, 0, 'background')

  //ADD PLAYER
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player')
  game.physics.enable(player, Phaser.Physics.ARCADE)
  player.body.collideWorldBounds = true
  player.animations.add('walkDown', [0, 1, 2, 3])
  player.animations.add('walkLeft', [4, 5, 6, 7])
  player.animations.add('walkRight', [8, 9, 10, 11])
  player.animations.add('walkUp', [12, 13, 14, 15])

  //ADD MONSTER
  monsters = game.add.group()
  for (var i = 0; i < 10; i++) {
    var randomX = game.world.randomX
    var randomY = game.world.randomY
    var m = monsters.create(randomX, randomY, 'monster')
    var text = game.add.text(randomX+10, randomY+10, i+1, {font: '25px arial', fill: '#fff'})
    m.theName = text
    game.physics.enable(m, Phaser.Physics.ARCADE)
    m.body.collideWorldBounds = true
  }

  //ADD SCORE
  score = 0
  txtScore = game.add.text(10, 10, `Score: ${score}`, {font: '25px Arial', fill: '#bddb28'})
  txtScore.fixedToCamera = true

  //ADD CURSOR
  cursors = game.input.keyboard.createCursorKeys()

  //ADD AUDIO
  var music = game.sound.play('music')
  music.volume = 1
  music.loopFull()

  game.world.resize(2000, 2000)

  //ADD CAMERA
  game.camera.follow(player)

  //ADD TIME
  time = 0
  txtTime = game.add.text(10, 800, time, {font: '25px Arial', fill: '#bddb28'})
  txtTime.fixedToCamera = true
}

function update() {
  if(cursors.left.isDown) {
    player.animations.play('walkLeft', 5, true)
    player.x -= 2
  } else if(cursors.right.isDown) {
    player.animations.play('walkRight', 5, true)
    player.x += 2
  } else if(cursors.up.isDown) {
    player.animations.play('walkUp', 5, true)
    player.y -= 2
  } else if (cursors.down.isDown) {
    player.animations.play('walkDown', 5, true)
    player.y += 2
  } else {
    player.animations.stop()
  }

  game.physics.arcade.overlap(player, monsters, hitMonster)

  if (score !== 10)
  time += 0.01
  txtTime.setText(`Time: ${Math.round(time)}`)
}

function hitMonster(player, monster) {
  if ((score+1).toString() === monster.theName.text) {
    score++
    txtScore.setText(`Score: ${score}`)
    game.sound.play('ping')
    monster.theName.destroy()
    monsters.remove(monster)
  }
}
