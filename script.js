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

function handleInput(e) {
  // e.key 用于获取触发事件的按键的标识符
  console.log(e.key)
  switch (e.key) {
    case "ArrowUp":
      moveUp()
      break
    case "ArrowDown":
      moveDown()
      break
    case "ArrowLeft":
      moveLeft()
      break
    case "ArrowRight":
      moveRight()
      break
    default:
      setupInput()
      // return because if user didn't press up/down/left/right, don't do anywhing later
      return
  }

  setupInput()
}

function moveUp() {
  slideTiles(grid.cellsByColumn)
}

function moveDown() {
  slideTiles(grid.cellsByColumn.map((i) => [...i].reverse()))
}

function moveLeft() {
  slideTiles(grid.cellsByRow)
}

function moveRight() {
  slideTiles(grid.cellsByRow.map((i) => [...i].reverse()))
}

function slideTiles(cells) {
  // cells is an array of array, each array is a column
  cells.forEach((group) => {
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
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile
        } else {
          lastValidCell.tile = cell.tile
        }

        // 自己当前的tile设为空，因为已经移动了
        cell.tile = null
      }
    }
  })
}
