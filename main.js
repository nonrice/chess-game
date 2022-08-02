import { Chess } from "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.4/chess.min.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const SOCKET = io("https://chess-game.nonrice.repl.co");
var IS_WHITE = false;
const GAME = new Chess();
var SEL = false;
var SEL_CELL = "";

SOCKET.on("start_match", (is_white) => {
    IS_WHITE = is_white;
    init_board(IS_WHITE);
});

SOCKET.on("opp_move", (opp_from, opp_to, opp_promotion_piece) => {
    GAME.move({
        from: opp_from,
        to: opp_to,
        promotion: opp_promotion_piece
    });
    draw_pieces();
});

SOCKET.on("end_match", () => {
    alert("GAME IS OVER");
    document.getElementById("board").innerHTML = ""; // Destory the board
});

function click(){
    var cell = this.id;
    if (!SEL){
        SEL_CELL = cell;
        SEL = true;
        draw_moves(SEL_CELL);
    } else {
        var promotion_piece = "";
        if (will_promote(SEL_CELL, cell)){
            while (true){
                promotion_piece = prompt("Piece to promote to? (n, b, r, k, q)");
                if (promotion_piece.length == 1 && "nbrkq".includes(promotion_piece)) break;
                alert("Not a valid piece dumbo");
            }
        }

        if (GAME.move({
            from: SEL_CELL,
            to: cell,
            promotion: promotion_piece  
        }) != null){
            SOCKET.emit("move", SEL_CELL, cell, promotion_piece);
        }

        draw_pieces();
        clear_moves();
        SEL = false;
    }
    if (GAME.game_over()){
        SOCKET.emit("end_match");
        alert("GAME IS OVER");
        document.getElementById("board").innerHTML = ""; // Destory the board   
    }
}

function will_promote(from, to){
    return GAME.moves({ square: from, verbose: true }).some((move) => {
        return move.to == to && move.flags.includes('p');
    });
}

function draw_pieces(){
    const board = GAME.board();
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.getElementById(get_cell(r, c));
        cell.innerHTML = "";
        if (board[r][c] != null){
            cell.innerHTML = "<img src='assets/board/" + board[r][c].color + board[r][c].type + ".svg' />";
        }
    }
}

function draw_moves(cell){
    const moves = GAME.moves({ square: cell, verbose: true });
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
    board.innerHTML = "";
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.setAttribute("id", get_cell(r, c, is_white));
        cell.addEventListener("click", click);
        if ((r*7+c+1-is_white) % 2) {
            cell.classList.add("board-cell--black");
        } else {
            cell.classList.add("board-cell--white");
        }
        board.append(cell);
    }
    draw_pieces();
}

function get_cell(r, c, is_white=1){
    return String.fromCharCode(c+97) + (is_white*7 + (is_white ? -1 : 1)*(r) + 1).toString();
}