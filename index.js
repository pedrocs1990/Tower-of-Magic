const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Tamaño del canvas
canvas.width = 800
canvas.height = 700

const CAMERA_UPPER_LIMIT_PERCENTAGE = 0.35
const CAMERA_LOWER_LIMIT_PERCENTAGE = 0.75
const CAMERA_VELOCITY = 0.05

// Suelo
const floor = {
  x: 0,
  y: 700,
  width: canvas.width,
  height: 145
}

// Personaje
const player = {
  x: 50, // Posición horizontal
  y: 630, // Posición vertical
  width: 30, // Ancho del personaje
  height: 30, // Alto del personaje
  color: 'red', // Color del personaje
  speed: 2, // Velocidad de movimiento
  velocityY: 0, // Velocidad vertical para la gravedad
  gravity: 0.5, // Fuerza de gravedad
  jumpForce: -12, // Fuerza de salto
  direction: 1, // 1 derecha, -1 izquierda
  lifes: 3,
  hit: false,
  velocityHitX: 0,
  invulnerableTimer: 0
}

// Enemigos
let enemies = [
  { // altura 1
    x: 200,
    y: 570, // encima de la plataforma de y=600
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: 1, // 1 derecha, -1 izquierda
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  },
  { // altura 2
    x: 500,
    y: 470,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: -1,
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  },
  { // altura 2
    x: 200,
    y: 470,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: 1,
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  },
  { // altura 4
    x: 200,
    y: 320,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: 1,
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  },
  { // altura 6
    x: 650,
    y: 170,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: 1,
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  },
  { // altura 6
    x: 50,
    y: 170,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: 1,
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  },
  { // altura 7
    x: 200,
    y: 50,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 1,
    direction: 1,
    changeDirectionTimer: 0,
    hit: false,
    velocityX: 0,
    velocityY: 0
  }
]

const boss = {
  x: 375,
  y: -370,
  width: 50,
  height: 50,
  color: 'purple',
  speed: 1.5,
  active: false,
  shootTimer: 0,
  shootInterval: 90,
  state: 'attacking',
  energy: 100,
  maxEnergy: 100,
  lifes: 3,
  maxLifes: 3,
  attackDuration: 20000,
  stunDuration: 5000,
  stateStartTime: 0,
  hit: false,
  invulnerableTimer: 0,
  ascending: false,
  targetY: -370,
  ascentSpeed: 1,
  defeated: false,
  defeatTargetY: 0,
  opacity: 1,
  defeatSpeed: 0.5,
  fadeSpeed: 0.008
}

const initialEnemies = structuredClone(enemies)

// Plataforma
const platforms = [
  { // altura 1 plataforma 1
    x: 130, // Posición horizontal
    y: 600, // Posición vertical
    width: 540, // Ancho de la plataforma
    height: 20 // Alto de la plataforma
  },
  { // altura 2 plataforma 1
    x: 50,
    y: 500,
    width: 300,
    height: 20
  },
  { // altura 2 plataforma 2
    x: 450,
    y: 500,
    width: 300,
    height: 20
  },
  { // altura 3 plataforma 1
    x: 0,
    y: 400,
    width: 100,
    height: 20
  },
  { // altura 3 plataforma 2
    x: 700,
    y: 400,
    width: 100,
    height: 20
  },
  { // altura 4 plataforma 1
    x: 180,
    y: 350,
    width: 440,
    height: 20
  },
  { // altura 5 plataforma 1
    x: 300,
    y: 250,
    width: 200,
    height: 20
  },
  { // altura 6 plataforma 1
    x: 0,
    y: 200,
    width: 250,
    height: 20
  },
  { // altura 6 plataforma 
    x: 550,
    y: 200,
    width: 250,
    height: 20
  },
  { // altura 7 plataforma 1
    x: 70,
    y: 80,
    width: 660,
    height: 20
  },
  { // altura 8 plataforma 1
    x: 0,
    y: -120,
    width: 375,
    height: 20
  },
  { // altura 8 plataforma 2
    x: 425,
    y: -120,
    width: 375,
    height: 20
  },
  { // altura 9 plataforma 1
    x: 0,
    y: -320,
    width: 50,
    height: 20
  },
  { // altura 9 plataforma 2
    x: 100,
    y: -320,
    width: 600,
    height: 20
  },
  { // altura 9 plataforma 3
    x: 750,
    y: -320,
    width: 50,
    height: 20
  },
  { // altura 10 plataforma 1
    x: 0,
    y: -520,
    width: 375,
    height: 20
  },
  { // altura 10 plataforma 2
    x: 425,
    y: -520,
    width: 375,
    height: 20
  },
  { // altura 11 plataforma 1
    x: 0,
    y: -720,
    width: 50,
    height: 20
  },
  { // altura 11 plataforma 2
    x: 100,
    y: -720,
    width: 600,
    height: 20
  },
  { // altura 11 plataforma 3
    x: 750,
    y: -720,
    width: 50,
    height: 20
  }

]
const platform8Left = platforms[10]
const platform8Right = platforms[11]
const bossLeftLimit = 0
const bossRightLimit = canvas.width

