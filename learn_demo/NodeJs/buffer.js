/**
 * Buffer类
 * 一个用于更好的操作二进制数据流的类
 * 
 */
//new Buffer(size);  创建一个Buffer对象
//洗面奶我们为一个Buffer对象分配空间大小以后，其长度是固定的，不能更改



//var bf = new Buffer(5);
//console.log(bf);


//new Buffer(array);
var bf = new Buffer([1,2,3]);
console.log(bf);
bf[1] = 10;
console.log(bf);

//new Buffer(string,[encoding])
var bf = new Buffer('miaov','utf-8');
console.log(bf);
//console.log(bf.length);
for (var i = 0; i < bf.length; i++) {
	console.log(bf[i].toString());
	console.log(String.fromCharCode(bf[i]));
};

var str1 = 'miaov';
var bf1 = new Buffer(str1);
console.log(str1.length);//5
console.log(bf1.length);//5

var str2 = '妙味';
var bf2 = new Buffer(str2);
console.log(str2.length);//2
console.log(bf2.length);//6，一个中文占3个字节


/**
 * buf.write(str,offset,)：
 */

var str = 'miaov';
var bf3 = new Buffer(5);
//写入到bf3中
bf3.write(str);
console.log(bf);


/**
 * 类方法：
 * 
 */
console.log(Buffer.isEncoding('utf-8'));

var str1 = 'miaov';
var str2 = '妙味';
var list = [new Buffer(str1),new Buffer(str2)];
console.log(list);

var bf = Buffer.concat(list, 11);
console.log(bf);

