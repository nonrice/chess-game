/*

White:
P N B R Q K
1 2 3 4 5 6

Black:
P N B R  Q  K
7 8 9 10 11 12

Valid move indicator:
13

*/

board = [
    [10, 8, 9, 11, 12, 9, 8, 10],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [4, 2, 3, 5, 6, 3, 2, 4]
]

init_board();
draw_board(board);

function draw_board(board){
    for (var r=0; r<8; ++r){
        for (var c=0; c<8; ++c){
            var cell = document.getElementById("c" + c.toString() + r.toString());
            if (board[r][c])
                cell.innerHTML = "<img src='pieces/" + board[r][c].toString() + ".svg' />";
        }
    }
}

function init_board() {
    const board = document.getElementById("board");
    for (var r=0; r<8; ++r) {
        for (var c=0; c<8; ++c) {
            var cell = document.createElement("div");
            cell.classList.add("board-cell");
            cell.setAttribute("id", "c" + c.toString() + r.toString());
            if ((r*7+c) % 2) {
                cell.classList.add("board-cell--black");
            } else {
                cell.classList.add("board-cell--white");
            }
            board.append(cell);
        }
    }
}