const stairs = [
  { // altura 1 stairs 1
    x: 375,
    y: -150,
    width: 50,
    height: 230
  },
  { // altura 2 stairs 1
    x: 50,
    y: -350,
    width: 50,
    height: 230
  },
  { // altura 2 stairs 2
    x: 700,
    y: -350,
    width: 50,
    height: 230
  },
  { // altura 3 stairs 1
    x: 375,
    y: -550,
    width: 50,
    height: 230
  },
  { // altura 4 stairs 1
    x: 50,
    y: -750,
    width: 50,
    height: 230
  },
  { // altura 4 stairs 2
    x: 700,
    y: -750,
    width: 50,
    height: 230
  }
]

const forceFields = [
  {
    level: 8,
    x: 375,
    y: -120,
    width: 50,
    height: 12,
    active: true
  },
  {
    level: 9,
    x: 50,
    y: -320,
    width: 50,
    height: 12,
    active: true
  },
  {
    level: 9,
    x: 700,
    y: -320,
    width: 50,
    height: 12,
    active: true
  },
  {
    level: 10,
    x: 375,
    y: -520,
    width: 50,
    height: 12,
    active: true
  },
  {
    level: 11,
    x: 50,
    y: -720,
    width: 50,
    height: 12,
    active: true
  },
  {
    level: 11,
    x: 700,
    y: -720,
    width: 50,
    height: 12,
    active: true
  },
]

// detectar si personaje o enemigo está en plataforma
function getPlatformUnder(character) {
  for (const platform of platforms) {

    const characterBottom = character.y + character.height

    const isLeftOfPlatformRightEdge =
      character.x < platform.x + platform.width

    const isRightOfPlatformLeftEdge =
      character.x + character.width > platform.x

    const isStandingOnPlatform =
      Math.abs(characterBottom - platform.y) < 5

    if (
      isLeftOfPlatformRightEdge &&
      isRightOfPlatformLeftEdge &&
      isStandingOnPlatform
    ) {
      return platform
    }
  }

  return null
}

// Variable para controlar el estado de las teclas
let leftPressed = false
let rightPressed = false
let upPressed = false
let downPressed = false

let onStairs = false

// Detectar salto
let canJump = false

// Movimiento de camara
let cameraY = 0

// Game Over
let gameOver = false
const gameOverText = {
  y: -150,
  targetY: canvas.height / 2,
  velocityY: 0,
  gravity: 0.25,
  bounce: 0.65
}
const retryButton = {
  x: canvas.width / 2 - 120,
  y: canvas.height / 2 + 80,
  width: 240,
  height: 60
}

// Game Win
let gameWon = false
const victoryButton = {
  x: canvas.width / 2 - 120,
  y: canvas.height / 2 + 110,
  width: 240,
  height: 60
}

//Disparo
const shots = []
const bossShots = []

const heartImage = new Image()
heartImage.src = 'Imagenes/heart.png'
const backgrounImage = new Image()
backgrounImage.src = 'Imagenes/fondo.png'
const floorImage = new Image()
floorImage.src = 'Imagenes/suelo-castillo.png'
const platformImage = new Image()
platformImage.src = 'Imagenes/plataforma.png'
const stairsImage = new Image()
stairsImage.src = 'Imagenes/escalera.png'
const greenHeartImage = new Image()
greenHeartImage.src = 'Imagenes/boss-heart.png'

