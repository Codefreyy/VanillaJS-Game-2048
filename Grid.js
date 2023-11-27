const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

export default class Grid {
  // private variable
  #cells
  #cellsByColumn
  #cellsByRow

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null)
  }

  get cells() {
    return this.#cells
  }

  get cellsByColumn() {
    // 一列一列组装成二维数组
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || []
      cellGrid[cell.x][cell.y] = cell
      return cellGrid
    }, [])
  }

  get cellsByRow() {
    // 一行一行组装成二维数组
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || []
      cellGrid[cell.y][cell.x] = cell
      return cellGrid
    }, [])
  }

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE)
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)

    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      )
    })

    console.log(this.#cells)
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
    return this.#emptyCells[randomIndex]
  }
}

class Cell {
  #cellElement
  #x
  #y
  #tile
  #mergeTile

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get tile() {
    return this.#tile
  }

  get mergeTile() {
    return this.#mergeTile
  }

  set mergeTile(value) {
    // 给mergeTitle当前cell的值
    this.#mergeTile = value
    if (!value) return
    // 给mergeTitle当前cell的位置
    this.#mergeTile.x = this.#x
    this.#mergeTile.y = this.#y
  }

  set tile(value) {
    this.#tile = value
    if (value == null) return
    // when clicking cell, assign cell position to title position
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.#tile.value == tile.value)
    )
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return
    this.tile.value = this.tile.value + this.mergeTile.value
    this.mergeTile.remove()
    this.mergeTile = null
  }

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement
    this.#x = x
    this.#y = y
  }
}

function createCellElements(gridElement) {
  const cells = []
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    gridElement.appendChild(cell)
  }
  return cells
}
