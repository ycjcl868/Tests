/**
 * Created by Administrator on 2015/9/7.
 */
//相当于后台开了一个线程
//有些语法是不认的
/*
navgator:appName、appVersion、userAgent、platform
location:所有属性都是只读的
self:指向全局worker对象
所有的ECMA对象，Object、Array、Date等
XMLHttpRequest构造器
setTimeout和setInterval方法
close()方法，立刻停止worker运行
importScripts方法

 */
self.onmessage = function(ev){
    var arr = randomArr2(ev.data,ev.data/10);
    self.postMessage(arr);
};

function randomArr2(iAll, iNow) {
    var arr = [];
    var allArr = []

    for (var i = 0; i < iAll; i++) {
        arr.push(i);
    }
    for (var j = 0; j < iAll / iNow; j++) {
        var newArr = [];
        for (var i = 0; i < iNow; i++) {
            newArr.push(arr.splice(Math.floor(Math.random() * arr.length), 1))
        }
        ;
        allArr.push(newArr);

    }
    ;
    return allArr;
}
