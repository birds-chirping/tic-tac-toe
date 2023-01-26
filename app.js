const Module = (function () {
    let createBoard = function() {
        const boardContainer = document.querySelector('.board');
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            boardContainer.appendChild(cell);
        }
    }

    return {createBoard};

})();


const Player = function(name) {

}

Module.createBoard();