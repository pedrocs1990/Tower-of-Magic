const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// Tamaño del canvas
canvas.width = 430
canvas.height = 700

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
  { // plataforma 1
    x: 130, // Posición horizontal
    y: 600, // Posición vertical
    width: 250, // Ancho de la plataforma
    height: 20, // Alto de la plataforma
    color: 'brown' // Color de la plataforma
  },
  { // plataforma 2
    x: 50,
    y: 500,
    width: 250,
    height: 20,
    color: 'brown'
  },
  { // plataforma 3
    x: 0,
    y: 400,
    width: 70,
    height: 20,
    color: 'brown'
  },
  { // plataforma 4
    x: 150,
    y: 350,
    width: 230,
    height: 20,
    color: 'brown'
  },
  { // plataforma 5
    x: 320,
    y: 250,
    width: 90,
    height: 20,
    color: 'brown'
  },
  { // plataforma 6
    x: 0,
    y: 200,
    width: 250,
    height: 20,
    color: 'brown'
  },
  { // plataforma 7
    x: 70,
    y: 80,
    width: 350,
    height: 20,
    color: 'brown'
  },
  { // plataforma 8
    x: 0,
    y: -120,
    width: canvas.width,
    height: 20,
    color: 'brown'
  },
  { // plataforma 9
    x: 0,
    y: -320,
    width: canvas.width,
    height: 20,
    color: 'brown'
  },
  { // plataforma 10
    x: 0,
    y: -520,
    width: canvas.width,
    height: 20,
    color: 'brown'
  }
]

const stairs = [
  { // stairs 1
    x: 320,
    y: -120,
    width: 60,
    height: 200,
    color: 'black'
  },
  { // stairs 1
    x: 50,
    y: -320,
    width: 60,
    height: 200,
    color: 'black'
  }
]

// Variable para controlar el estado de las teclas
let leftPressed = false
let rightPressed = false

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

  if (event.key === "ArrowUp" && canJump) {
    player.velocityY = player.jumpForce
    canJump = false
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
})

function update() {

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
  platforms.forEach(platforms => {

    if (
      player.x < platforms.x + platforms.width &&
      player.x + player.width > platforms.x &&
      player.y < platforms.y + platforms.height &&
      player.y + player.height > platforms.y
    ) {

      // izquierda
      if (previousX + player.width <= platforms.x) {
        player.x = platforms.x - player.width
      }

      // derecha
      else if (previousX >= platforms.x + platforms.width) {
        player.x = platforms.x + platforms.width
      }
    }
  })

  // Bordes pantalla
  if (player.x < 0) {
    player.x = 0
  }

  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width
  }

  // MOVIMIENTO VERTICAL

  player.velocityY += player.gravity
  player.y += player.velocityY

  // Reiniciamos cada frame
  canJump = false

  // Colisión vertical
  platforms.forEach(platforms => {

    if (
      player.x < platforms.x + platforms.width &&
      player.x + player.width > platforms.x &&
      player.y < platforms.y + platforms.height &&
      player.y + player.height > platforms.y
    ) {

      // aterrizar
      if (previousY + player.height <= platforms.y) {
        player.y = platforms.y - player.height
        player.velocityY = 0
        canJump = true
      }

      // golpear abajo
      else if (previousY >= platforms.y + platforms.height) {
        player.y = platforms.y + platforms.height
        player.velocityY = 0
      }
    }
  })

  // Suelo
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height
    player.velocityY = 0
    canJump = true
  }

  // Movimiento de camara
  const upperLimit = canvas.height * 0.35
  const lowerLimit = canvas.height * 0.75

  const playerScreenY = player.y - cameraY

  let targetCameraY = cameraY

  if (playerScreenY < upperLimit) {
    targetCameraY = player.y - upperLimit
  }
  else if (playerScreenY > lowerLimit) {
    targetCameraY = player.y - lowerLimit
  }

  cameraY += (targetCameraY - cameraY) * 0.05
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

  // Dibujar el personaje
  ctx.fillStyle = player.color
  ctx.fillRect(
    player.x,
    player.y - cameraY,
    player.width,
    player.height
  )

  //Dibujar escaleras
  stairs.forEach(stairs => {
    ctx.fillStyle = stairs.color
    ctx.fillRect(
      stairs.x,
      stairs.y - cameraY,
      stairs.width,
      stairs.height
    )
  })

  // Dibujar la plataformas
  platforms.forEach(platforms => {
    ctx.fillStyle = platforms.color
    ctx.fillRect(
      platforms.x,
      platforms.y - cameraY,
      platforms.width,
      platforms.height
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