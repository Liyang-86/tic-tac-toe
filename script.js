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
        if (!board[row][column] === 0) return;
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

function gameController(
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

    const playRound = (row, column) => {
        console.log(`${getActivePlayer().name} ticking row ${row}, column ${column}...`);
        board.tickBoard(row, column, getActivePlayer().token);

        /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };

}

const game = gameController();

game.playRound(0, 0);
game.playRound(1, 1);