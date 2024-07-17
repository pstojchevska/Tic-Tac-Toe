const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const gameController = (() => {
    let player1, player2;
    let currentPlayer;
    let gameActive = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWinner = () => {
        const board = gameBoard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (board.every(cell => cell !== "")) {
            return "Tie";
        }

        return null;
    };

    const playRound = (index) => {
        if (gameActive && gameBoard.updateBoard(index, currentPlayer.mark)) {
            const winner = checkWinner();
            if (winner) {
                gameActive = false;
                displayController.showResult(winner === "Tie" ? "It's a Tie!" : `${currentPlayer.name} wins!`);
            } else {
                switchPlayer();
                displayController.updateCurrentPlayer(currentPlayer.name);
            }
        }
    };

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameActive = true;
        gameBoard.resetBoard();
        displayController.renderBoard();
        displayController.updateCurrentPlayer(currentPlayer.name);
        displayController.showGameElements();
    };

    const resetGame = () => {
        gameBoard.resetBoard();
        currentPlayer = player1;
        gameActive = true;
        displayController.renderBoard();
        displayController.updateCurrentPlayer(currentPlayer.name);
    };

    return { playRound, startGame, resetGame, getCurrentPlayer: () => currentPlayer };
})();

const displayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const resultDiv = document.getElementById("result");
    const restartButton = document.getElementById("restart");
    const startButton = document.getElementById("start");
    const player1Input = document.getElementById("player1");
    const player2Input = document.getElementById("player2");

    const renderBoard = () => {
        gameboardDiv.innerHTML = "";
        const board = gameBoard.getBoard();

        board.forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.textContent = cell;
            cellDiv.addEventListener("click", () => {
                gameController.playRound(index);
                renderBoard();
            });
            gameboardDiv.appendChild(cellDiv);
        });
    };

    const showResult = (result) => {
        resultDiv.textContent = result;
        resultDiv.classList.remove("hidden");
    };

    const updateCurrentPlayer = (name) => {
        resultDiv.textContent = `${name}'s turn`;
        resultDiv.classList.remove("hidden");
    };

    const showGameElements = () => {
        gameboardDiv.classList.remove("hidden");
        restartButton.classList.remove("hidden");
        resultDiv.classList.remove("hidden");
    };

    startButton.addEventListener("click", () => {
        const name1 = player1Input.value || "Player 1";
        const name2 = player2Input.value || "Player 2";
        gameController.startGame(name1, name2);
    });

    restartButton.addEventListener("click", () => {
        gameController.resetGame();
    });

    return { renderBoard, showResult, updateCurrentPlayer, showGameElements };
})();

displayController.renderBoard();
