// Simple Complete Chess Game in JavaScript (With All Rules)

// ===== Chess Game Engine in JavaScript =====

const board = document.getElementById("board");
let gameOver = false;
let turn = "w"; // 'w' for white's turn, 'b' for black
let selected = null;
let fromSquare = null;

// ===== Initial Setup of Pieces =====
const START_POS = {
  0: ["b_rook", "b_knight", "b_bishop", "b_queen", "b_king", "b_bishop", "b_knight", "b_rook"],
  1: Array(8).fill("b_pawn"),
  6: Array(8).fill("w_pawn"),
  7: ["w_rook", "w_knight", "w_bishop", "w_queen", "w_king", "w_bishop", "w_knight", "w_rook"]
};

// Directions for sliding and jumping pieces
const pieceDirs = {
  rook: [[1,0], [-1,0], [0,1], [0,-1]],
  bishop: [[1,1], [1,-1], [-1,1], [-1,-1]],
  queen: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]],
  knight: [[2,1], [1,2], [-1,2], [-2,1], [-2,-1], [-1,-2], [1,-2], [2,-1]],
  king: [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]
};

// ===== Utility Functions =====

function isInBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getPiece(row, col) {
  const el = document.querySelector(`[data-row='${row}'][data-col='${col}'] img`);
  return el?.alt || null;
}

function getColor(piece) {
  return piece?.startsWith("w_") ? "w" : piece?.startsWith("b_") ? "b" : null;
}

function oppositeColor(color) {
  return color === "w" ? "b" : "w";
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
  document.querySelectorAll(".legal-move").forEach(el => el.classList.remove("legal-move"));

}

// ===== Check Detection =====

function isCheck(color) {
  let kingPos = null;

  // Find king
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (getPiece(r, c) === `${color}_king`) kingPos = [r, c];

  if (!kingPos) return true; // King missing = checkmate

  // Check if any enemy piece can capture king
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = getPiece(r, c);
      if (p && getColor(p) === oppositeColor(color)) {
        const moves = getLegalMoves(r, c, p, true);
        if (moves.some(([mr, mc]) => mr === kingPos[0] && mc === kingPos[1])) {
          return true;
        }
      }
    }
  }

  return false;
}

// Backup board state for simulating move
function cloneBoard() {
  return [...document.querySelectorAll(".square")].map(sq => ({
    el: sq,
    row: +sq.dataset.row,
    col: +sq.dataset.col,
    piece: getPiece(+sq.dataset.row, +sq.dataset.col)
  }));
}

// Try move and see if king is in check
function tryMove(from, to) {
  const piece = from.querySelector("img");
  if (!piece) return;

  const fromPiece = piece.alt;
  const cloned = cloneBoard();

  to.innerHTML = "";
  to.appendChild(piece);
  from.innerHTML = "";

  const inCheck = isCheck(getColor(fromPiece));

  // Restore board
  cloned.forEach(({ el, piece }) => {
    el.innerHTML = piece ? `<img src='pieces/${piece}.png' alt='${piece}' />` : "";
  });

  return !inCheck;
}

// ===== Legal Move Generator for Each Piece =====

