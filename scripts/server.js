import { createServer } from "http";
import { Server } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const httpServer = createServer();
const IO = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

var QUEUE = -1;
var PAIRS = {};

IO.on("connection", (socket) => {
    if (QUEUE == -1) {
        QUEUE = socket.id;
        log("JOIN_QUEUE", socket.id);
    } else {
        log("START_GAME", socket.id + ", " + QUEUE);
        PAIRS[socket.id] = QUEUE;
        PAIRS[QUEUE] = socket.id;
        var flip_white = Math.random() > 0.5;
        IO.to(socket.id).emit("start_match", flip_white);
        IO.to(QUEUE).emit("start_match", !flip_white);
        QUEUE = -1;
    }

    socket.on("end_match", () => {
        log("GAME_END_FINISHED", socket.id + ", " + PAIRS[socket.id]);
        IO.to(PAIRS[socket.id]).emit("end_match");
        delete PAIRS[PAIRS[socket.id]];
        delete PAIRS[socket.id];
    });
    
    socket.on("move", (from, to, promotion) => {
        IO.to(PAIRS[socket.id]).emit("opp_move", from, to, promotion);
    });

    socket.on("disconnect", () => {
        if (socket.id in PAIRS){
            log("GAME_END_DISCONNECT", socket.id + ", " + PAIRS[socket.id]);
            IO.to(PAIRS[socket.id]).emit("end_match");
            delete PAIRS[PAIRS[socket.id]];
            delete PAIRS[socket.id];
        } else {
            log("DISCONNECT", socket.id);
            if (QUEUE == socket.id) QUEUE = -1;
        }
    })
});

httpServer.listen(3000);

function log(topic, content){
    console.log((new Date()).toString().slice(0, 33) + " [" + topic + "] " + content);
}
