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
        if (this.value == "bomb") {
            cellDiv.classList.add("bomb")
        }
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
        
        // Create the board DOM
        this.boardDiv = this.initializeDOM()
        document.body.appendChild(this.boardDiv)

        this.bombPositions = this.generateBombPositions()

        // Initialize & generate cells
        this.cellArray = this.initializeCellArray()
        this.generateCellDOM()
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
                rowArray.push(new Cell(cellValue))
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
}

let board = new Board(10, 10, 10)