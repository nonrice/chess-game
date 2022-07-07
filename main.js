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

var all_valid_caps = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

var is_sel = false;
var sel_r = 0;
var sel_c = 0;

init_board();
draw_board(board, valid_moves);

function click() {
    var r = parseInt(this.id[1]);
    var c = parseInt(this.id[2]);
    
    if (is_sel && valid_moves[r][c]) {
        var capped = board[r][c];
        board[r][c] = board[sel_r][sel_c];
        board[sel_r][sel_c] = 0;

        var [king_r, king_c] = find_king(board, board[r][c] > 6);
        if (is_in_check(board, all_valid_caps, king_r, king_c)) {
            alert("that puts you in check dumbo");
            board[sel_r][sel_c] = board[r][c];
            board[r][c] = capped;
        }

        is_sel = false;
        remove_highlight(sel_r, sel_c);
    } else {
        clear_board(valid_moves);
        if (board[r][c]) {
            remove_highlight(sel_r, sel_c);
            sel_r = r;
            sel_c = c;
            is_sel = true;
            add_highlight(r, c);

            if (board[r][c]-1 >= 0) {
                [pawn_moves, knight_moves, bishop_moves, rook_moves, queen_moves, king_moves][board[r][c]-1-(board[r][c]>6)*6](r, c, board, valid_moves);
            }
        } else {
            remove_highlight(sel_r, sel_c);
        }
    }

    draw_board(board);
    is_in_check(board, all_valid_caps, r, c);
}

function find_king(board, is_black) {
    for (var r=0; r<8; r++) for (var c=0; c<8; c++) {
        if (board[r][c] == (is_black ? 12 : 6)) {
            return [r, c];
        }
    }
}

function is_in_check(board, all_valid_caps, r, c) {
    get_all_caps(board[r][c]>6, board, all_valid_caps);
    return all_valid_caps[r][c]==1;
}

function get_all_caps(is_black, board, all_valid_caps){
    clear_board(all_valid_caps);
    for (var r=0; r<8; r++) for (var c=0; c<8; c++) {
        if (board[r][c] && ((is_black && board[r][c] <= 6) || (!is_black && board[r][c] > 6))) {
            [pawn_moves, knight_moves, bishop_moves, rook_moves, queen_moves, king_moves][board[r][c]-1-(!is_black)*6](r, c, board, all_valid_caps);
        }
    }
}

function pawn_moves(r, c, board, valid_moves) {
    var is_black = board[r][c] > 6;
    if (is_black && r<7) {
        if (board[r+1][c] == 0) {
            valid_moves[r+1][c] = 1;
            if (r==1 && board[r+2][c] == 0) {
                valid_moves[r+2][c] = 1;
            }
        }
        if (c>0 && board[r+1][c-1] && board[r+1][c-1] <= 6) {
            valid_moves[r+1][c-1] = 1;
        }
        if (c<7 && board[r+1][c+1] && board[r+1][c+1] <= 6) {
            valid_moves[r+1][c+1] = 1;
        }
    } else if (!is_black && r>0) {
        if (board[r-1][c] == 0) {
            valid_moves[r-1][c] = 1;
            if (r==6 && board[r-2][c] == 0) {
                valid_moves[r-2][c] = 1;
            }
        }
        if (c>0 && board[r-1][c-1] && board[r-1][c-1] > 6) {
            valid_moves[r-1][c-1] = 1;
        }
        if (c<7 && board[r-1][c+1] && board[r-1][c+1] > 6) {
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
        if (is_in_board(r2, c2)) {
            if (board[r2][c2] == 0 || is_opp(r, c, r2, c2, board)) {
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
        while (is_in_board(r2, c2)) {
            if (board[r2][c2] == 0) {
                valid_moves[r2][c2] = 1;
            } else {
                if (is_opp(r, c, r2, c2, board)){
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
        while (is_in_board(r2, c2)) {
            if (board[r2][c2] == 0) {
                valid_moves[r2][c2] = 1;
            } else {
                if (is_opp(r, c, r2, c2, board)){
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
        if (is_in_board(r2, c2) && (board[r2][c2]==0 || is_opp(r, c, r2, c2, board))) {
            valid_moves[r2][c2] = 1;
        }
    }
}

function is_opp(r, c, r2, c2, board){
    return board[r][c] <= 6 && board[r2][c2] > 6 || board[r][c] > 6 && board[r2][c2] <= 6; 
}

function is_in_board(r, c){
    return r>=0 && r<8 && c>=0 && c<8;
}

function remove_highlight(r, c) {
    var cell = document.getElementById("c" + r.toString() + c.toString());
    if (cell.classList.contains("board-cell--selected")) {
        cell.classList.remove("board-cell--selected");
    } 
}

function add_highlight(r, c) {
    var cell = document.getElementById("c" + r.toString() + c.toString());
    if (!cell.classList.contains("board-cell--selected")) {
        cell.classList.add("board-cell--selected");
    }
}

function draw_board(board){
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.getElementById("c" + r.toString() + c.toString());
        if (board[r][c]) {
            cell.innerHTML = "<img src='assets/" + board[r][c].toString() + ".svg' />";
        } else {
            cell.innerHTML = " ";
        }
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
