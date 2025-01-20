function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const tickBoard = (row, column, player) => {
        if (board[row][column].getValue() !== 0) return;
        board[row][column].tick(player);
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    }

    return { getBoard, tickBoard, printBoard };
}

function Cell() {
    let value = 0;

    const tick = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        tick,
        getValue
    };
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: 'x'
        },
        {
            name: playerTwoName,
            token: 'o'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    // Inline Win Check
    const checkWin = () => {
        const b = board.getBoard();
        const token = getActivePlayer().token;

        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (
                b[i][0].getValue() === token &&
                b[i][1].getValue() === token &&
                b[i][2].getValue() === token
            ) {
                return true; // Row win
            }

            if (
                b[0][i].getValue() === token &&
                b[1][i].getValue() === token &&
                b[2][i].getValue() === token
            ) {
                return true; // Column win
            }
        }

        // Check diagonals
        if (
            b[0][0].getValue() === token &&
            b[1][1].getValue() === token &&
            b[2][2].getValue() === token
        ) {
            return true; // Left-to-right diagonal
        }

        if (
            b[0][2].getValue() === token &&
            b[1][1].getValue() === token &&
            b[2][0].getValue() === token
        ) {
            return true; // Right-to-left diagonal
        }

        return false;
    };

    // Inline Draw Check
    const checkDraw = () => {
        const b = board.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (b[i][j].getValue() === 0) {
                    return false; // Still empty cells
                }
            }
        }
        return true; // Board is full
    };

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} ticking row ${row}, column ${column}...`);
        board.tickBoard(row, column, getActivePlayer().token);

        /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
        // Check for a win
        if (checkWin()) {
            board.printBoard();
            console.log(`${getActivePlayer().name} wins!`);
            return; // Stop the game if there's a winner
        }

        // Check for a draw
        if (checkDraw()) {
            board.printBoard();
            console.log("It's a draw!");
            return; // Stop the game if it's a draw
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };

}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) =>{
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cell');
                cellBtn.dataset.row = rowIndex;
                cellBtn.dataset.column = columnIndex;
                cellBtn.textContent = cell.getValue();
                boardDiv.appendChild(cellBtn);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
    
        if(!selectedColumn || !selectedRow) return;
    
        game.playRound(selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
}

ScreenController();