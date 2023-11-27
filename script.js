import Grid from "./Grid.js"
import Tile from "./Tile.js"

const gameBoard = document.getElementById("game-board")
const grid = new Grid(gameBoard)

grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()
console.log(1, grid.cellsByColumn)

function setupInput() {
  // window is the browser global object
  // { once: true } means it will execute once and removed automatically
  window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
  // e.key 用于获取触发事件的按键的标识符
  console.log(e.key)
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    default:
      await setupInput()
      // return because if user didn't press up/down/left/right, don't do anywhing later
      return
  }

  // only when the movement animation is done, we start mergeTile
  grid.cells.forEach((cell) => cell.mergeTiles())

  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile

  setupInput()
}

function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((i) => [...i].reverse()))
}

function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((i) => [...i].reverse()))
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((i) => [...i].reverse()))
}
function canMoveLeft() {
  return canMove(grid.cellsByRow)
}
function canMoveRight() {
  return canMove(grid.cellsByRow.map((i) => [...i].reverse()))
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index == 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}

function slideTiles(cells) {
  return Promise.all(
    // cells is an array of array, each array is a column
    cells.flatMap((group) => {
      const promises = []
      // if it's group by column, we start from 1, because there is no room to move up when position is 0
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        // for every cell in the group, we check the space for it to move
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }

          // 自己当前的tile设为空，因为已经移动了
          cell.tile = null
        }
      }

      return promises
    })
  )
}