// Detectar teclas presionadas
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    leftPressed = true
  }

  if (event.key === "ArrowRight") {
    rightPressed = true
  }

  if (event.key === "ArrowUp") {
    upPressed = true

    // Saltar si no hay escalera
    if (canJump && !onStairs) {
      player.velocityY = player.jumpForce
      canJump = false
    }
  }

  if (event.key === "ArrowDown") {
    downPressed = true
  }

  if (event.code === "Space" && !gameOver && !gameWon) {
    shots.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      width: 12,
      height: 12,
      speed: 3,
      direction: player.direction,
      color: 'gold',
      distance: 0,
      maxDistance: 150,
      remove: false
    })
  }
})

// Detectar teclas liberadas
document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    leftPressed = false
  }

  if (event.key === "ArrowRight") {
    rightPressed = false
  }

  if (event.key === "ArrowUp") {
    upPressed = false
  }

  if (event.key === "ArrowDown") {
    downPressed = false
  }
})

// Botón retry y victory
canvas.addEventListener('click', (event) => {

  if (!gameOver && !gameWon) {
    return
  }

  const rect = canvas.getBoundingClientRect()

  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  let button = retryButton

  if (gameWon) {
    button = victoryButton
  }

  const insideButton =
    mouseX >= button.x &&
    mouseX <= button.x + button.width &&
    mouseY >= button.y &&
    mouseY <= button.y + button.height

  if (insideButton) {
    restartGame()
  }
})

