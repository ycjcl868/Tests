var http = require('http');
http.createServer(function(req,res){
	if(req.url !== '/favicon.ico'){
		res.writeHead(200,{
			'Content-Type':'text/plain',
			'Access-Control-Allow-Origin':'http://localhost',
		});
		res.write("你好");
	}
	console.log('有人进来了');
}).listen(1337);
console.log('服务器已启动');