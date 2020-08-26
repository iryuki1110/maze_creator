var canvas = document.getElementById("main");
var ctx = canvas.getContext("2d");
var maze_line;
var maze_row;
var maze;
var d;
var dx;
var dy;
var gx;
var gy;

function clickButton_002() {
    var number;
    number = document.form_004.textBox_001.value;
    if(number%2==0){
        alert("奇数を入力してください");
    }
    else if(101 < number){
        alert("101を超えています");
    }
    else if(number < 5){
        alert("5以上の値を入れてください");
    }
    else{
        init(number);
        maze_create();
        maze_creater();
    }
}

function init(number){
    maze_line = number;
    maze_row = number;
    canvas.width = 40 * maze_row;
    canvas.height = 40 * maze_line;
    maze = new Array(maze_line);
    d = new Array(maze_line);
    dx = [0, 0, 0, 0, -1, -2, 1, 2];
    dy = [-1, -2, 1, 2, 0, 0, 0, 0];

    for (let i = 0; i < maze_line; i++) {
        maze[i] = new Array(maze_row);
        d[i] = new Array(maze_row);
        for (let j = 0; j < maze_row; j++) {
            maze[i][j] = 1;
            d[i][j] = -1;
        }
    }
}

function maze_modify(){
    var sx = 1;
    var sy = 1;
    var dx = [0,0,-1,1];
    var dy = [-1,1,0,0];

    const queue_x = [];
    const queue_y = [];
    queue_x.push(sx);
    queue_y.push(sy);
    d[sy][sx] = 0;
    while(queue_x.length != 0){
        var x = queue_x.shift();
        var y = queue_y.shift();
        for(let i = 0; i < 4; i++){
            var new_x = x + dx[i];
            var new_y = y + dy[i];
            if(new_x < 0 || maze_row <= new_x || new_y < 0 || maze_line <= new_y) continue;
            if(maze[new_y][new_x] == 0 && d[new_y][new_x] == -1){
                d[new_y][new_x] = d[y][x] + 1;
                queue_x.push(new_x);
                queue_y.push(new_y);
            }
        }
    }
    var now_max = 0;
    for(let i = 0; i < maze_line; i++){
        for(let j = 0; j < maze_row; j++){
            if(now_max < d[i][j]){
                now_max = d[i][j];
                gy = i;
                gx = j;
            }
        }
    }
    if(maze_line * 2 > now_max){
        var flag = 0;
        for(let i = 0; i < 4; i++){
            var new_x = gx + dx[i];
            var new_y = gy + dy[i];
            if(new_x <= 0 || maze_row-1 <= new_x || new_y <= 0 || maze_line-1 <= new_y) continue;
            if(maze[new_y][new_x] == 1){
                maze[new_y][new_x] = 0;
                flag = 1;
            }
        }
        if(flag){
            for (let i = 0; i < maze_line; i++) {
                for (let j = 0; j < maze_row; j++){
                    d[i][j] = -1;
                }
            }
            maze_modify();
        }
    }
}

function maze_create(){
    var cnt = 0;
    while(true){
        if(cnt == 1000) break;
        var x = Math.floor(Math.random()*maze_row);
        var y = Math.floor(Math.random()*maze_line);
        cnt++;
        if(x % 2 == 0 || y % 2 == 0) continue;
        while(true){
            var list = [0,0,0,0];
            for(let i = 0; i < 8; i+=2){
                new_x1 = x + dx[i];
                new_x2 = x + dx[i+1];
                new_y1 = y + dy[i];
                new_y2 = y + dy[i+1];
                if(new_x2 < 0 || maze_row <= new_x2 || new_y2 < 0 || maze_line <= new_y2) continue;
                if(maze[new_y1][new_x1] == 0 || maze[new_y2][new_x2] == 0) continue;
                list[i/2] = 1;
            }
            var flag = 0
            for(let i = 0; i < 4; i++){
                if(list[i]) flag = 1;
            }
            if(flag){
                while(true){
                    var idx = Math.floor(Math.random()*4);
                    if(list[idx] == 1){
                        idx *= 2;
                        new_x1 = x + dx[idx];
                        new_x2 = x + dx[idx + 1];
                        new_y1 = y + dy[idx];
                        new_y2 = y + dy[idx + 1];
                        maze[y][x] = 0;
                        maze[new_y1][new_x1] = 0;
                        maze[new_y2][new_x2] = 0;
                        cnt = 0;
                        x = new_x2;
                        y = new_y2;
                        break;
                    }
                }
            }
            else{
                break;
            }
        }
    }
    maze_modify();
}

function draw(i,j) {
    ctx.beginPath();
    var x = j * 40;
    var y = i * 40;
    ctx.rect(x, y, 40, 40);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}

function maze_creater(){
    for (let i = 0; i < maze_line; i++) {
        for (let j = 0; j < maze_row; j++) {
            if (i == 1 && j == 1) {
                ctx.beginPath();
                var x = 1 * 40;
                var y = 1 * 40;
                ctx.rect(x, y, 40, 40);
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.closePath();
            }
            else if (i == gy && j == gx) {
                ctx.beginPath();
                var x = j * 40;
                var y = i * 40;
                ctx.rect(x, y, 40, 40);
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.closePath();
            }
            if (maze[i][j] == 1) {
                draw(i, j);
            }
        }
    }
}

init(11);
maze_create();
maze_creater();