function update() {

  if (gameOver) {

    gameOverText.velocityY += gameOverText.gravity

    gameOverText.y += gameOverText.velocityY

    if (gameOverText.y >= gameOverText.targetY) {

      gameOverText.y = gameOverText.targetY

      gameOverText.velocityY =
        -gameOverText.velocityY * gameOverText.bounce

      if (Math.abs(gameOverText.velocityY) < 0.3) {
        gameOverText.velocityY = 0
      }

    }

    return
  }

  if (gameWon) {
    return
  }

  onStairs = false

  stairs.forEach(stair => {

    const isLeftOfStairRightEdge = player.x < stair.x + stair.width
    const isRightOfStairLeftEdge = player.x + player.width > stair.x
    const isAboveStairBottomEdge = player.y < stair.y + stair.height
    const isBelowStairTopEdge = player.y + player.height > stair.y

    if (
      isLeftOfStairRightEdge &&
      isRightOfStairLeftEdge &&
      isAboveStairBottomEdge &&
      isBelowStairTopEdge
    ) {
      onStairs = true
    }
  })

  const previousX = player.x
  const previousY = player.y

  // MOVIMIENTO HORIZONTAL

  if (leftPressed) {
    player.x -= player.speed
    player.direction = -1
  }

  if (rightPressed) {
    player.x += player.speed
    player.direction = 1
  }

  // Colisión horizontal
  platforms.forEach(platform => {

    const isLeftOfPlatformRightEdge = player.x < platform.x + platform.width
    const isRightOfPlatformLeftEdge = player.x + player.width > platform.x
    const isAbovePlatformBottomEdge = player.y < platform.y + platform.height
    const isBelowPlatformTopEdge = player.y + player.height > platform.y

    if (
      isLeftOfPlatformRightEdge &&
      isRightOfPlatformLeftEdge &&
      isAbovePlatformBottomEdge &&
      isBelowPlatformTopEdge
    ) {

      const playerWasLeftOfPlatform = previousX + player.width <= platform.x
      const playerWasRightOfPlatform = previousX >= platform.x + platform.width

      // izquierda
      if (playerWasLeftOfPlatform) {
        player.x = platform.x - player.width
      }

      // derecha
      else if (playerWasRightOfPlatform) {
        player.x = platform.x + platform.width
      }
    }
  })

  // Bordes pantalla

  const isOutsideLeftBorder = player.x < 0
  const isOutsideRightBorder = player.x + player.width > canvas.width

  if (isOutsideLeftBorder) {
    player.x = 0
  }

  if (isOutsideRightBorder) {
    player.x = canvas.width - player.width
  }

  // MOVIMIENTO VERTICAL

  if (onStairs) {
    player.velocityY = 0

    if (upPressed) {
      player.y -= player.speed
    }

    if (downPressed) {
      player.y += player.speed
    }
  } else {
    player.velocityY += player.gravity
    player.y += player.velocityY
  }

  // Colisión del jugador con campos de fuerza
  forceFields.forEach((forceField) => {

    if (!forceField.active) {
      return
    }

    const collision =
      player.x < forceField.x + forceField.width &&
      player.x + player.width > forceField.x &&
      player.y < forceField.y + forceField.height &&
      player.y + player.height > forceField.y

    const playerWasBelowForceField =
      previousY >= forceField.y + forceField.height

    if (collision && playerWasBelowForceField) {
      player.y = forceField.y + forceField.height
      player.velocityY = 0
    }

  })

  // Reiniciamos cada frame
  canJump = false

  // Retroceso e invulnerabilidad
  if (player.hit) {

    player.x += player.velocityHitX

    player.velocityHitX *= 0.95
    player.invulnerableTimer--

    if (player.invulnerableTimer <= 0) {
      player.hit = false
      player.velocityHitX = 0
      player.invulnerableTimer = 0
    }

  }

  // Colisión vertical
  platforms.forEach(platform => {

    const isLeftOfPlatformRightEdge = player.x < platform.x + platform.width
    const isRightOfPlatformLeftEdge = player.x + player.width > platform.x
    const isAbovePlatformBottomEdge = player.y < platform.y + platform.height
    const isBelowPlatformTopEdge = player.y + player.height > platform.y

    if (
      isLeftOfPlatformRightEdge &&
      isRightOfPlatformLeftEdge &&
      isAbovePlatformBottomEdge &&
      isBelowPlatformTopEdge
    ) {

      const landedOnPlatform = previousY + player.height <= platform.y
      const hitPlatformFromBelow = previousY >= platform.y + platform.height

      //aterrizar
      if (landedOnPlatform) {
        player.y = platform.y - player.height
        player.velocityY = 0
        canJump = true
      }

      // golpear abajo
      else if (hitPlatformFromBelow) {
        player.y = platform.y + platform.height
        player.velocityY = 0
      }
    }
  })

  // Suelo
  const isBelowFloor = player.y + player.height > canvas.height

  if (isBelowFloor) {
    player.y = canvas.height - player.height
    player.velocityY = 0
    canJump = true
  }

  // Movimiento de camara
  const cameraUpperLimit = canvas.height * CAMERA_UPPER_LIMIT_PERCENTAGE
  const cameraLowerLimit = canvas.height * CAMERA_LOWER_LIMIT_PERCENTAGE

  const playerScreenY = player.y - cameraY

  let targetCameraY = cameraY

  const isAboveCameraUpperLimit = playerScreenY < cameraUpperLimit
  const isBelowCameraLowerLimit = playerScreenY > cameraLowerLimit

  if (isAboveCameraUpperLimit) {
    targetCameraY = player.y - cameraUpperLimit
  }
  else if (isBelowCameraLowerLimit) {
    targetCameraY = player.y - cameraLowerLimit
  }

  cameraY += (targetCameraY - cameraY) * CAMERA_VELOCITY

  const playerPlatform = getPlatformUnder(player)

  const playerIsOnPlatform8 =
    playerPlatform === platform8Left || playerPlatform === platform8Right

  if (playerIsOnPlatform8 && !boss.active && !boss.defeated) {
    boss.active = true
    boss.state = 'attacking'
    boss.energy = boss.maxEnergy
    boss.stateStartTime = performance.now()
    boss.shootTimer = 0
  }

  if (boss.active && !boss.defeated) {
    const currentTime = performance.now()

    if (boss.ascending) {

      // El boss sube
      boss.y -= boss.ascentSpeed

      // Comprobar si ya ha llegado
      if (boss.y <= boss.targetY) {
        boss.y = boss.targetY
        boss.ascending = false

        // Empieza un nuevo ciclo de ataque
        boss.state = 'attacking'
        boss.energy = boss.maxEnergy
        boss.stateStartTime = currentTime
        boss.shootTimer = 0
      }

    } else {

      const elapsedTime =
        currentTime - boss.stateStartTime

      if (boss.state === 'attacking') {

        // Movimiento horizontal del boss
        if (player.x < boss.x) {
          boss.x -= boss.speed
        }

        if (player.x > boss.x) {
          boss.x += boss.speed
        }

        // Límites horizontales
        if (boss.x < bossLeftLimit) {
          boss.x = bossLeftLimit
        }

        if (boss.x + boss.width > bossRightLimit) {
          boss.x = bossRightLimit - boss.width
        }

        // Vaciar energía
        const attackProgress =
          elapsedTime / boss.attackDuration

        boss.energy =
          boss.maxEnergy -
          boss.maxEnergy * attackProgress

        if (boss.energy < 0) {
          boss.energy = 0
        }

        // Disparos
        boss.shootTimer--

        if (boss.shootTimer <= 0) {
          bossShots.push({
            x: boss.x + boss.width / 2 - 6,
            y: boss.y + boss.height,
            width: 12,
            height: 18,
            speed: 4,
            color: 'red',
            remove: false
          })

          boss.shootTimer = boss.shootInterval
        }

        if (elapsedTime >= boss.attackDuration) {
          boss.state = 'stunned'
          boss.energy = 0
          boss.stateStartTime = currentTime
        }

      } else if (boss.state === 'stunned') {

        const stunProgress =
          elapsedTime / boss.stunDuration

        boss.energy =
          boss.maxEnergy * stunProgress

        if (boss.energy > boss.maxEnergy) {
          boss.energy = boss.maxEnergy
        }

        if (elapsedTime >= boss.stunDuration) {
          boss.state = 'attacking'
          boss.energy = boss.maxEnergy
          boss.stateStartTime = currentTime
          boss.shootTimer = 0
        }
      }
    }
  }

  // Invulnerabilidad del boss
  if (boss.hit) {
    boss.invulnerableTimer--

    if (boss.invulnerableTimer <= 0) {
      boss.hit = false
      boss.invulnerableTimer = 0
    }
  }

  // Animación de derrota del boss
  if (boss.defeated) {

    if (boss.y > boss.defeatTargetY) {
      boss.y -= boss.defeatSpeed
    }

    boss.opacity -= boss.fadeSpeed

    if (boss.opacity < 0) {
      boss.opacity = 0
    }

    if (
      boss.y <= boss.defeatTargetY &&
      boss.opacity <= 0
    ) {
      gameWon = true
    }
  }

  // Actualizar campos de fuerza
  const allEnemiesDefeated =
    enemies.every((enemy) => {
      return enemy.hit
    })

  forceFields.forEach((forceField) => {

    if (!forceField.active) {
      return
    }

    if (forceField.level === 8) {
      if (allEnemiesDefeated) {
        forceField.active = false
      }
    }

    if (forceField.level === 9) {
      const canPass =
        boss.active &&
        boss.state === 'stunned' &&
        boss.lifes === 3

      if (canPass) {
        forceField.active = false
      }
    }

    if (forceField.level === 10) {
      const canPass =
        boss.active &&
        boss.state === 'stunned' &&
        boss.lifes === 2

      if (canPass) {
        forceField.active = false
      }
    }

    if (forceField.level === 11) {
      const canPass =
        boss.active &&
        boss.state === 'stunned' &&
        boss.lifes === 1

      if (canPass) {
        forceField.active = false
      }
    }

  })

  enemies.forEach(enemy => {

    if (enemy.hit) {
      enemy.x += enemy.velocityX
      enemy.y += enemy.velocityY
      enemy.velocityY += 0.4

      return
    }

    const enemyPlatform = getPlatformUnder(enemy)
    const playerPlatform = getPlatformUnder(player)

    const samePlatform =
      enemyPlatform &&
      playerPlatform &&
      enemyPlatform === playerPlatform

    if (samePlatform) {

      // Perseguir jugador

      if (player.x < enemy.x) {
        enemy.x -= enemy.speed
      }
      else if (player.x > enemy.x) {
        enemy.x += enemy.speed
      }

    } else {

      // Movimiento aleatorio

      enemy.changeDirectionTimer -= 1

      if (enemy.changeDirectionTimer <= 0) {

        enemy.direction =
          Math.random() < 0.5 ? -1 : 1

        enemy.changeDirectionTimer =
          60 + Math.random() * 180
      }

      enemy.x += enemy.direction * enemy.speed
    }

    // Mantener enemigo dentro de la plataforma
    if (enemyPlatform) {

      if (enemy.x < enemyPlatform.x) {
        enemy.x = enemyPlatform.x
        enemy.direction = 1
      }

      if (
        enemy.x + enemy.width >
        enemyPlatform.x + enemyPlatform.width
      ) {
        enemy.x =
          enemyPlatform.x +
          enemyPlatform.width -
          enemy.width

        enemy.direction = -1
      }
    }

    // Colision enemigo con jugador
    const collision =
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y

    if (collision && !player.hit) {
      player.lifes--

      if (player.lifes <= 0) {
        player.lifes = 0
        gameOver = true
        gameOverText.y = -150
        gameOverText.velocityY = 0
        return
      }

      player.hit = true
      player.velocityY = -8

      if (player.x < enemy.x) {
        player.velocityHitX = -4
      } else {
        player.velocityHitX = 4
      }

      player.invulnerableTimer = 120
    }

    // Colision de disparos con enemigo
    shots.forEach((shot) => {

      const collision =
        shot.x < enemy.x + enemy.width &&
        shot.x + shot.width > enemy.x &&
        shot.y < enemy.y + enemy.height &&
        shot.y + shot.height > enemy.y

      if (collision && !enemy.hit) {
        enemy.hit = true
        enemy.velocityY = -10
        enemy.velocityX = shot.direction * 5
        shot.remove = true
      }

    })

  })

  //Colision de los disparos del personaje y el boss
  shots.forEach((shot) => {

    const collision =
      shot.x < boss.x + boss.width &&
      shot.x + shot.width > boss.x &&
      shot.y < boss.y + boss.height &&
      shot.y + shot.height > boss.y

    if (collision && boss.active) {
      shot.remove = true

      if (!boss.hit && !boss.defeated) {
        boss.lifes--

        boss.hit = true
        boss.invulnerableTimer = 120

        // Pierde la primera vida
        if (boss.lifes === 2) {
          boss.ascending = true
          boss.targetY = -570
          boss.x = 200
        }

        // Pierde la segunda vida
        if (boss.lifes === 1) {
          boss.ascending = true
          boss.targetY = -770
          boss.x = 375
        }

        // Pierde la última vida
        if (boss.lifes <= 0) {
          boss.lifes = 0

          boss.defeated = true
          boss.state = 'stunned'
          boss.ascending = false
          boss.active = false

          boss.energy = 0
          boss.hit = false
          boss.invulnerableTimer = 0

          boss.defeatTargetY = boss.y - 100
          boss.opacity = 1

          bossShots.length = 0
        }
      }
    }

  })

  for (let i = enemies.length - 1; i >= 0; i--) {

    const enemy = enemies[i]

    if (
      enemy.y < cameraY - 200 ||
      enemy.x < -100 ||
      enemy.x > canvas.width + 100
    ) {
      enemies.splice(i, 1)
    }

  }

  shots.forEach((shot) => {
    shot.x += shot.speed * shot.direction
    shot.distance += shot.speed
  })

  for (let i = shots.length - 1; i >= 0; i--) {
    const shot = shots[i]

    if (shot.remove || shot.distance >= shot.maxDistance) {
      shots.splice(i, 1)
    }
  }

  bossShots.forEach((shot) => {
    shot.y += shot.speed
  })

  bossShots.forEach((shot) => {

    const collision =
      shot.x < player.x + player.width &&
      shot.x + shot.width > player.x &&
      shot.y < player.y + player.height &&
      shot.y + shot.height > player.y

    if (collision && !player.hit) {
      player.lifes -= 1

      shot.remove = true

      if (player.lifes <= 0) {
        player.lifes = 0
        gameOver = true
        gameOverText.y = -150
        gameOverText.velocityY = 0
        return
      }

      player.hit = true
      player.velocityY = -8

      if (player.x < shot.x) {
        player.velocityHitX = -4
      } else {
        player.velocityHitX = 4
      }

      player.invulnerableTimer = 120
    }

  })

  for (let i = bossShots.length - 1; i >= 0; i--) {
    const shot = bossShots[i]

    const shotScreenY = shot.y - cameraY

    if (
      shot.remove ||
      shotScreenY > canvas.height + 50
    ) {
      bossShots.splice(i, 1)
    }
  }

}

