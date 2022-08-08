export class User {
    constructor(username, is_white, opponent, time_left) {
        this.username = username;
        this.is_moving = is_white;
        this.opponent = opponent;
        this.time_left = time_left;
    }
}

export function tick(io, users) {
    for (var user in users)
        if (users[user].opponent != null) {
            if (users[user].is_moving) {
                if (--users[user].time_left == 0) {
                    end_match(user, "out of time");
                } else {
                    io.to(user).emit("set_times", users[user].time_left, users[users[user].opponent].time_left);
                    io.to(users[user].opponent).emit("set_times", users[users[user].opponent].time_left, users[user].time_left);
                }
            }
        }
}

export function end_match(io, users, user, verdict) {
    log("GAME_END", user + ", " + users[user].opponent + "; Reason: " + verdict);
    io.to(user).emit("end_match", verdict);
    io.to(users[user].opponent).emit("end_match", verdict);
}

export function log(topic, content) {
    console.log(new Date().toString().slice(0, 33) + " [" + topic + "] " + content);
}
