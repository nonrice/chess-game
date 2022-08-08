import { get_cell } from "./game.js";

document.getElementById("popup-msg--close").addEventListener("click", hide_internal_alert);

export var USERNAME = "";

export function set_times(player, opponent) {
    document.getElementById("userbox-time--player").innerHTML = pad(Math.floor(player / 60)) + ":" + pad(player % 60);
    document.getElementById("userbox-time--opponent").innerHTML = pad(Math.floor(opponent / 60)) + ":" + pad(opponent % 60);
}

export function submit_username() {
    USERNAME = document.getElementsByClassName("menubox-input")[0].value;
    if (USERNAME.length > 19 || USERNAME.length < 1) {
        internal_alert("Username too long/short.");
        return false;
    } else {
        document.getElementById("menubox").innerHTML = "<h1>Waiting for other player...</h1><p id='status'>Connecting to server...</p>";
        return true;
    }
}

export function logged_in(socket) {
    if (USERNAME == "") USERNAME = socket.id;
    socket.emit("set_username", USERNAME);
    document.getElementById("status").innerHTML = "Logged in as " + USERNAME;
}

export function init_board(is_white) {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (var r = 0; r < 8; ++r)
        for (var c = 0; c < 8; ++c) {
            var cell = document.createElement("div");
            cell.classList.add("board-cell");
            cell.setAttribute("id", get_cell(r, c, is_white));
            if ((r * 7 + c + 1 - is_white) % 2) {
                cell.classList.add("board-cell--black");
            } else {
                cell.classList.add("board-cell--white");
            }
            board.append(cell);
        }
}

export function set_user_boxes(username, opp_username) {
    document.getElementById("userbox-name--player").innerHTML = username;
    document.getElementById("userbox-name--opponent").innerHTML = opp_username;
}

export function show_user_boxes() {
    for (const box of document.getElementsByClassName("userbox")) {
        if (box.style.display == "block") {
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
    }
}

export function flash_player_time() {
    const user_box = document.getElementById("userbox-time--player");
    user_box.style.color = "black";
    setTimeout(() => {
        user_box.style.color = "white";
        setTimeout(() => {
            user_box.style.color = "black";
            setTimeout(() => {
                user_box.style.color = "white";
            }, 100);
        }, 100);
    }, 100);
}

export function internal_alert(message) {
    document.getElementById("popup-msg--content").innerHTML = message;
    document.getElementById("popup-msg").style.display = "block";
}

function hide_internal_alert() {
    document.getElementById("popup-msg").style.display = "none";
}

export function selected_promotion() {
    document.getElementById("popup-promo").style.display = "none";
    console.log(piece);
    return piece;
}

export async function get_promotion(is_white) {
    document.getElementById("popup-promo").style.display = "flex";
    var pieces = document.getElementsByClassName("popup-promo--piece");
    for (var i = 0; i < 4; ++i) {
        pieces[i].setAttribute("src", "assets/lichess_pixel/" + (is_white ? "w" : "b") + "nbrq"[i] + ".svg");
    }
    return new Promise((resolve) => {
        pieces[0].onclick = () => {
            resolve("n");
            document.getElementById("popup-promo").style.display = "none";
        };
        pieces[1].onclick = () => {
            resolve("b");
            document.getElementById("popup-promo").style.display = "none";
        };
        pieces[2].onclick = () => {
            resolve("r");
            document.getElementById("popup-promo").style.display = "none";
        };
        pieces[3].onclick = () => {
            resolve("q");
            document.getElementById("popup-promo").style.display = "none";
        };
    });
}

function pad(number) {
    if (number < 10) return "0" + number.toString();
    return number.toString();
}
