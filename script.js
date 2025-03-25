// 8-way direction
const allDirections = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

// 4-way direction
const cardinalDirections = [
    [-1, 0],  // North
    [0, -1],   // West
    [0, 1],    // East
    [1, 0]     // South
];

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
    }

    activateCell() {
        if (!this.activated) {
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
        if (this.value == "bomb") {
            cellDiv.classList.add("bomb")
        }
        cellDiv.addEventListener("click", () => {
            this.board.floodFill(this)
            this.activateCell()
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
}

let board = new Board(16, 16, 40)