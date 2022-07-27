import { Chess } from './chess.js'

const GAME = new Chess();
var SEL = false;
var SEL_CELL = "";
var IS_WHITE = true;

init_board(IS_WHITE);

function click(){
    var cell = this.id;
    if (!SEL){
        SEL_CELL = cell;
        SEL = true;
    } else {
        GAME.move({
            from: SEL_CELL,
            to: cell 
        });
        draw_pieces();
        SEL = false;
    }

    if (GAME.game_over()){
        alert("GAME IS OVER")
    }
}

function draw_pieces(){
    const board = GAME.board();
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.getElementById(get_cell(r, c));
        if (board[r][c] != null){
            cell.innerHTML = "<img src='assets/" + board[r][c].color + board[r][c].type + ".svg' />";
        } else {
            cell.innerHTML = "";
        }
    }
}

function init_board(is_white) {
    const board = document.getElementById("board");
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.setAttribute("id", get_cell(r, c, is_white));
        cell.addEventListener("click", click);
        if ((r*7+c) % 2) {
            cell.classList.add("board-cell--black");
        } else {
            cell.classList.add("board-cell--white");
        }
        board.append(cell);
    }
    draw_pieces();
}

function get_cell(r, c, is_white=1){
    return String.fromCharCode(c+97) + (is_white*7 - r + 1).toString();
}
