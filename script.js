/**
 * Represents a minesweeper cell
 * Value can either be null, numerical, or "bomb"
 */
class Cell {
    constructor(value) {
        this.value = value
        this.cellDiv = this.initializeDOM()
    }

    /**
     * Initializes the cell DOM.
     */
    initializeDOM() {
        const cellDiv = document.createElement("div")
        cellDiv.classList.add("cell")
        cellDiv.addEventListener("click", () => {
            this.cellDiv.classList.toggle("clicked")
        })
        return cellDiv
    }
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
  }

/**
 * Represents a minesweeper board (width x height)
 */
class Board {
    constructor(width, height, bombCount) {
        this.width = width
        this.height = height
        this.bombCount = bombCount
        
        // Any code using the board
        this.boardDiv = this.initializeDOM()
        document.body.appendChild(this.boardDiv)

        this.cellArray = this.initializeCellArray()
        console.log(this.generateBombPositions())
    }

    /**
     * Initialize the board DOM element.
     */
    initializeDOM() {
        const boardDiv = document.createElement("div")
        boardDiv.classList.add("board")
        return boardDiv
    }

    /**
     * Randomly generates a bombCount amount of bomb positions.
     * @returns A set of bomb positions.
     */
    generateBombPositions() {
        // Bomb positions generated are guaranteed to be unique
        let bombSet = new Set()
        while (bombSet.size < this.bombCount) {
            const randomRow = getRandomIntInclusive(0, this.width - 1)
            const randomCol = getRandomIntInclusive(0, this.height - 1)
            bombSet.add({row: randomRow, col: randomCol})
        }
        return bombSet
    }

    /**
     * Initializes a (width x height) cell array
     * and creates & appends Cell DOM elements.
     * @returns A cell array of dimensions (width x height).
     */
    initializeCellArray() {
        let cellArray = []
        for (let i = 0; i < this.height; i++) {
            const row = document.createElement("div")
            let rowArray = []
            row.classList.add("row")
            for (let j = 0; j < this.width; j++) {
                const cell = new Cell(0)
                row.appendChild(cell.cellDiv)
                rowArray.push(cell)
            }
            this.boardDiv.appendChild(row)
            cellArray.push(rowArray)
        }
        return cellArray
    }
}

let board = new Board(10, 10, 10)