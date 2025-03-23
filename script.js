/**
 * Represents a minesweeper cell
 */
class Cell {
    constructor(value) {
        this.value = value

        // Initialize cell DOM
        this.cellDiv = document.createElement("div")
        this.cellDiv.classList.add("cell")
        this.cellDiv.addEventListener("click", () => {
            cellDiv.classList.toggle("clicked")
        })
    }
}

/**
 * Represents a minesweeper board (width x height)
 */
class Board {
    constructor(width, height) {
        this.width = width
        this.height = height
        
        // Initialize board DOM
        this.boardDiv = document.createElement("div")
        this.boardDiv.classList.add("board")
        document.body.appendChild(this.boardDiv)

        this.cellArray = this.initializeCellArray()
    }

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