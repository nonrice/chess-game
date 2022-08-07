import { get_cell } from "./game.js";

document.getElementById("popup-close").addEventListener("click", hide_internal_alert);

export var USERNAME = "";

export function set_times(player, opponent){
    document.getElementById("time-box--player").innerHTML = pad(Math.floor(player/60)) + ":" + pad(player%60);
    document.getElementById("time-box--opponent").innerHTML = pad(Math.floor(opponent/60)) + ":" + pad(opponent%60);
}

export function enter(){
    USERNAME = document.getElementsByClassName("menu-box--input")[0].value;
    if (USERNAME.length > 19 || USERNAME.length < 1){
        internal_alert("Username too long/short.");
        return false;
    } else {
        document.getElementById("menu-box").innerHTML = "<h1>Waiting for other player...</h1><p id='status'>Connecting to server...</p>";
        return true;
    }
}

export function connected(socket){
    if (USERNAME == "") USERNAME = socket.id;
    socket.emit("set_username", USERNAME);
    document.getElementById("status").innerHTML = "Logged in as " + USERNAME; 
}

export function init_board(is_white) {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (var r=0; r<8; ++r) for (var c=0; c<8; ++c) {
        var cell = document.createElement("div");
        cell.classList.add("board-cell");
        cell.setAttribute("id", get_cell(r, c, is_white));
        if ((r*7+c+1-is_white) % 2) {
            cell.classList.add("board-cell--black");
        } else {
            cell.classList.add("board-cell--white");
        }
        board.append(cell);
    }
}

export function set_player_box(username){
    document.getElementById("user-box--player").innerHTML = username;
}

export function set_opponent_box(username){
    document.getElementById("user-box--opponent").innerHTML = username;
}

export function show_user_boxes(){
    for (const box of document.getElementsByClassName("user-box")){
        if (box.style.display == "block"){
            box.style.display = "none";
        } else {
            box.style.display = "block";
        }
    }
}

export function internal_alert(message){
    document.getElementById("popup-content").innerHTML = message;
    document.getElementById("popup-msg").style.display = "block";
}

function hide_internal_alert(){
    document.getElementById("popup-msg").style.display = "none";
}

export function selected_promotion(){
    document.getElementById("popup-promo").style.display = "none";
    console.log(piece);
    return piece;
}

export async function get_promotion(is_white){
    document.getElementById("popup-promo").style.display = "flex";
    var pieces = document.getElementsByClassName("promo");
    for (var i=0; i<4; ++i){
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

function pad(number){
    if (number < 10) return "0" + number.toString();
    return number.toString();
}