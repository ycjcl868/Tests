/**
 * Created by Administrator on 2015/7/29.
 */
function ajax(method, url, data, success) {
    var info = null;
    try {
        info = new XMLHttpRequest();
    } catch (e) {
        info = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (method == 'get' && data) {
        url += '?' + data;
    }

    //若get方式，传入的url一样，则有缓存，就在url后面加上随机数/时间戳
    //+'&t='+new Date().getTime()
    //乱码，编码encodeURI('中文')

    info.open(method, url, true);

    if (method == 'get') {
        info.send();
    }else{
        info.setRequestHeader('content-type','application/x-www-form-urlencoded');
    }

    info.onreadystatechange = function(){
        if(info.readyState == 4){
            if(info.status ==200){
                success && success(info.responseText);
            }
        }
    }


}