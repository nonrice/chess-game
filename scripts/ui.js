import { get_cell } from "./game.js";

export var USERNAME = "";

export function enter(){
    USERNAME = document.getElementsByClassName("menu-box--input")[0].value;
    if (USERNAME.length > 20 || USERNAME.length < 1){
        alert("Username too long/short.");
    } else {
        document.getElementById("menu-box").innerHTML = "<h1>Waiting for other player...</h1><p id='status'>Connecting to server...</p>";
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