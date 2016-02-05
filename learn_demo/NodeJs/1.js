/*
var a  = 100;
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth();

console.log(year+" "+month);

function Person(name){
    this.name = name;
}
Person.prototype.run = function(){
    console.log(this.name+'runing');
}
var p1 = new Person();
p1.name = 'leo';*/


//var a = 100;
//console.log(global.a);//undefined
//不是模块下的对象

/*
一个文件就是一个模块，
每个模块都有自己的作用域

我们使用var来声明一个变量，他并不是全局的，而是属于当前
模块下的
 */

//global.a = 200;
//console.log(global.a);//200


//__filename:当前文件被解析过后了的绝对路径,当前模块下的
//console.log(__filename);

/*模块的加载系统

require('模块');
require('./2.js');
不能写成require('2.js');这将是加载node的核心模块,或者是node_modules
require('./2');在当前文件夹下查找2的文件

1、首先按照加载的模块的文件名称进行查找
2、如果没有找到，则会在模块文件名称后加上.js后缀进行查找

 */