function draw() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Fondo juego
  ctx.drawImage(
    backgrounImage,
    0,
    0,
    canvas.width,
    canvas.height
  )

  // Dibujar el Game Over
  if (gameOver) {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 6

    ctx.font = 'bold 100px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.strokeText(
      'GAME OVER',
      canvas.width / 2,
      gameOverText.y
    )

    ctx.fillText(
      'GAME OVER',
      canvas.width / 2,
      gameOverText.y
    )

    ctx.fillStyle = '#444'
    ctx.fillRect(
      retryButton.x,
      retryButton.y,
      retryButton.width,
      retryButton.height
    )

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3
    ctx.strokeRect(
      retryButton.x,
      retryButton.y,
      retryButton.width,
      retryButton.height
    )

    ctx.fillStyle = 'white'
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillText(
      'Volver a intentar',
      retryButton.x + retryButton.width / 2,
      retryButton.y + retryButton.height / 2
    )

    return
  }

  // Dibujae el Gmae Won
  if (gameWon) {
    ctx.fillStyle = 'black'

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    )

    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = 'bold 42px Arial'

    ctx.fillText(
      'Enhorabuena, has acabado',
      canvas.width / 2,
      canvas.height / 2 - 100
    )

    ctx.fillText(
      'con el señor tenebroso.',
      canvas.width / 2,
      canvas.height / 2 - 45
    )

    ctx.font = 'bold 32px Arial'

    ctx.fillText(
      '¡Eres el mago más poderoso!',
      canvas.width / 2,
      canvas.height / 2 + 15
    )

    // Botón
    ctx.fillStyle = '#444'

    ctx.fillRect(
      victoryButton.x,
      victoryButton.y,
      victoryButton.width,
      victoryButton.height
    )

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 3

    ctx.strokeRect(
      victoryButton.x,
      victoryButton.y,
      victoryButton.width,
      victoryButton.height
    )

    ctx.fillStyle = 'white'
    ctx.font = 'bold 28px Arial'

    ctx.fillText(
      'Volver a jugar',
      victoryButton.x + victoryButton.width / 2,
      victoryButton.y + victoryButton.height / 2
    )

    return
  }

  // Dibujar el suelo
  ctx.drawImage(
    floorImage,
    floor.x,
    floor.y - cameraY,
    floor.width,
    floor.height
  )

  //Dibujar escaleras
  stairs.forEach((stair) => {
    ctx.drawImage(
      stairsImage,
      stair.x,
      stair.y - cameraY,
      stair.width,
      stair.height
    )
  })

  // Dibujar campos de fuerza
  forceFields.forEach((forceField) => {

    if (!forceField.active) {
      return
    }

    const forceFieldScreenY =
      forceField.y - cameraY

    ctx.fillStyle = 'rgba(0, 255, 255, 0.35)'

    ctx.fillRect(
      forceField.x,
      forceFieldScreenY,
      forceField.width,
      forceField.height
    )

    ctx.strokeStyle = 'cyan'
    ctx.lineWidth = 3

    ctx.strokeRect(
      forceField.x,
      forceFieldScreenY,
      forceField.width,
      forceField.height
    )

  })

  // Dibujar el personaje
  const visible =
    !player.hit ||
    Math.floor(player.invulnerableTimer / 5) % 2 === 0

  if (visible) {

    ctx.fillStyle = player.color

    ctx.fillRect(
      player.x,
      player.y - cameraY,
      player.width,
      player.height
    )

  }
  shots.forEach((shot) => {
    ctx.fillStyle = shot.color
    ctx.fillRect(
      shot.x,
      shot.y - cameraY,
      shot.width,
      shot.height
    )
  })

  // Dibujar enemigos
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color

    ctx.fillRect(
      enemy.x,
      enemy.y - cameraY,
      enemy.width,
      enemy.height
    )
  })

  // Dibujar el boss
  const heartSize = 18
  const heartSpacing = 22

  const totalWidth =
    (boss.lifes - 1) * heartSpacing + heartSize

  const startX =
    boss.x + boss.width / 2 - totalWidth / 2

  for (let i = 0; i < boss.lifes; i++) {

    ctx.drawImage(
      greenHeartImage,
      startX + i * heartSpacing,
      boss.y - cameraY - 45,
      heartSize,
      heartSize
    )

  }

  ctx.save()

  ctx.globalAlpha = boss.opacity
  ctx.fillStyle = boss.color

  ctx.fillRect(
    boss.x,
    boss.y - cameraY,
    boss.width,
    boss.height
  )

  ctx.restore()

  bossShots.forEach((shot) => {
    ctx.fillStyle = shot.color

    ctx.fillRect(
      shot.x,
      shot.y - cameraY,
      shot.width,
      shot.height
    )
  })

  if (boss.active) {
    const energyBarWidth = 70
    const energyBarHeight = 8

    const energyBarX =
      boss.x + boss.width / 2 - energyBarWidth / 2

    const energyBarY =
      boss.y - cameraY - 18

    const energyPercentage =
      boss.energy / boss.maxEnergy

    // Fondo de la barra
    ctx.fillStyle = 'black'

    ctx.fillRect(
      energyBarX - 2,
      energyBarY - 2,
      energyBarWidth + 4,
      energyBarHeight + 4
    )

    // Barra vacía
    ctx.fillStyle = '#555'

    ctx.fillRect(
      energyBarX,
      energyBarY,
      energyBarWidth,
      energyBarHeight
    )

    // Energía
    ctx.fillStyle =
      boss.state === 'stunned'
        ? 'cyan'
        : 'yellow'

    ctx.fillRect(
      energyBarX,
      energyBarY,
      energyBarWidth * energyPercentage,
      energyBarHeight
    )
  }

  // Dibujar la plataformas
  platforms.forEach((platform) => {
    ctx.drawImage(
      platformImage,
      platform.x,
      platform.y - cameraY,
      platform.width,
      platform.height
    )
  })

  // Dibujar vidas
  for (let i = 0; i < player.lifes; i++) {
    ctx.drawImage(
      heartImage,
      20 + i * 40,
      20,
      30,
      30
    )
  }
}

