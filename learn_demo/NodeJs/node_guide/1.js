var http  = require('http');
/*http.createServer(function(req,res){
	res.writeHead(200,{'Content-type':'text/html'});
	res.write('<head><meta charset="utf-8"/></head>')
	res.end('你好\n');
}).listen(1337);
console.log('服务器已开启');
console.log(__dirname);*/

/**
 * 为服务器绑定处理事件 
 */
var server = http.createServer();
//触发on
server.on('request',function(r,res){
	console.log(r.url);
	res.end();
});
server.listen(80);
