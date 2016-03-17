/*
什么是http：
http客户端发起请求，创建端口
http服务器在端口监听客户端请求
http服务器在客户端返回状态码

1、chrome搜索自身的DNS缓存
2、搜索操作系统自身的DNS缓存（浏览器没有找到缓存或缓存已经失效）
(查询方法：chrome://net-internals/#dns)
3、读取本地的host文件
4、浏览器发起一个DNS的一个系统调用(1、宽带运营商服务器查看本身缓存，2、运营商服务器发起一个迭代DNS解析的请求
    运营商服务器把结果返回操作系统内核同时缓存起来-->给浏览器
)
5、浏览器获得域名对应的ip地址后，发起HTTP“三次握手”
(浏览器发起TCP/IP请求，浏览器就可以向服务器发送HTTP请求了)
6、服务器端接受到了这个请求，根据路径参数，经过后端的一些处理之后，把
处理后的一个结果的数据返回给浏览器，如果是慕课网的页面就会把完整的HTML页面
代码返回给浏览器
7、浏览器拿到了慕课网的完整的html页面代码，在解析和渲染这个页面的时候，里面的js、css、图片静态资源
，他们同样也是一个个http请求，都需要经过上面的主要步骤
8、浏览器根据拿到的资源对页面进行渲染，最终把一个完整的页面呈现给了用户



请求:
get
post
put //更新
delete //删除
head
trace
options


状态码：
1xx请求已经接收了
2xx成功
3xx重定向 更进一步的
4xx语法错误
5xx服务器端错误
200成功
400语法错误
401没经过授权
403拒绝提供服务
404没找到，资源不存在
500发生了一个不可预期的错误
503错误

响应:

HTTP模块：
1、支持更多特性
2、不缓冲请求和响应
3、处理流相关


HTTP概念进阶：
1、什么是回调：


2、什么是同步/异步？


3、什么是I/O/
数据进出，文件提供接口


4、什么是单线程/多线程？


5、什么是阻塞/非阻塞、


6、什么是事件？


7、什么是事件驱动？


8、什么是基于事件驱动的回调？


9、什么是事件的循环？


HTTP源码解读？

什么是作用域？


什么是上下文？


 */

/*var http = require('http');

function learn(someting){
    console.log(someting);
}

function we(callback,something){
    something+='is cool';
    callback(something);
}
//we(learn,'Nodejs ');
we(function(something){
    console.log(something);
},'hello ');*/

/*
var c = 0;
function prinf(c){
    console.log(c);
}

function plus(callback){
    setTimeout(function(){
        c+=1;
        callback(c);
    },1000);
}
//回调函数的异步编程

function clickIt(e){
    window.alert("Button is clicked");
}

var button = document.getElementById("#button");
button.addEventListener('click',function(){
    //EventEmitter

});
*/

/*var globalVariable = 'This is global varies';

 function globalFunction(){
 var localVariable = 'This is local varies';
 console.log("Visit global/local variable");
 console.log(globalVariable);
 console.log(localVariable);

 function localFunction(){
 var innerLocalVariable = 'This is inner varies';
 console.log(globalVariable);
 console.log(localVariable);
 }
 localFunction();
 }
 globalFunction();*/


/*var pet = {
    words:'...',
    speak:function(say){
        console.log(say+" "+this.words);
    }
};
pet.speak();

function pets(words){
    this.words = words;
    console.log(this.words);//global对象
}
pets("...");



function Pet(words){
    this.words = words;
    this.speak =  function(){
        console.log(this.words);
    }
}
var cat = new Pet("Miao");
cat.speak();


var dog ={
    words:'wang'
};
//call改变了执行上下文
pet.speak.call(dog,'Speak');*/

/*function Pet(words){
    this.words = words;
    this.speak = function(){
        console.log(this.words);
    }
}

function Dog(words){
    Pet.call(this,words);//将this指向这个dog
    //Pet.apply(this,arguments)

}

var dog = new Dog('wang');
dog.speak();*/

/*var http  = require("http");
http.createServer(function(req,res){
        res.writeHead(200,{'Content-Type':'Text/plain'});
        res.write('Hello Nodejs');
        res.end();
    })
    .listen(2015);

window.onload = function(){
    var a = document.getElementById("abc");

};


*/



//代理服务器
var http = require('http');
var url  = require('url');
var server = http.createServer(function(sreq,sres){
    var url_parts = url.parse(sreq.url);//返回 url对象
    var opts = {
        host: 'www.baidu.com',
        port: 80,
        path: url_parts.pathname,
        header: sreq.headers
    };
    var creq = http.get(opts,function(cres){//发送get 请求
        sres.writeHead(cres.statusCode, cres.headers);
        cres.pipe(sres);
    });
    sreq.pipe(creq);
});
server.listen(1337);
