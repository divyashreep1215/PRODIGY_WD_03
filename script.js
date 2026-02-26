const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');
const resetBtn = document.getElementById('resetBtn');
const aiToggle = document.getElementById('aiToggle');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[cellIndex] !== "" || !gameActive) return;

    updateCell(clickedCell, cellIndex);
    checkResult();

    if (gameActive && aiToggle.checked && currentPlayer === "O") {
        setTimeout(makeAiMove, 500);
    }
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            highlightWinner([a, b, c]);
            break;
        }
    }

    if (roundWon) {
        statusText.innerHTML = `Player <span style="color:var(--${currentPlayer.toLowerCase()}-color)">${currentPlayer}</span> Wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.innerText = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerHTML = `Player <span>${currentPlayer}</span>'s Turn`;
}

function highlightWinner(indices) {
    indices.forEach(i => cells[i].classList.add('winner'));
}

// --- MINIMAX AI LOGIC ---
function makeAiMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    const targetCell = document.querySelector(`[data-index="${move}"]`);
    updateCell(targetCell, move);
    checkResult();
}

function minimax(board, depth, isMaximizing) {
    const scores = { X: -10, O: 10, tie: 0 };
    let result = checkWinnerRaw();
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerRaw() {
    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes("") ? null : "tie";
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.innerHTML = "Player <span>X</span>'s Turn";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o', 'winner');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', restartGame);