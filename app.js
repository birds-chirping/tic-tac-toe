const gameBoard = (function() {
    let cells = [];

    let createBoard = function() {
        const boardContainer = document.querySelector('.board');
        for (let i = 1; i <= 9; i++) {
            const cell = Cell(i);
            boardContainer.appendChild(cell.newCell());
            cells.push(cell);
        }
    }

    function reset() {
        cells.forEach((cell) => cell.reset());
    }

    return { createBoard, reset };
})();


const Cell = (id) => {
    const  cell = document.createElement('div');

    const newCell = function() {
        cell.classList.add('cell');    
        _addListener(cell);
        return cell;
    }

    function _addListener(c) {
        c.addEventListener('click', _clickEvent)
    }

    function _clickEvent() {
        if (!cell.textContent) {
            let player = gamePlay.getActivePlayer();
            cell.textContent = player.sign;
            player.updateCells(id);
            gamePlay.checkWin(player);
            gamePlay.togglePlayer();
        }
    }

    function reset() {
        cell.textContent = '';
    }

    return { newCell, reset }
}


const Player = (name, sign) => {
    let markedCells = [];

    function updateCells(cellId) {
        markedCells.push(cellId);
    }

    function getMarkedCells() {
        return markedCells;
    }

    function reset() {
        markedCells = [];
    }

    return { name, sign, updateCells, getMarkedCells, reset }
}


const gamePlay = (function() {
    const player1 = Player('Player 1', 'x');
    const player2 = Player('Player 2', 'o');
    let activePlayer = player1;
    const winLines = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9],
        [1, 4, 7], [2, 5, 8], [3, 6, 9],
        [1, 5, 9], [3, 5, 7]
    ];

    const endScreen = document.querySelector('.end-screen');
    const resetBtn = document.querySelector('.reset-btn');

    function togglePlayer() {
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function checkWin(player) {
        const playerCells = player.getMarkedCells();
        winLines.forEach((winningLine) => {
            let merged = playerCells.concat(winningLine);
            if (new Set(merged).size === playerCells.length) {
                _showEndScreen(`${player.name} wins`);
            };
        }); 
        if (playerCells.length === 5) {
            _showEndScreen('Draw!');
        }
    }

    function _showEndScreen(message) {
        endScreen.style.display = 'grid';
        endScreen.textContent = message;
    }

    function _hideEndScreen() {
        endScreen.style.display = 'none';
    }

    resetBtn.addEventListener('click', _newGame);

    function _newGame() {
        _hideEndScreen();
        player1.reset();
        player2.reset();
        gameBoard.reset();
    }

    return { togglePlayer, getActivePlayer, checkWin }
})();


gameBoard.createBoard();
