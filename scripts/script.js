import { allDirections, cardinalDirections } from "./constants.js"
import { getRandomIntInclusive } from "./utils.js"

/**
 * Represents a minesweeper cell
 * Value can either be null, numerical, or "bomb"
 */
class Cell {
    constructor(value, row, col, board) {
        this.value = value
        this.row = row
        this.col = col
        this.board = board
        this.cellDiv = this.initializeDOM()
        this.activated = false
        this.flagged = false
    }

    activateCell() {
        if (!this.activated && !this.flagged) {
            if (this.value == "bomb") {
                document.getElementById("win-status").textContent = "You lost!"
            }
            this.cellDiv.textContent = this.value
            if (this.value == 0) {
                this.cellDiv.textContent = ""
            }
            this.cellDiv.classList.toggle("clicked")
            this.activated = true
        }
    }

    /**
     * Initializes the cell DOM.
     */
    initializeDOM() {
        const cellDiv = document.createElement("div")
        cellDiv.classList.add("cell")
        cellDiv.addEventListener("mousedown", (e) => {
            // Stop the "game" (input) by not reacting to inputs
            if (this.board.gameOver) return

            // Display all bombs and toggle gameover when bomb is clicked
            if (this.value == "bomb") {
                this.board.displayBombs()
                this.board.gameOver = true
            }

            // On right click
            if ((e.which === 3 || e.button === 2) && !this.activated) {
                if (this.cellDiv.classList.contains("flag")) {
                    this.board.flagCount--
                } else {
                    this.board.flagCount++
                }
                this.cellDiv.classList.toggle("flag")
                this.flagged = !this.flagged
                document.getElementById("bomb-count").textContent = `Bombs Remaining: ${this.board.bombCount - this.board.flagCount}`
                if (board.hasWon()) {
                    alert("You won!")
                }
            // On left click
            } else {
                this.board.floodFill(this)
                this.activateCell()
            }
        })
        return cellDiv
    }
}

/**
 * Represents a minesweeper board (width x height)
 */
class Board {
    constructor(width, height, bombCount) {
        this.width = width
        this.height = height
        this.bombCount = bombCount
        this.flagCount = 0
        this.gameOver = false

        document.getElementById("bomb-count").textContent = `Bombs Remaining: ${this.bombCount}`
        
        // Create the board DOM
        this.boardDiv = this.initializeDOM()
        document.body.appendChild(this.boardDiv)

        this.bombPositions = this.generateBombPositions()

        // Initialize & generate cells
        this.cellArray = this.initializeCellArray()
        this.generateCellDOM()
        this.generateCellValues()
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
        const bombSet = new Set()
        while (bombSet.size < this.bombCount) {
            const randomRow = getRandomIntInclusive(0, this.width - 1)
            const randomCol = getRandomIntInclusive(0, this.height - 1)
            bombSet.add(`${randomRow},${randomCol}`)
        }
        return bombSet
    }

    /**
     * Initializes a (width x height) cell array.
     * @returns A cell array of dimensions (width x height).
     */
    initializeCellArray() {
        let cellArray = []
        for (let row = 0; row < this.height; row++) {
            let rowArray = []
            for (let col = 0; col < this.width; col++) {
                let cellValue = null
                if (this.bombPositions.has(`${row},${col}`)) {
                    cellValue = "bomb"
                }
                rowArray.push(new Cell(cellValue, row, col, this))
            }
            cellArray.push(rowArray)
        }
        return cellArray
    }

    /**
     * Appends the Cell DOM from cell array to the Board DOM.
     */
    generateCellDOM() {
        for (let row = 0; row < this.height; row++) {
            const rowDiv = document.createElement("div")
            rowDiv.classList.add("row")
            for (let col = 0; col < this.width; col++) {
                const cell = this.cellArray[row][col]
                rowDiv.appendChild(cell.cellDiv)
            }
            this.boardDiv.appendChild(rowDiv)
        }
    }

    /**
     * For each cell, determines how many bombs it is adjacent to.
     */
    generateCellValues() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                let cell = this.cellArray[row][col]
                if (cell.value == "bomb") continue

                let bombCount = 0
                for (const [drow, dcol] of allDirections) {
                    const newRow = row + drow
                    const newCol = col + dcol
                    if (newRow >= 0 && newRow < this.height
                        && newCol >= 0 && newCol < this.width
                    ) {
                        const newCell = this.cellArray[newRow][newCol]
                        if (newCell.value == "bomb") {
                            bombCount++
                        }
                    }
                }
                cell.value = bombCount
            }
        }
    }

    /**
     * Recursively activates neighboring 0 cells.
     * @param {Cell} cell The initial cell.
     */
    floodFill(cell) {
        if (cell.activated) return;
        
        cell.activateCell()
    
        if (cell.value !== 0) return;
    
        for (const [drow, dcol] of cardinalDirections) {
            const newRow = cell.row + drow;
            const newCol = cell.col + dcol;
    
            if (newRow >= 0 && newRow < this.height && newCol >= 0 && newCol < this.width) {
                const newCell = this.cellArray[newRow][newCol];
    
                if (!newCell.activated && newCell.value !== "bomb") {
                    this.floodFill(newCell);
                }
            }
        }
    }

    /**
     * Determines if the game has been won.
     * @returns True if the game has been won; otherwise False.
     */
    hasWon() {
        if (this.bombCount - this.flagCount !== 0) return false

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.cellArray[row][col]
                if (cell.flagged && cell.value !== "bomb") {
                    return false
                }
            }
        }
        return true
    }

    /**
     * Activates all the bombs (reveals them to the player).
     */
    displayBombs() {
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.cellArray[row][col]
                if (cell.value == "bomb") {
                    cell.activateCell()
                }
            }
        }
    }

    /**
     * Deletes the boardDiv element.
     */
    clearBoard() {
        this.boardDiv.remove()
    }
}

document.addEventListener('contextmenu', e => e?.cancelable && e.preventDefault());
const resetButton = document.getElementById("reset-btn")

let board = new Board(9, 9, 10)

const time = document.getElementById("time")
let seconds = 0
time.textContent = `Time: ${seconds}`
let timer = setInterval(() => {
    seconds++
    time.textContent = `Time: ${seconds}`
}, 1000)

resetButton.addEventListener("click", () => {
    board.clearBoard()
    board = new Board(9, 9, 10)
    seconds = 0
    time.textContent = `Time: 0`
    clearInterval(timer)
    timer = setInterval(() => {
        seconds++
        time.textContent = `Time: ${seconds}`
    }, 1000)
})