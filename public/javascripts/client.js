// import './utils';

const board_size = 800;
let grid = [];
let client_color = '#FF0088';
let number_of_cell_in_row = 40;
let cell_size = board_size / number_of_cell_in_row;

const dr = [-1, -1, -1, 0, 1, 1, 1, 0];
const dc = [-1, 0, 1, 1, 1, 0, -1 ,-1];

const stroke_color = "#aaa";

/**
 * Get sample data.
 * @param type
 * @returns {number[][]}
 */
const getBoard = (type) => {
    number_of_cell_in_row = number_of_cells_of_type[type];
    cell_size = board_size / number_of_cell_in_row;
    let ret_grid = new Array(board[type].length);
    let allow = false;
    for (let i = 0; i < board[type].length; i ++) {
        ret_grid[i] = new Array(board[type].length);
        for (let j = 0; j < board[type].length; j ++) {
            let color = "#FFFFFF";
            if (board[type][i][j]) {
                color = "#000000";
                if (!allow) {
                    color = client_color;
                    allow = true;
                }
            }
            ret_grid[i][j] = {value: board[type][i][j], color: color};
        }
    }
    return ret_grid;
};

/**
 * Drawing board with given data.
 * @param ctx  -> canvas context
 * @param grid -> given data
 */
const drawBoard = (ctx) => {
    ctx.clearRect(0, 0, board_size, board_size);
    ctx.strokeStyle = stroke_color;
    ctx.fillStyle = "#000000";
    for (let i = 0; i < grid.length; i ++) {
        for (let j = 0; j < grid.length; j ++) {
            ctx.fillStyle = grid[i][j].color;
            if (grid[i][j].value) {
                ctx.fillRect(i * cell_size, j * cell_size, cell_size, cell_size)
            }
            ctx.strokeRect(i * cell_size, j * cell_size, cell_size, cell_size);
        }
    }
};

const getColor = (row, col) => {
    let ret = {r: 0, g: 0, b: 0};
    for (let i = 0; i < 8; i ++) {
        let r = (row + dr[i] + number_of_cell_in_row) % number_of_cell_in_row;
        let c = (col + dc[i] + number_of_cell_in_row) % number_of_cell_in_row;
        if (grid[r][c].value) {
            let color = hexToRgb(grid[r][c].color);
            ret.r += color.r;
            ret.g += color.g;
            ret.b += color.b;
        }
    }
    return rgbToHex(Math.floor(ret.r / 3), Math.floor(ret.g / 3), Math.floor(ret.b / 3))
};

/**
 * Determine state(live or dead) of next generation according to algorithm.
 * @param row  -> x position of current cell
 * @param col  -> y position of current cell
 * @returns {number} 1(live) or 0(dead)
 */
const getState = (row, col) => {
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
            let color = getColor(row, col);
            ret = {value: 1, color: color};
        }
        else ret = {value: 0, color: "#FFFFFF"};
    }
    return ret
};

/**
 * Generate board data of next generation according to algorithm.
 * @param grid current board data.
 * @returns next generation board data.
 */
const getNextGeneration = () => {
    const next_grid = new Array(grid.length);
    for (let i = 0; i < grid.length; i ++) {
        next_grid[i] = new Array(grid.length);
        for (let j = 0; j < grid.length; j ++) {
            next_grid[i][j] = getState(i, j);
        }
    }
    grid = next_grid;
};

/**
 * Update board per 1 second.
 * @param ctx -> canvas context
 */
const updateBoard = (ctx) => {
    drawBoard(ctx);
    getNextGeneration();
    setTimeout(() => {
        requestAnimationFrame(() => updateBoard(ctx));
    }, 1000)
};

