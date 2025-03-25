/**
 * Generates a random integer inclusively
 * @param {*} min The minimum value (inclusive).
 * @param {*} max The maximum value (inclusive).
 * @returns The random integer.
 */
function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export { getRandomIntInclusive }