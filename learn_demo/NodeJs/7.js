/**
 * Created by Administrator on 2016/1/25.
 */
/*
__filename:返回当前模块文件的解析后的绝对路径，该属性其实并非全局的，而是模块作用域下的
__dirname:当前文件所在目录解析后的绝对路径
 */

console.log(__filename);//当前的绝对路径
console.log(__dirname);
var arr = new Array(1,2,3);
setInterval(function(){
    var d = new Date();
    console.log("现在时间："+ d.getFullYear()+"年"+ d.getMonth()+"月"+ d.getDate()+"日"+ d.getHours()+"时"+ d.getMinutes()+"分"+ d.getSeconds()+"秒");
},1000);
