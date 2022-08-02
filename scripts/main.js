import { Chess } from "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.4/chess.min.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { init_board, draw_pieces, click } from "./utils.js";

document.getElementById("main_entry").addEventListener("click", main);

function main(){
    var IS_WHITE = false;
    const GAME = new Chess();
    var SELECTION = {
        active: false,
        cell: ""
    }

    const SOCKET = io("https://chess-game.nonrice.repl.co");

    document.getElementById("menu-box").innerHTML = "<h1>Waiting for other player...</h1><p id='status'>Connecting to server...</p>";
    SOCKET.on("connect", () => {
        document.getElementById("status").innerHTML = "Logged in as " + SOCKET.id; 
    });

    SOCKET.on("start_match", (is_white) => {
        IS_WHITE = is_white;
        init_board(IS_WHITE, SELECTION, click, SOCKET, GAME);
    });

    SOCKET.on("opp_move", (opp_from, opp_to, opp_promotion_piece) => {
        GAME.move({
            from: opp_from,
            to: opp_to,
            promotion: opp_promotion_piece
        });
        draw_pieces(GAME);
    });

    SOCKET.on("end_match", () => {
        alert("Game ended. Note that this is also triggered when your opponent disconnects.");
        location.reload();
    });
}