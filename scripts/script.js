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
            this.cellDiv.textContent = this.value
            switch (this.value) {
                case "bomb":
                    this.cellDiv.textContent = ""
                    break;
                case 0:
                    this.cellDiv.textContent = ""
                    break;
                case 1:
                    this.cellDiv.style.color = "#0201FF"
                    break;
                case 2:
                    this.cellDiv.style.color = "#008601"
                    break;
                case 3:
                    this.cellDiv.style.color = "#FE0100"
                    break;
                case 4:
                    this.cellDiv.style.color = "#010085"
                    break;
                case 5:
                    this.cellDiv.style.color = "#840100"
                    break;
                case 6:
                    this.cellDiv.style.color = "#058284"
                    break;
                case 7:
                    this.cellDiv.style.color = "#840183"
                    break;
                case 8:
                    this.cellDiv.style.color = "#777"
                    break;
            }
            if (this.value == "bomb") {
                const bombImg = document.createElement("img")
                bombImg.src = "./public/images/bomb.png"
                bombImg.height = 20
                bombImg.width = 20
                this.cellDiv.appendChild(bombImg)
                this.cellDiv.style.background = "red"
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
                document.getElementById("win-status").textContent = "You lost!"
                this.board.displayBombs()
                this.board.gameOver = true
            }

            // On right click
            if ((e.which === 3 || e.button === 2) && !this.activated) {
                if (this.flagged) {
                    const flagImg = document.getElementById("flag-img")
                    this.cellDiv.removeChild(flagImg)
                    this.board.flagCount--
                } else {
                    const flagImg = document.createElement("img")
                    flagImg.id = "flag-img"
                    flagImg.src = "./public/images/flag.svg"
                    this.cellDiv.appendChild(flagImg)
                    this.board.flagCount++
                }
                
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

class NumberBox {
    constructor(value) {
        this.value = value
        this.initializeDOM()
        this.update()
    }

    initializeDOM() {
        const container = document.createElement("div");
        container.style.background = "black";
        container.style.display = "inline-flex";
        container.style.gap = "8px";
        container.style.padding = "4px";
        container.style.width = "fit-content";
        container.style.height = "fit-content";
        
        this.hundreds = document.createElement("img")
        this.hundreds.src = "./public/images/t0.svg"
        container.appendChild(this.hundreds)

        this.tens = document.createElement("img")
        this.tens.src = "./public/images/t0.svg"
        container.appendChild(this.tens)

        this.ones = document.createElement("img")
        this.ones.src = "./public/images/t0.svg"
        container.appendChild(this.ones)

        document.body.appendChild(container)
    }

    getDigits(num) {
        const ones = num % 10;
        const tens = Math.floor((num % 100) / 10);
        const hundreds = Math.floor((num % 1000) / 100);
        
        return { hundreds, tens, ones };
    }

    update() {
        const { hundreds, tens, ones } = this.getDigits(this.value)
        this.hundreds.src = `/public/images/t${hundreds}.svg`
        this.tens.src = `/public/images/t${tens}.svg`
        this.ones.src = `/public/images/t${ones}.svg`
    }

    increment() {
        this.value++
        this.update()
    }

    decrement() {
        this.value--
        this.update()
    }
}

document.addEventListener('contextmenu', e => e?.cancelable && e.preventDefault());
const resetButton = document.getElementById("reset-btn")

let board = new Board(9, 9, 10)
const bombRemainingBox = new NumberBox(10)
const timerBox = new NumberBox(0)

// Initialize default bomb count
document.getElementById("bomb-count").textContent = `Bombs Remaining: ${board.bombCount}`

// Setup timer
const time = document.getElementById("time")
let seconds = 0
time.textContent = `Time: ${seconds}`
let timer = setInterval(() => {
    seconds++
    time.textContent = `Time: ${seconds}`
}, 1000)

resetButton.addEventListener("click", () => {
    // Reset board
    board.clearBoard()
    board = new Board(9, 9, 10)

    // Reset timer
    seconds = 0
    time.textContent = `Time: 0`
    clearInterval(timer)
    timer = setInterval(() => {
        seconds++
        time.textContent = `Time: ${seconds}`
    }, 1000)

    // Hide "you lost" text if user lost
    document.getElementById("win-status").textContent = ""
})  