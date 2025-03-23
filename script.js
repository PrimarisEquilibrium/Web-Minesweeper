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

/**
 * Represents a minesweeper board (width x height)
 */
class Board {
    constructor(width, height, bombCount) {
        this.width = width
        this.height = height
        
        // Any code using the board
        this.boardDiv = this.initializeDOM()
        document.body.appendChild(this.boardDiv)

        this.cellArray = this.initializeCellArray()
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
     * Initializes a (width x height) cell array
     * and creates & appends Cell DOM elements.
     * @returns A cell array of dimensions (width x height).
     */
    initializeCellArray() {
        let cellArray = []
        for (let i = 0; i < this.height; i++) {
            const row = document.createElement("div")
            row.classList.add("row")
            for (let j = 0; j < this.width; j++) {
                const cell = new Cell(0)
                row.appendChild(cell.cellDiv)
                cellArray.push(cell)
            }
            this.boardDiv.appendChild(row)
        }
        return cellArray
    }
}

let board = new Board(10, 10)