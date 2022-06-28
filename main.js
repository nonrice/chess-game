var board = [
    [10, 8, 9, 11, 12, 9, 8, 10],
    [7, 7, 7, 7, 7, 7, 7, 7],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [4, 2, 3, 5, 6, 3, 2, 4]
]

var valid_moves = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

var move_funcs = [pawn_moves, knight_moves, bishop_moves, rook_moves, queen_moves, king_moves];

var is_sel = false;
var sel_r = -1;
var sel_c = -1;

var is_flipped = false;

init_board();
draw_board(board, is_flipped);

function click() {
    var r = Math.abs(7*is_flipped - parseInt(this.id[1]));
    var c = parseInt(this.id[2]);
    
    if (is_sel) {
        if (valid_moves[r][c]) {
            board[r][c] = board[sel_r][sel_c];
            board[sel_r][sel_c] = 0;
            flip_board(board, is_flipped);
        }
        clear_board(valid_moves);
        is_sel = false;
    } else {
        if (board[r][c]) {
            sel_r = r;
            sel_c = c;
            is_sel = true;

            if (board[r][c]-1 >= 0 && board[r][c] <= 6) {
                move_funcs[board[r][c]-1](r, c, board, valid_moves);
            }
        }
    }

    draw_board(board, is_flipped);
    highlight_board(valid_moves);
    if (is_sel) toggle_highlight(Math.abs(7*is_flipped - r), c);
}

function pawn_moves(r, c, board, valid_moves) {
    if (r>0) {
        if (board[r-1][c] == 0) {
            valid_moves[r-1][c] = 1;
        }
        if (r==6 && board[r-2][c] == 0) {
            valid_moves[r-2][c] = 1;
        }
        if (board[r-1][c-1] && board[r-1][c-1] > 6) {
            valid_moves[r-1][c-1] = 1;
        }
        if (board[r-1][c+1] && board[r-1][c+1] > 6) {
            valid_moves[r-1][c+1] = 1;
        }
    }
}

function knight_moves(r, c, board, valid_moves) {
    var moves = [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2]
    ];
    for (var i=0; i<moves.length; ++i) {
        var r2 = r + moves[i][0];
        var c2 = c + moves[i][1];
        if (r2>=0 && r2<8 && c2>=0 && c2<8) {
            if (board[r2][c2] == 0 || board[r2][c2] > 6) {
                valid_moves[r2][c2] = 1;
            }
        }
    }
}

function bishop_moves(r, c, board, valid_moves) {
    var moves = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ];
    for (var i=0; i<moves.length; ++i) {
        var r2 = r + moves[i][0];
        var c2 = c + moves[i][1];
        while (r2>=0 && r2<8 && c2>=0 && c2<8) {
            if (board[r2][c2] == 0) {
                valid_moves[r2][c2] = 1;
            } else {
                if (board[r2][c2] > 6){
                    valid_moves[r2][c2] = 1;
                }
                break;
            }
            r2 += moves[i][0];
            c2 += moves[i][1];
        }
    }
}

function rook_moves(r, c, board, valid_moves) {
    var moves = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
    for (var i=0; i<moves.length; ++i) {
        var r2 = r + moves[i][0];
        var c2 = c + moves[i][1];
        while (r2>=0 && r2<8 && c2>=0 && c2<8) {
            if (board[r2][c2] == 0) {
                valid_moves[r2][c2] = 1;
            } else {
                if (board[r2][c2] > 6){
                    valid_moves[r2][c2] = 1;
                }
                break;
            }
            r2 += moves[i][0];
            c2 += moves[i][1];
        }
    }
}

function queen_moves(r, c, board, valid_moves) {
    rook_moves(r, c, board, valid_moves);
    bishop_moves(r, c, board, valid_moves);
}

function king_moves(r, c, board, valid_moves) {
    var moves = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1]
    ];
    for (var i=0; i<moves.length; ++i) {
        var r2 = r + moves[i][0];
        var c2 = c + moves[i][1];
        if (r2>=0 && r2<8 && c2>=0 && c2<8) {
            if (board[r2][c2] == 0) {
                valid_moves[r2][c2] = 1;
            } else {
                if (board[r2][c2] > 6){
                    valid_moves[r2][c2] = 1;
                }
            }
        }
    }
}

function draw_board(board){
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.getElementById("c" + Math.abs(7*is_flipped - r).toString() + c.toString());
        if (board[r][c]) {
            cell.innerHTML = "<img src='assets/" + ((board[r][c]-1 + 6*is_flipped)%12 + 1).toString() + ".svg' />";
        } else {
            cell.innerHTML = " ";
        }
    }
}

function highlight_board(highlights){
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.getElementById("c" + Math.abs(7*is_flipped - r).toString() + c.toString());
        if (highlights[r][c]) {
            cell.classList.add("board-cell--selected");
        } else {
            cell.classList.remove("board-cell--selected");
        }
    }
}

function flip_board(board){
    board.reverse();
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        if (board[r][c]) {
            board[r][c] = (board[r][c]+5)%12 + 1;
        }
    }
    is_flipped ^= 1;
}

function toggle_highlight(r, c) {
    var cell = document.getElementById("c" + r.toString() + c.toString());
    if (cell.classList.contains("board-cell--selected")) {
        cell.classList.remove("board-cell--selected");
    } else {
        cell.classList.add("board-cell--selected");
    }
}

function init_board() {
    const board = document.getElementById("board");
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.setAttribute("id", "c" + r.toString() + c.toString());
        cell.addEventListener("click", click);
        if ((r*7+c) % 2) {
            cell.classList.add("board-cell--black");
        } else {
            cell.classList.add("board-cell--white");
        }
        board.append(cell);
    }
}

function clear_board(board){
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        board[r][c] = 0;
    }
}
