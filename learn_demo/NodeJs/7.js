/**
 * Created by Administrator on 2016/1/25.
 */
/*
__filename:���ص�ǰģ���ļ��Ľ�����ľ���·������������ʵ����ȫ�ֵģ�����ģ���������µ�
__dirname:��ǰ�ļ�����Ŀ¼������ľ���·��
 */

console.log(__filename);//��ǰ�ľ���·��
console.log(__dirname);
var arr = new Array(1,2,3);
setInterval(function(){
    var d = new Date();
    console.log("����ʱ�䣺"+ d.getFullYear()+"��"+ d.getMonth()+"��"+ d.getDate()+"��"+ d.getHours()+"ʱ"+ d.getMinutes()+"��"+ d.getSeconds()+"��");
},1000);
