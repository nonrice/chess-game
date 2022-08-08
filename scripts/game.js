import { get_promotion } from "./ui.js";

export async function click(is_white, selection, socket, game) {
    var cell = this.id;
    if (!selection.active && game.get(this.id) != null && is_white == (game.get(this.id).color == "w")) {
        selection.cell = cell;
        selection.active = true;
        draw_moves(selection.cell, game);
    } else {
        var promotion_piece = "";
        if (will_promote(selection.cell, cell, game)) {
            promotion_piece = await get_promotion(is_white);
        }

        if (
            game.move({
                from: selection.cell,
                to: cell,
                promotion: promotion_piece,
            }) != null
        ) {
            socket.emit("move", selection.cell, cell, promotion_piece);
        }

        draw_pieces(game);
        clear_moves();
        selection.active = false;
    }
    if (game.game_over()) {
        socket.emit("end_match", get_verdict(game));
    }
}

function will_promote(from, to, game) {
    return game.moves({ square: from, verbose: true }).some((move) => {
        return move.to == to && move.flags.includes("p");
    });
}

export function draw_pieces(game) {
    const board = game.board();
    for (var r = 0; r < 8; ++r)
        for (var c = 0; c < 8; ++c) {
            var cell = document.getElementById(get_cell(r, c));
            cell.innerHTML = "";
            if (board[r][c] != null) {
                cell.innerHTML = "<img src='assets/lichess_pixel/" + board[r][c].color + board[r][c].type + ".svg' />";
            }
        }
}

export function draw_moves(cell, game) {
    const moves = game.moves({ square: cell, verbose: true });
    clear_moves();
    document.getElementById(cell).classList.add("board-cell--selected");
    for (const move of moves) {
        document.getElementById(move.to).classList.add("board-cell--selected");
    }
}

function clear_moves() {
    for (var r = 0; r < 8; ++r)
        for (var c = 0; c < 8; ++c) {
            document.getElementById(get_cell(r, c)).classList.remove("board-cell--selected");
        }
}

export function attatch_click(is_white, selection, click, socket, game) {
    const cells = document.getElementsByClassName("board-cell");
    for (const cell of cells) {
        cell.addEventListener("click", click.bind(cell, is_white, selection, socket, game));
    }
}

export function get_cell(r, c, is_white = 1) {
    return String.fromCharCode(c + 97) + (is_white * 7 + (is_white ? -1 : 1) * r + 1).toString();
}

function get_verdict(game) {
    var side = game.turn == "w" ? "black" : "white";
    if (game.in_checkmate()) {
        return side + " wins via checkmate";
    } else if (game.in_draw()) {
        return "draw";
    } else if (game.in_stalemate()) {
        return "stalemate";
    } else if (game.in_threefold_repetition()) {
        return "threefold repetition (draw)";
    } else if (game.insufficient_material()) {
        return "insufficient material (draw)";
    }
}
