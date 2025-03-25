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

export { allDirections, cardinalDirections }