// Funcion reinicio de juego
function restartGame() {
  // estado del juego
  gameWon = false
  gameOver = false

  // Jugador
  player.x = 50
  player.y = 630
  player.direction = 1
  player.velocityY = 0
  player.velocityHitX = 0
  player.hit = false
  player.invulnerableTimer = 0
  player.lifes = 3

  // Cámara
  cameraY = 0

  // Disparos
  shots.length = 0

  // Enemigos
  enemies = structuredClone(initialEnemies)

  // Animación del Game Over
  gameOverText.y = -150
  gameOverText.velocityY = 0

  // Boss
  boss.x = 375
  boss.y = -370
  boss.active = false
  boss.state = 'attacking'
  boss.energy = boss.maxEnergy
  boss.stateStartTime = 0
  boss.shootTimer = 0
  boss.lifes = boss.maxLifes
  boss.hit = false
  boss.invulnerableTimer = 0
  bossShots.length = 0
  boss.ascending = false
  boss.targetY = -370
  boss.defeated = false
  boss.opacity = 1
  boss.defeatTargetY = 0

  // Campos de fuerza
  forceFields.forEach((forceField) => {
    forceField.active = true
  })
}

// Corazón del juego, se ejecuta muchas veces por segundo
function gameLoop() {
  update()
  draw()
  requestAnimationFrame(gameLoop) // Ejecuta el juego cada frame
}

// Iniciar juego
gameLoop()