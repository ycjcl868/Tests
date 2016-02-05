/**
 * process也是一个全局对象，可以对当前运行的程序的进程进行访问和控制
 * argv  --array  一组包含命令行参数的数组
 * execPath  --开启当前进程的绝对路径
 * env --返回用户环境信息
 */
console.log(process.argv);//可以改变一些细节
console.log(process.execPath);
//console.log(process.env);
/*setTimeout(function(){
	process.exit();
},5000);*/

//标准输入和输出设备
process.stdout.write('hello');

function log(data){
	process.stdout.write(data);
}

log("您好");

//process.stdin.resume();

//监听用户输入，默认情况下输入流是关闭的，要开启
/*process.stdin.on('data',function(chunk){
	console.log("用户输入了：" + chunk);
})*/


process.stdin.resume();
var a;
var b ;
process.stdout.write("请输入a的值：");
process.stdin.on('data',function(chunk){
	console.log(a);
	console.log(!a);
	if(!a){
		a = Number(chunk);
		process.stdout.write("请输入b的值：");
	}else{
		b = Number(chunk);
		process.stdout.write("结果是："+( a + b ));
	}
})


