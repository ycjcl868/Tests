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
//����ģ���µĶ���

/*
һ���ļ�����һ��ģ�飬
ÿ��ģ�鶼���Լ���������

����ʹ��var������һ����������������ȫ�ֵģ��������ڵ�ǰ
ģ���µ�
 */

//global.a = 200;
//console.log(global.a);//200


//__filename:��ǰ�ļ������������˵ľ���·��,��ǰģ���µ�
//console.log(__filename);

/*ģ��ļ���ϵͳ

require('ģ��');
require('./2.js');
����д��require('2.js');�⽫�Ǽ���node�ĺ���ģ��,������node_modules
require('./2');�ڵ�ǰ�ļ����²���2���ļ�

1�����Ȱ��ռ��ص�ģ����ļ����ƽ��в���
2�����û���ҵ��������ģ���ļ����ƺ����.js��׺���в���

 */
