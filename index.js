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
  height: 145,
  color: 'green'
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
  jumpForce: -12 // Fuerza de salto
}

// Plataforma
const platforms = [
  { // altura 1 plataforma 1
    x: 130, // Posición horizontal
    y: 600, // Posición vertical
    width: 540, // Ancho de la plataforma
    height: 20, // Alto de la plataforma
    color: 'brown' // Color de la plataforma
  },
  { // altura 2 plataforma 1
    x: 50,
    y: 500,
    width: 300,
    height: 20,
    color: 'brown'
  },
  { // altura 2 plataforma 2
    x: 450,
    y: 500,
    width: 300,
    height: 20,
    color: 'brown'
  },
  { // altura 3 plataforma 1
    x: 0,
    y: 400,
    width: 100,
    height: 20,
    color: 'brown'
  },
  { // altura 3 plataforma 2
    x: 700,
    y: 400,
    width: 100,
    height: 20,
    color: 'brown'
  },
  { // altura 4 plataforma 1
    x: 180,
    y: 350,
    width: 440,
    height: 20,
    color: 'brown'
  },
  { // altura 5 plataforma 1
    x: 300,
    y: 250,
    width: 200,
    height: 20,
    color: 'brown'
  },
  { // altura 6 plataforma 1
    x: 0,
    y: 200,
    width: 250,
    height: 20,
    color: 'brown'
  },
  { // altura 6 plataforma 
    x: 550,
    y: 200,
    width: 250,
    height: 20,
    color: 'brown'
  },
  { // altura 7 plataforma 1
    x: 70,
    y: 80,
    width: 660,
    height: 20,
    color: 'brown'
  },
  { // altura 8 plataforma 1
    x: 0,
    y: -120,
    width: 375,
    height: 20,
    color: 'brown'
  },
  { // altura 8 plataforma 2
    x: 425,
    y: -120,
    width: 375,
    height: 20,
    color: 'brown'
  },
  { // altura 9 plataforma 1
    x: 0,
    y: -320,
    width: 50,
    height: 20,
    color: 'brown'
  },
  { // altura 9 plataforma 2
    x: 100,
    y: -320,
    width: 600,
    height: 20,
    color: 'brown'
  },
  { // altura 9 plataforma 3
    x: 750,
    y: -320,
    width: 50,
    height: 20,
    color: 'brown'
  },
  { // altura 10
    x: 0,
    y: -520,
    width: canvas.width,
    height: 20,
    color: 'brown'
  }
]

const stairs = [
  { // stairs 1
    x: 375,
    y: -150,
    width: 50,
    height: 230,
    color: 'black'
  },
  { // stairs 2
    x: 50,
    y: -350,
    width: 50,
    height: 230,
    color: 'black'
  },
  { // stairs 3
    x: 700,
    y: -350,
    width: 50,
    height: 230,
    color: 'black'
  }
]

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

function update() {

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
  }

  if (rightPressed) {
    player.x += player.speed
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

  // Reiniciamos cada frame
  canJump = false

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
}

function draw() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Dibujar el suelo
  ctx.fillStyle = floor.color
  ctx.fillRect(
    floor.x,
    floor.y - cameraY,
    floor.width,
    floor.height
  )

  //Dibujar escaleras
  stairs.forEach(stair => {
    ctx.fillStyle = stair.color
    ctx.fillRect(
      stair.x,
      stair.y - cameraY,
      stair.width,
      stair.height
    )
  })

  // Dibujar el personaje
  ctx.fillStyle = player.color
  ctx.fillRect(
    player.x,
    player.y - cameraY,
    player.width,
    player.height
  )

  // Dibujar la plataformas
  platforms.forEach(platform => {
    ctx.fillStyle = platform.color
    ctx.fillRect(
      platform.x,
      platform.y - cameraY,
      platform.width,
      platform.height
    )
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