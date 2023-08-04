let board = Array(9).fill(null);
let currentPlayer = 'Light';
let moveFrom = null;
let phase = 1; // 1: placing, 0: moving

const cells = Array.from(document.querySelectorAll('.cell'));

function updateUI() {
    document.getElementById('turnColour').className = currentPlayer;
}

cells.forEach((cell, i) => {
    cell.addEventListener('click', () => {
        if (board[i] === null && moveFrom !== null) {
            if (!isLegalMove(moveFrom, i)) {
                cells[i].classList.add('illegal');
                setTimeout(() => { cells[i].classList.remove('illegal') }, 300)
                return;
            }
            // If the cell clicked has no content and they are moving a piece
            // Reset moveFrom cell
            cells[moveFrom].classList.remove('highlight');
            cells[moveFrom].classList.remove(currentPlayer);
            board[moveFrom] = null;

            // Set new cell
            board[i] = currentPlayer;
            cells[i].classList.add(currentPlayer);

            // Toggle player
            currentPlayer = currentPlayer === 'Light' ? 'Dark' : 'Light';

            // Reset moveFrom
            moveFrom = null;
        } else if (board[i] === null && phase === 1) {
            // If they are placing a piece and the cell clicked has no content
            // set the new piece
            board[i] = currentPlayer;
            cell.classList.add(currentPlayer);

            // Toggle player
            currentPlayer = currentPlayer === 'Light' ? 'Dark' : 'Light';

            // Check if the placing phase is over or not, if it is, modify 
            if (board.filter(x => x !== null).length >= 6) {
                phase = 0;
                alert("Placing phase over, take turns moving pieces");
            }
        } else if (board[i] === currentPlayer && phase === 0) {
            // If they are selecting which piece to move
            if (moveFrom !== null) {
                cells[moveFrom].classList.remove('highlight');
            }
            moveFrom = i;
            cell.classList.add('highlight');
        }
        updateUI();
        if (checkWin()) {
            showWin();
            // location.reload();
        }
    });
});

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
    board = Array(9).fill(null);

    currentPlayer = 'Light';
    moveFrom = null;
    phase = 1; // 1: placing, 0: moving
}

function start() {
    initialise();
    updateUI();

    cells.forEach((cell, i) => {
        cell.addEventListener('click', () => {
            if (board[i] === null && moveFrom !== null) {
                if (!isLegalMove(moveFrom, i)) {
                    cells[i].classList.add('illegal');
                    setTimeout(() => { cells[i].classList.remove('illegal') }, 300)
                    return;
                }
                // If the cell clicked has no content and they are moving a piece
                // Reset moveFrom cell
                cells[moveFrom].classList.remove('highlight');
                cells[moveFrom].classList.remove(currentPlayer);
                board[moveFrom] = null;

                // Set new cell
                board[i] = currentPlayer;
                cells[i].classList.add(currentPlayer);

                // Toggle player
                currentPlayer = currentPlayer === 'Light' ? 'Dark' : 'Light';

                // Reset moveFrom
                moveFrom = null;
            } else if (board[i] === null && phase === 1) {
                // If they are placing a piece and the cell clicked has no content
                // set the new piece
                board[i] = currentPlayer;
                cell.classList.add(currentPlayer);

                // Toggle player
                currentPlayer = currentPlayer === 'Light' ? 'Dark' : 'Light';

                // Check if the placing phase is over or not, if it is, modify 
                if (board.filter(x => x !== null).length >= 6) {
                    phase = 0;
                    alert("Placing phase over, take turns moving pieces");
                }
            } else if (board[i] === currentPlayer && phase === 0) {
                // If they are selecting which piece to move
                if (moveFrom !== null) {
                    cells[moveFrom].classList.remove('highlight');
                }
                moveFrom = i;
                cell.classList.add('highlight');
            }

            updateUI();

            if (checkWin()) {
                showWin();
                setTimeout(() => {
                    animateClear();
                    start();
                }, 2500)
            }
        });
    });
}

function animateClear() {
    cells.forEach((cell) => {
        cell.className = "shake cell";
    });
}

function colourMenu() {
    let colour = prompt("Enter colour:"); // TODO: nice UI
    changeColour(colour);
}

function changeColour(colour) {
    document.documentElement.style.setProperty(`--${currentPlayer}-colour`, colour);
}

start();