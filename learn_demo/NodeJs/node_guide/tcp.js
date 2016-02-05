var net = require('net');
var server = net.createServer(function(socket){
	server.getConnections(function(err,count){
		console.log('当前存在%d个客户端连接',count);
	})
	console.log('服务器和客户端连接已建立');
});
server.listen(80,function(){
	address = server.address();
	console.log('被监听的地址信息是：',address);
});

console.log('TCP服务器被创建');