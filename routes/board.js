const utils = require('../public/javascripts/utils');

let number_of_cell_in_row = 40;

const dr = [-1, -1, -1, 0, 1, 1, 1, 0];
const dc = [-1, 0, 1, 1, 1, 0, -1 ,-1];

const getColor = (grid, row, col) => {
    let ret = {r: 0, g: 0, b: 0};
    for (let i = 0; i < 8; i ++) {
        let r = (row + dr[i] + number_of_cell_in_row) % number_of_cell_in_row;
        let c = (col + dc[i] + number_of_cell_in_row) % number_of_cell_in_row;
        if (grid[r][c].value) {
            let color = utils.hexToRgb(grid[r][c].color);
            ret.r += color.r;
            ret.g += color.g;
            ret.b += color.b;
        }
    }
    return utils.rgbToHex(Math.floor(ret.r / 3), Math.floor(ret.g / 3), Math.floor(ret.b / 3))
};

/**
 * Determine state(live or dead) of next generation according to algorithm.
 * @param row  -> x position of current cell
 * @param col  -> y position of current cell
 * @returns {number} 1(live) or 0(dead)
 */
const getState = (grid, row, col) => {
    let number_of_live = 0, ret = {};
    for (let i = 0; i < 8; i ++) {
        let r = (row + dr[i] + number_of_cell_in_row) % number_of_cell_in_row;
        let c = (col + dc[i] + number_of_cell_in_row) % number_of_cell_in_row;
        number_of_live += grid[r][c].value;
    }
    if (grid[row][col].value === 1) {
        if (number_of_live !== 2 && number_of_live !== 3) {
            ret.value = 0;
            ret.color = "#FFFFFF";
        } else ret = grid[row][col];
    } else {
        if (number_of_live === 3) {
            let color = getColor(grid, row, col);
            ret = {value: 1, color: color};
        }
        else ret = {value: 0, color: "#FFFFFF"};
    }
    return ret
};

/**
 * Generate board data of next generation according to algorithm.
 * @param grid current board data.
 * @returns any[] generation board data.
 */
const getNextGeneration = (grid) => {
    const next_grid = new Array(grid.length);
    for (let i = 0; i < grid.length; i ++) {
        next_grid[i] = new Array(grid.length);
        for (let j = 0; j < grid.length; j ++) {
            next_grid[i][j] = getState(grid, i, j);
        }
    }
    return next_grid;
};

module.exports = getNextGeneration;
