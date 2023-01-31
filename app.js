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
            cell.textContent = player.sign.toUpperCase();
            player.updateCells(id);
            gamePlay.checkWin(player);
            gamePlay.togglePlayer();
            document.getElementById('sign').setAttribute('disabled', true);
            document.getElementById('sign2').setAttribute('disabled', true);
            document.querySelectorAll('.custom-arrow').forEach((arrow) => arrow.classList.add('disabled'));
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
   
    const signOption = document.getElementById('sign');
    const signOption2 = document.getElementById('sign2');
    signOption.addEventListener('change', _setSignChoice.bind(this, player1, player2, signOption, signOption2));
    signOption2.addEventListener('change', _setSignChoice.bind(this, player2, player1, signOption2, signOption));

    function _setSignChoice(p1, p2, optionP1, optionP2) {
        p1.sign = optionP1.value;
        p2.sign = optionP1.value === 'x' ? 'o' : 'x';
        optionP1.value = p1.sign;
        optionP2.value = p2.sign;
    }

    const divP1 = document.querySelector(".player1");
    const divP2 = document.querySelector(".player2");

    function togglePlayer() {
        if (activePlayer === player1) {
            activePlayer = player2;
            divP2.classList.add('selected-player');
            divP1.classList.remove('selected-player');
         } else {
            activePlayer = player1;
            divP1.classList.add('selected-player');
            divP2.classList.remove('selected-player');
         }
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function checkWin(player) {
        let playerCells = player.getMarkedCells();
        winLines.forEach((winningLine) => {
            let merged = playerCells.concat(winningLine);
            if (new Set(merged).size === playerCells.length) {
                _showEndScreen(`${player.name} wins`);
                playerCells = '';
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
        signOption.removeAttribute('disabled');
        signOption2.removeAttribute('disabled');
        document.querySelectorAll('.custom-arrow').forEach((arrow) => arrow.classList.remove('disabled'));
        _hideEndScreen();
        if (activePlayer == player2) togglePlayer();
        player1.reset();
        player2.reset();
        gameBoard.reset();
    }

    return { togglePlayer, getActivePlayer, checkWin }
})();


gameBoard.createBoard();
