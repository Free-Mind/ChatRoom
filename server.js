var http = require("http");
var socketio = require("socket.io");
var fs = require('fs');
var server = http.createServer(function(req,res){
	res.writeHead(200,{"content-Type":"text/html"});
	//读取本地html资源返回给客户端
	res.end(fs.readFileSync(__dirname+"/index.html"));
});
//侦听3000
server.listen(3000);
//将socketio绑定到server；
var io = socketio.listen(server);
//开始侦听
io.on('connect',function(socket){

	var url = socket.request.headers.referer;
	var splits = url.split('/');
	//通过url得到房间号
	var roomId = splits[splits.length-1];

	//将当前socket放进对应的room中
	socket.join(roomId);
	
	//监听客户端的say事件
	socket.on("message",function(msg){
	//	socket.emit("message",msg);
		console.log(msg);
		//向本房间的其他用户广播
		socket.to(roomId).emit('message',msg);
	});

});