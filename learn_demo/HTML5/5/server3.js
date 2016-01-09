/*
 创建服务器
 */
var http = require('http');
var fs = require('fs');
var io = require('socket.io')
var documentRoot = 'c:/wamp/www';
//创建一个服务器
var serv = http.createServer(function (req, res) {
    /*
     //req客户端信息，res实现请求的发送
     console.log("有人进来了 ");
     res.writeHeader(200,{
     'content-type':'text/html;charset=utf-8'
     });
     res.write("这是正文部分");
     res.end();

     console.log(req);
     */
    var url = req.url;

    //用FS读取文件
    var file = documentRoot + url;
    fs.readFile(file, function (err, data) {
        if(err){
            res.writeHeader(404,{
                'content-type':'text/html;charset=utf-8'
            })
            res.write('404');
            res.end();
        }else{
            res.writeHeader(200,{
                'content-type':'text/html;charset=utf-8'
            })
            res.write(data);
            res.end();

        }


    });


}).listen(8888);

var socket = io.listen(serv);
socket.sockets.on('connection',function(socket){
    //socket
    console.log("有人通过socket连接进来了");
    socket.emit('hello','欢迎');
   /* socket.on('hellotoo',function(data){
        console.log(data);
    })*/

    //广播事件
    //socket.broadcast.emit('a');
    socket.broadcast.emit('a','有人进来了');


});

console.log("服务器开启成功");

