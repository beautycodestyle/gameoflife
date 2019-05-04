var NextGrid = require('./board');
const WebSocket = require('ws');

var mongoose = require('mongoose');
var User = require('../models/User');

var grid = new Array(40);
for (let i = 0; i < 40; i ++) {
    grid[i] = new Array(40);
    for (let j = 0; j < 40; j ++) {
        grid[i][j] = {value: 0, color: '#ffffff'};
    }
}

const wss = new WebSocket.Server({port: 30001});

/**
 * Generate random color
 * @returns {string}
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Create use with random color.
 * @param ip
 * @returns {string}
 */
function modifyUser(ip) {
    let color = getRandomColor();
    console.log(color);

    User.create({ip: ip, color: color}, (err, res) => {
        if (err) {
            User.updateOne({ip: ip}, {color: color}, (r) => {
                console.log(r);
            })
        }
    });

    return color;
}

/**
 * When user clicked on grid, assign user to cell with users's color.
 * @param coord
 * @param ip
 */
function updateGrid(coord, ip) {
    User.findOne({ip: ip}, (err, res) => {
        grid[coord.x][coord.y] = {value: 1, color: res.color};
    });
}

/**
 * Connect websocket with client
 */
wss.on('connection', (ws, connect) => {
    ws.on('message', (message) => {
        console.log(connect.connection.remoteAddress);
        let msg = JSON.parse(message);
        if (msg.event === 'connected') {
            let color = modifyUser(connect.connection.remoteAddress);
            ws.send(JSON.stringify({event: 'setcolor', color: color, grid: grid}));
        }
        else {
            updateGrid(msg.data, connect.connection.remoteAddress);
        }
    });
});

wss.broadcast = (data) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    })
};

/**
 * Update grid and send grid to all clients per second.
 */
setInterval(() => {
    let n_grid = NextGrid(JSON.parse(JSON.stringify(grid)));
    grid = JSON.parse(JSON.stringify(n_grid));
    wss.broadcast(JSON.stringify({event: "broadcast", grid: grid}));
}, 1000);