function getLegalMoves(row, col, piece, skipCheck = false) {
  const color = getColor(piece);
  const moves = [];

  if (piece.endsWith("pawn")) {
    const dir = color === "w" ? -1 : 1;

    // Forward move
    if (!getPiece(row + dir, col)) moves.push([row + dir, col]);

    // Double move from start
    if ((color === "w" && row === 6 || color === "b" && row === 1)
      && !getPiece(row + dir, col) && !getPiece(row + 2 * dir, col)) {
      moves.push([row + 2 * dir, col]);
    }

    // Capture moves
    for (let dc of [-1, 1]) {
      const capture = getPiece(row + dir, col + dc);
      if (capture && getColor(capture) === oppositeColor(color)) {
        moves.push([row + dir, col + dc]);
      }
    }

  } else if (piece.endsWith("knight")) {
    for (let [dr, dc] of pieceDirs.knight) {
      const r = row + dr, c = col + dc;
      const p = getPiece(r, c);
      if (isInBounds(r, c) && (!p || getColor(p) !== color)) {
        moves.push([r, c]);
      }
    }

  } else if (piece.endsWith("king")) {
    for (let [dr, dc] of pieceDirs.king) {
      const r = row + dr, c = col + dc;
      const p = getPiece(r, c);
      if (isInBounds(r, c) && (!p || getColor(p) !== color)) {
        moves.push([r, c]);
      }
    }

  } else {
    // rook / bishop / queen
    const dirs = piece.endsWith("rook") ? pieceDirs.rook
               : piece.endsWith("bishop") ? pieceDirs.bishop
               : pieceDirs.queen;

    for (let [dr, dc] of dirs) {
      for (let i = 1; i < 8; i++) {
        const r = row + dr * i, c = col + dc * i;
        if (!isInBounds(r, c)) break;
        const p = getPiece(r, c);
        if (!p) moves.push([r, c]);
        else {
          if (getColor(p) !== color) moves.push([r, c]);
          break;
        }
      }
    }
  }

  return skipCheck ? moves : moves.filter(([r, c]) => {
    const from = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    const to = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
    return tryMove(from, to);
  });
}

// ===== Main Move Logic =====

function movePiece(from, to) {
  const piece = from.querySelector("img");
  if (!piece) return;

  const legal = getLegalMoves(+from.dataset.row, +from.dataset.col, piece.alt);
  if (!legal.some(([r, c]) => r == +to.dataset.row && c == +to.dataset.col)) return;

  const destPiece = getPiece(+to.dataset.row, +to.dataset.col);
  if (destPiece?.endsWith("king")) {
    alert(`${turn === "w" ? "White" : "Black"} wins!`);
    gameOver = true;
  }

  to.innerHTML = "";
  to.appendChild(piece);
  from.innerHTML = "";

  turn = turn === "w" ? "b" : "w";
  clearHighlights();

  // Checkmate detection
  if (isCheck(turn)) {
    const hasMoves = [...document.querySelectorAll(".square")].some(sq => {
      const p = getPiece(+sq.dataset.row, +sq.dataset.col);
      return p && getColor(p) === turn && getLegalMoves(+sq.dataset.row, +sq.dataset.col, p).length;
    });

    if (!hasMoves) {
      alert(`Checkmate! ${turn === "w" ? "Black" : "White"} wins!`);
      gameOver = true;
    }
  }
}

// ===== Handle Square Clicks =====

function handleClick(square) {
  if (gameOver) return;

  const piece = square.querySelector("img")?.alt;

  if (selected && square !== fromSquare) {
    movePiece(fromSquare, square);
    selected = fromSquare = null;
  } else if (piece && getColor(piece) === turn) {
    clearHighlights();
    selected = square.querySelector("img");
    fromSquare = square;
    
    square.classList.add("highlight");
const row = +square.dataset.row, col = +square.dataset.col;
const moves = getLegalMoves(row, col, piece);
moves.forEach(([r, c]) => {
  const target = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
  if (target) target.classList.add("legal-move");
});

  }
}

// ===== Board Setup =====

function createSquare(row, col) {
  const sq = document.createElement("div");
  sq.classList.add("square");
  sq.classList.add((row + col) % 2 === 0 ? "white" : "green");
  sq.dataset.row = row;
  sq.dataset.col = col;

  if (START_POS[row]?.[col]) {
    const img = document.createElement("img");
    img.src = `pieces/${START_POS[row][col]}.png`;
    img.alt = START_POS[row][col];
    sq.appendChild(img);
  }

  sq.addEventListener("click", () => handleClick(sq));
  return sq;
}

for (let r = 0; r < 8; r++)
  for (let c = 0; c < 8; c++)
    board.appendChild(createSquare(r, c));
