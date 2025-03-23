/**
 * Represents a minesweeper board (width x height)
 */
class Board {
    constructor(width, height) {
        this.width = width
        this.height = height
    }

    draw() {
        console.log("Drawing board...")
    }
}

const boardDiv = document.createElement("div")
boardDiv.classList.add("board")
const cellDiv = document.createElement("div")
cellDiv.classList.add("cell")
cellDiv.addEventListener("click", (event) => {
    cellDiv.classList.toggle("clicked")
})

boardDiv.appendChild(cellDiv)
document.body.appendChild(boardDiv)

let board = new Board(10, 10)
board.draw()