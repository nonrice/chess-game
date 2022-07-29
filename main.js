import { Chess } from './chess.js'

const GAME = new Chess();
var SEL = false;
var SEL_CELL = "";

// NEED TO INITIALIZE THIS PER PLAYER
var IS_WHITE = true;

init_board(IS_WHITE);

function click(){
    var cell = this.id;
    if (!SEL){
        SEL_CELL = cell;
        SEL = true;
        draw_moves(SEL_CELL);
    } else {
        var promotion_piece = "";
        if (can_promote(SEL_CELL)){
            while (true){
                promotion_piece = prompt("Piece to promote to? (n, b, r, k, q)");
                if (promotion_piece.length == 1 && "nbrkq".includes(promotion_piece)){
                    break;
                }
                alert("Not a valid piece dumbo");
            }
        }

        // NEED TO SOMEHOW SEND THIS TO THE OTHER GUY
        GAME.move({
            from: SEL_CELL,
            to: cell,
            promotion: promotion_piece  
        });

        draw_pieces();
        clear_moves();
        SEL = false;
    }

    if (GAME.game_over()){
        alert("GAME IS OVER")
    }
}

function can_promote(cell){
    console.log(GAME.moves({square: cell, verbose: true}));
    for (const move of GAME.moves({ square: cell, verbose: true })){
        if (move.flags.includes('p')){
            return true;
        }
    }
    return false;
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

function draw_moves(cell){
    const moves = GAME.moves({
        square: cell,
        verbose: true
    });

    clear_moves();
    document.getElementById(cell).classList.add("board-cell--selected");
    for (const move of moves){
        document.getElementById(move.to).classList.add("board-cell--selected");
    }
}

function clear_moves(){
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        document.getElementById(get_cell(r, c)).classList.remove("board-cell--selected");
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
