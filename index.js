const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let timerId
let xDirection = -2
let yDirection = 2
let score = 0
//all blocks
const blocks = []

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

const blockLocations = [
  {
    x: 10,
    y: 270
  },
  {
    x: 120,
    y: 270
  },
  {
    x: 230,
    y: 270
  },
  {
    x: 340,
    y: 270
  },
  {
    x: 450,
    y: 270
  },
  {
    x: 10,
    y: 240
  },
  {
    x: 120,
    y: 240
  },
  {
    x: 230,
    y: 240
  },
  {
    x: 340,
    y: 240
  },
  {
    x: 450,
    y: 240
  },
  {
    x: 10,
    y: 210
  },
  {
    x: 120,
    y: 210
  },
  {
    x: 230,
    y: 210
  },
  {
    x: 340,
    y: 210
  },
  {
    x: 450,
    y: 210
  }
]


//create block
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topleft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

//draw all blocks
const addBlocks = () => {

    for (const key in blockLocations) {
        const { x, y } = blockLocations[key]
        const newBlock = new Block(x, y)
        blocks.push(newBlock)
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = newBlock.bottomLeft[0] + 'px'
        block.style.bottom = newBlock.bottomLeft[1] + 'px'
        grid.appendChild(block)
    }
}

addBlocks()

//add player
const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)

//draw player
function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

//draw ball
const drawBall = () => {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

//move player
function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft' :
            if(currentPosition[0] > 0) {
            currentPosition[0] -= 10
            drawUser()
            }
            break;
        case 'ArrowRight' :
            if(currentPosition[0] < boardWidth - blockWidth) {
            currentPosition[0] += 10
            drawUser()
            }
            break;
    }
}

document.addEventListener('keydown', moveUser)

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

//move ball
const moveBall = () => {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

timerId = setInterval(moveBall, 30)

// check for collisions
function checkForCollisions() {
    //check for block collisions
for( let i = 0; i < blocks.length; i++) {
    if(
        (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
        ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topleft[1]) 
    ) {
        const allBlocks = Array.from(document.querySelectorAll('.block'))
        allBlocks[i].classList.remove('block')
        blocks.splice(i,1)
        changeDirection() 
        score++
        scoreDisplay.innerHTML = score


    }
}

    //check for win
    if(blocks.length === 0) {
        scoreDisplay.innerHTML = 'You Win!!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
    }

    //check for wall collisions
    if(ballCurrentPosition[0] >= (boardWidth - ballDiameter) || 
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
    ) {
        changeDirection()
    }

    //check for user collisions
    if(
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
        ) {
            changeDirection()
    }

    //check for game over
    if(ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveUser)
    }
}


function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
      yDirection = -2
      return
    }
    if (xDirection === 2 && yDirection === -2) {
      xDirection = -2
      return
    }
    if (xDirection === -2 && yDirection === -2) {
      yDirection = 2
      return
    }
    if (xDirection === -2 && yDirection === 2) {
      xDirection = 2
      return
    }
}
