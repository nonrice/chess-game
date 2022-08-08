import { createServer } from "http";
import { Server } from "socket.io";
import { User, tick, end_match, log } from "./scripts/utils.js";

const HTTPSERVER = createServer();
const IO = new Server(HTTPSERVER, { cors: { origin: "*" } });

var QUEUE = -1;
var USERS = {};

setInterval(tick.bind(null, IO, USERS), 1000);

IO.on("connection", (socket) => {
    log("CONNECTED", socket.id);

    socket.on("join", (username) => {
        USERS[socket.id] = new User(username, false, null, 600);
        if (QUEUE == -1) {
            log("JOINED_QUEUE", socket.id);
            QUEUE = socket.id;
        } else {
            log("START_GAME", socket.id + ", " + QUEUE);
            USERS[socket.id].opponent = QUEUE;
            USERS[QUEUE].opponent = socket.id;
            var flip_white = Math.random() > 0.5;
            USERS[flip_white ? socket.id : QUEUE].is_moving = true;
            IO.to(socket.id).emit("start_match", flip_white, USERS[QUEUE].username);
            IO.to(QUEUE).emit("start_match", !flip_white, USERS[socket.id].username);
            QUEUE = -1;
        }
    });

    socket.on("end_match", (verdict) => {
        end_match(IO, USERS, socket.id, verdict);
    });

    socket.on("move", (from, to, promotion) => {
        IO.to(USERS[socket.id].opponent).emit("opp_move", from, to, promotion);
        USERS[socket.id].is_moving = false;
        USERS[USERS[socket.id].opponent].is_moving = true;
    });

    socket.on("disconnect", () => {
        log("DISCONNECT", socket.id);
        end_match(IO, USERS, socket.id, "player disconnected");
        delete USERS[socket.id];
        if (QUEUE == socket.id) QUEUE = -1;
    });
});

HTTPSERVER.listen(3000);
