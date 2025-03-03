const boardElement = document.getElementById("chessboard");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const size = 8;

let initialCellChosen = false;
let initialRow = null;
let initialCol = null;
let solutionMoves = []; // Array of {row, col} hərəkət ardıcıllığı
let animationTimeout = null;

// Atın mümkün "L" hərəkətlərinin offsetləri
const knightMoves = [
  { dr: -2, dc: -1 },
  { dr: -2, dc: 1 },
  { dr: -1, dc: -2 },
  { dr: -1, dc: 2 },
  { dr: 1,  dc: -2 },
  { dr: 1,  dc: 2 },
  { dr: 2,  dc: -1 },
  { dr: 2,  dc: 1 }
];

// Taxtanı yaradırıq
function createBoard() {
  boardElement.innerHTML = ""; // Əvvəlki xanaları təmizləyirik
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell", (row + col) % 2 === 0 ? "white" : "black");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", handleInitialCellClick);
      boardElement.appendChild(cell);
    }
  }
  // Resetlərlə bağlı dəyişənlər:
  initialCellChosen = false;
  initialRow = null;
  initialCol = null;
  solutionMoves = [];
}

// İstifadəçi kliklədiyi xanaya “1” qoyur
function handleInitialCellClick(event) {
  if (initialCellChosen) return; // Yalnız bir dəfə seçim edilir
  const cell = event.target;
  if (cell.textContent !== "") return;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  cell.textContent = "1";
  cell.classList.add("selected");
  initialCellChosen = true;
  initialRow = row;
  initialCol = col;
}

// Backtracking alqoritmi ilə tam knight's tour tapırıq
function computeKnightTour() {
  // 2D array yaradaraq hər xanaya 0 (ziyaret olunmayıb) dəyəri veririk
  const board = Array.from({ length: size }, () => Array(size).fill(0));
  board[initialRow][initialCol] = 1;
  const moves = [{ row: initialRow, col: initialCol }];
  if (solveKnightTour(initialRow, initialCol, 1, board, moves)) {
    return moves;
  } else {
    return null; // Bu 8x8 üçün mümkün olmamalıdır
  }
}

// Recursive backtracking funksiyası
function solveKnightTour(x, y, move, board, moves) {
  if (move === size * size) {
    return true; // Bütün xanalar dolduruldu
  }
  // Mövcud mövqedən etibarlı hərəkətləri tapırıq
  let nextMoves = [];
  knightMoves.forEach(offset => {
    const newX = x + offset.dr;
    const newY = y + offset.dc;
    if (isValid(newX, newY, board)) {
      // Hər bir namizəd üçün növbəti etibarlı hərəkətlərin sayını hesablayaq (Warnsdorff qaydası üçün)
      let count = 0;
      knightMoves.forEach(off => {
        const xx = newX + off.dr;
        const yy = newY + off.dc;
        if (isValid(xx, yy, board)) count++;
      });
      nextMoves.push({ row: newX, col: newY, degree: count });
    }
  });
  // Dərəcəyə (degree) görə artan sırada sıralayırıq
  nextMoves.sort((a, b) => a.degree - b.degree);
  // Hər bir etibarlı hərəkət üçün cəhd edirik
  for (let moveObj of nextMoves) {
    board[moveObj.row][moveObj.col] = move + 1;
    moves.push({ row: moveObj.row, col: moveObj.col });
    if (solveKnightTour(moveObj.row, moveObj.col, move + 1, board, moves)) {
      return true;
    }
    // Əgər uğursuz olarsa, geri qayıdın
    board[moveObj.row][moveObj.col] = 0;
    moves.pop();
  }
  return false;
}

// Yoxlayırıq ki, koordinatlar etibarlıdır və hüceyrə boşdur
function isValid(x, y, board) {
  return x >= 0 && x < size && y >= 0 && y < size && board[x][y] === 0;
}

// Həll ardıcıllığı tapıldıqdan sonra animasiya ilə xanaları nömrələyirik
function animateSolution(index) {
  if (index >= solutionMoves.length) {
    alert("Təbriklər! Bütün xanalar doldu!");
    startButton.disabled = false;
    return;
  }
  const move = solutionMoves[index];
  const cell = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
  // Hüceyrəni nömrələyirik (index + 1, çünki ilk hərəkət 1-dir)
  cell.textContent = index + 1;
  cell.classList.add("selected");
  // Növbəti hərəkət üçün 300ms fasilə
  animationTimeout = setTimeout(() => animateSolution(index + 1), 300);
}

// "Start" düyməsinə klik edildikdə knight's tour hesablanır və animasiya başlayır
startButton.addEventListener("click", () => {
  if (!initialCellChosen) {
    alert("Zəhmət olmasa əvvəlcə istədiyiniz xanaya klikləyərək başlanğıc nömrəni (1) təyin edin!");
    return;
  }
  startButton.disabled = true;
  // Hesablama prosesini başlat və nəticəni saxla
  solutionMoves = computeKnightTour();
  if (solutionMoves) {
    // Animasiya zamanı ilkin xanaya artıq "1" qoyulub, bundan sonra 2-dən başlayırıq
    animateSolution(1);
  } else {
    alert("Həll tapılmadı!");
    startButton.disabled = false;
  }
});

// "Yenidən Başla" düyməsi: hər şeyi sıfırlayır
restartButton.addEventListener("click", () => {
  if (animationTimeout) clearTimeout(animationTimeout);
  startButton.disabled = false;
  createBoard();
});

// İlk başda taxtanı yaradırıq
createBoard();