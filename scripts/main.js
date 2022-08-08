import { Chess } from "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.4/chess.min.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { attatch_click, draw_pieces, draw_moves, click } from "./game.js";
import { init_board, show_user_boxes, set_user_boxes, flash_player_time, submit_username, logged_in, USERNAME, set_times, internal_alert } from "./ui.js";

document.getElementById("menubox-entry").addEventListener("click", main);

function main() {
    const SERVER = "https://chess-game.nonrice.repl.co";
    var IS_WHITE = false;
    const GAME = new Chess();
    var SELECTION = {
        active: false,
        cell: "",
    };

    if (!submit_username()) return;

    const SOCKET = io(SERVER);

    SOCKET.on("connect", () => {
        logged_in(SOCKET);
        SOCKET.emit("join", USERNAME);
    });

    SOCKET.on("start_match", (is_white, opp_username) => {
        IS_WHITE = is_white;
        set_user_boxes(USERNAME, opp_username);
        show_user_boxes();
        init_board(IS_WHITE);
        attatch_click(IS_WHITE, SELECTION, click, SOCKET, GAME);
        draw_pieces(GAME);
        if (IS_WHITE) flash_player_time();
    });

    SOCKET.on("set_times", (player, opponent) => {
        set_times(player, opponent);
    });

    SOCKET.on("opp_move", (opp_from, opp_to, opp_promotion_piece) => {
        GAME.move({
            from: opp_from,
            to: opp_to,
            promotion: opp_promotion_piece,
        });
        draw_pieces(GAME);
        flash_player_time();
        if (SELECTION.active) draw_moves(SELECTION.cell, GAME);
    });

    SOCKET.on("end_match", (verdict) => {
        internal_alert("Game ended. Reason: " + verdict + ". Reload the page to return to matchmaking.");
        SOCKET.disconnect();
    });
}
