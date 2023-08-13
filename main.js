let board = Array(9).fill(null);

let currentPlayer

let score = {
    Light: 0,
    Dark: 0
}

let highlighted = null;
let phase = 1; // 1: placing, 0: moving

const cells = Array.from(document.querySelectorAll('.cell'));

function updateUI() {
    document.getElementById('turnColour').className = currentPlayer;
    document.getElementById("scoreLight").innerText = score.Light;
    document.getElementById("scoreDark").innerText = score.Dark;

    updatePhase();
}

function isLegalMove(a, b) {
    return (a === 4 || b === 4 || (a % 3 !== 0 && b === a - 1) || (a % 3 !== 2 && b === a + 1) || (a >= 3 && b === a - 3) || (a < 6 && b === a + 3));
}

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winConditions) {
        if (board[condition[0]] !== null &&
            board[condition[0]] === board[condition[1]] &&
            board[condition[0]] === board[condition[2]]) {
            return true;
        }
    }
    return false;
}

function showWin() {
    const cells = document.querySelectorAll('.cell');
    const delay = 100;

    cells.forEach((cell, index) => {
        // Use setTimeout to apply the background color with a delay
        setTimeout(() => {
            cell.className = `${currentPlayer == 'Light' ? 'Dark' : 'Light'} cell bounce`;
        }, spiral(index) * delay);
    });
}

function spiral(index) {
    return [2, 3, 4, 1, 0, 5, 8, 7, 6][index]; // TODO: there's probably a better way to do this for general grid sizes
}

function initialise() {
    cells.forEach((cell, i) => {
        cell.addEventListener('click', () => {
            if (board[i] === null && highlighted !== null) {
                movePieceTo(i);
            } else if (board[i] === null && phase === 1) {
                placePiece(i, cell);
            } else if (board[i] === currentPlayer && phase === 0) {
                highlightCell(i, cell);
            }

            if (checkWin()) {
                score[currentPlayer == 'Light' ? 'Dark' : 'Light']++;
                showWin();
                setTimeout(() => {
                    animateClear();
                    start();
                }, 2500)
            }
            updateUI();
        });
    });
}

function start() {
    board = Array(9).fill(null);

    // Randomize starting player
    let options = ['Light', 'Dark'];
    currentPlayer = options[Math.floor(Math.random() * options.length)];

    highlighted = null;
    phase = 1; // 1: placing, 0: moving

    updateUI();
}

function movePieceTo(i) {
    if (!isLegalMove(highlighted, i)) {
        cells[i].classList.add('illegal');
        setTimeout(() => { cells[i].classList.remove('illegal') }, 300)
        return;
    }
    // Reset highlighted cell
    cells[highlighted].classList.remove('highlight');
    cells[highlighted].classList.remove(currentPlayer);
    board[highlighted] = null;

    // Set new cell
    board[i] = currentPlayer;
    cells[i].classList.add(currentPlayer);

    // Toggle player
    currentPlayer = currentPlayer === 'Light' ? 'Dark' : 'Light';

    // Reset highlighted
    highlighted = null;
}

function placePiece(i, cell) {
    board[i] = currentPlayer;
    cell.classList.add(currentPlayer);

    // Toggle player
    currentPlayer = currentPlayer === 'Light' ? 'Dark' : 'Light';

    // Check if the placing phase is over or not, if it is, modify 
    if (board.filter(x => x !== null).length >= 6) {
        phase = 0;
    }
}

function highlightCell(i, cell) {
    if (highlighted !== null) {
        cells[highlighted].classList.remove('highlight');
    }
    highlighted = i;
    cell.classList.add('highlight');
}

function animateClear() {
    cells.forEach((cell) => {
        cell.className = "shake cell";
    });
}

function updatePhase() {
    if (phase === 1) {
        document.getElementById("placingPhase").classList.remove("inactivePhase");
        document.getElementById("movingPhase").classList.add("inactivePhase");
    } else {
        document.getElementById("movingPhase").classList.remove("inactivePhase");
        document.getElementById("placingPhase").classList.add("inactivePhase");
    }
}

function colourMenu() {
    let colour = prompt("Enter colour:"); // TODO: nice UI
    changeColour(colour);
}

function changeColour(colour) {
    document.documentElement.style.setProperty(`--${currentPlayer}-colour`, colour);
}

initialise();
start();