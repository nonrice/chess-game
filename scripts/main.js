import { Chess } from "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.4/chess.min.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { attatch_click, draw_pieces, click } from "./game.js";
import { init_board, show_user_boxes, set_player_box, set_opponent_box, enter, connected, USERNAME } from "./ui.js";

document.getElementById("main_entry").addEventListener("click", main);

function main(){
    var IS_WHITE = false;
    const GAME = new Chess();
    var SELECTION = {
        active: false,
        cell: ""
    }

    enter();

    const SOCKET = io("https://chess-game.nonrice.repl.co");
    
    SOCKET.on("connect", () => {
        connected(SOCKET);
        SOCKET.emit("join", USERNAME);
    });

    SOCKET.on("start_match", (is_white, opp_username) => {
        IS_WHITE = is_white;
        set_player_box(USERNAME);
        set_opponent_box(opp_username);
        show_user_boxes();
        init_board(IS_WHITE);
        attatch_click(IS_WHITE, SELECTION, click, SOCKET, GAME);
        draw_pieces(GAME);
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