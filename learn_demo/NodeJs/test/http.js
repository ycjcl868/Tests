/*
ʲô��http��
http�ͻ��˷������󣬴����˿�
http�������ڶ˿ڼ����ͻ�������
http�������ڿͻ��˷���״̬��

1��chrome���������DNS����
2����������ϵͳ�����DNS���棨�����û���ҵ�����򻺴��Ѿ�ʧЧ��
(��ѯ������chrome://net-internals/#dns)
3����ȡ���ص�host�ļ�
4�����������һ��DNS��һ��ϵͳ����(1�������Ӫ�̷������鿴�����棬2����Ӫ�̷���������һ������DNS����������
    ��Ӫ�̷������ѽ�����ز���ϵͳ�ں�ͬʱ��������-->�������
)
5����������������Ӧ��ip��ַ�󣬷���HTTP���������֡�
(���������TCP/IP����������Ϳ��������������HTTP������)
6���������˽��ܵ���������󣬸���·��������������˵�һЩ����֮�󣬰�
������һ����������ݷ��ظ�������������Ľ������ҳ��ͻ��������HTMLҳ��
���뷵�ظ������
7��������õ���Ľ������������htmlҳ����룬�ڽ�������Ⱦ���ҳ���ʱ�������js��css��ͼƬ��̬��Դ
������ͬ��Ҳ��һ����http���󣬶���Ҫ�����������Ҫ����
8������������õ�����Դ��ҳ�������Ⱦ�����հ�һ��������ҳ����ָ����û�



����:
get
post
put //����
delete //ɾ��
head
trace
options


״̬�룺
1xx�����Ѿ�������
2xx�ɹ�
3xx�ض��� ����һ����
4xx�﷨����
5xx�������˴���
200�ɹ�
400�﷨����
401û������Ȩ
403�ܾ��ṩ����
404û�ҵ�����Դ������
500������һ������Ԥ�ڵĴ���
503����

��Ӧ:

HTTPģ�飺
1��֧�ָ�������
2���������������Ӧ
3�����������


HTTP������ף�
1��ʲô�ǻص���


2��ʲô��ͬ��/�첽��


3��ʲô��I/O/
���ݽ������ļ��ṩ�ӿ�


4��ʲô�ǵ��߳�/���̣߳�


5��ʲô������/��������


6��ʲô���¼���


7��ʲô���¼�������


8��ʲô�ǻ����¼������Ļص���


9��ʲô���¼���ѭ����


HTTPԴ������

ʲô��������


ʲô�������ģ�


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
//�ص��������첽���

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
    console.log(this.words);//global����
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
//call�ı���ִ��������
pet.speak.call(dog,'Speak');*/

/*function Pet(words){
    this.words = words;
    this.speak = function(){
        console.log(this.words);
    }
}

function Dog(words){
    Pet.call(this,words);//��thisָ�����dog
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



//���������
var http = require('http');
var url  = require('url');
var server = http.createServer(function(sreq,sres){
    var url_parts = url.parse(sreq.url);//���� url����
    var opts = {
        host: 'www.baidu.com',
        port: 80,
        path: url_parts.pathname,
        header: sreq.headers
    };
    var creq = http.get(opts,function(cres){//����get ����
        sres.writeHead(cres.statusCode, cres.headers);
        cres.pipe(sres);
    });
    sreq.pipe(creq);
});
server.listen(1337);
