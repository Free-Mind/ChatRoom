var http = require("http");
var socketio = require("socket.io");
var fs = require('fs');
var server = http.createServer(function(req,res){
	res.writeHead(200,{"content-Type":"text/html"});
	//读取本地html资源返回给客户端
	res.end(fs.readFileSync(__dirname+"/index.html"));
});
//侦听3000端口,
server.listen(3000);
//将socketio绑定到server；
var io = socketio.listen(server);
//用Hash存放name-socket键值对
var users = new Object();
//开始侦听
io.on('connect',function(socket){

	var url = socket.request.headers.referer;
	var splits = url.split('/');
	
	//通过url得到用户名
	var name = splits[splits.length-1];
	//将昵称和对应的socket放在hash表中
	users[name] = socket;

	//监听客户端的message事件
	socket.on("message",function(user,msg){
	
		console.log("message form "+name+" to "+user+" :"+msg);
		//通过传递过来的user值，在users hash里面找到对应的socket对象
		for(var user_name in users){
			console.log(user_name);
			if(user_name == user)
				users[user].emit("message",name,msg);
		}
	});

});