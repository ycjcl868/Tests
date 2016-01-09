/**
 * Created by Administrator on 2015/8/18.
 */

//ȡid
function $(v) {
    if (typeof v === 'function') {
        window.onload = v;
    } else if (typeof v === 'string') {
        return document.getElementById(v);
    } else if (typeof v === 'object') {
        return v;
    }
}

//��ȡԪ����ʽ
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}


//�ƶ�����
function doMove(obj, attr, dir, target, endFn) {
    //ת������
    dir = parseInt(getStyle(obj, attr)) < target ? dir : -dir;
    //�����ʱ��
    clearInterval(obj.timer);
    //������ʱ��
    obj.timer = setInterval(function () {
        //��ȡ�ƶ����ٶ�
        var speed = parseInt(getStyle(obj, attr)) + dir;
        //
        if (speed > target && dir > 0 || speed < target && dir < 0) {
            speed = target;
        }
        obj.style[attr] = speed + 'px';

        if (speed == target) { //801  =>  800
            clearInterval(obj.timer);
            //����о�ִ�У�û�оͲ�ִ��
            if (endFn) {
                endFn();
            }
            ;
        }
        ;
    }, 2);
};


//��ȡԪ��left��topֵ
function getPos(obj) {
	var pos = {left: 0, top: 0};
	while (obj) {
		pos.left += obj.offsetLeft;
		pos.top += obj.offsetTop;
		obj = obj.offsetParent;
	};
	return pos;
}


//�¼��󶨺���
function bind(obj,evname,fn){
	if(obj.addEventListener){
		obj.addEventListener(evname,fn,false);
	}else{
		obj.attachEvent('on'+evname,function(){
			fn.call(obj);
		});
	}
};



//��װ��ק
function drag(obj) {
obj.onmousedown = function (ev) {
	var ev = ev || event;
	var disX = ev.clientX - this.offsetLeft;
	var disY = ev.clientY - this.offsetTop;

	if (obj.setCapture) {
		obj.setCapture();
	}
	document.onmousemove = function (ev) {
		var ev = ev || event;
		//�����ȷ����ٸı�
		var L =ev.clientX - disX;
		var T = ev.clientY - disY;

		if(L<0){
			L = 0;
		}else if(L>document.documentElement.clientWidth-obj.offsetWidth){
			L = document.documentElement.clientWidth-obj.offsetWidth;
		}

		if(T<0){
			T=0;
		}else if(T>document.documentElement.clientHeight-obj.offsetHeight){
			T = document.documentElement.clientHeight-obj.offsetHeight;
		}

		obj.style.left = L + 'px';
		obj.style.top = T + 'px';
	};
	document.onmouseup = function () {
		document.onmousemove = document.onmouseup = null;
		//�ͷ�ȫ�ֲ���releaseCapture()
		if (obj.releaseCapture) {
			obj.releaseCapture();
		}
	}
	return false;
}
};




//Cookie�ķ�װ
function getCookie(key){
	var arr1 = document.cookie.split(';');
	for(var i =0;i<arr1.length;i++){
		var arr2 = arr1[i].split('=');
		if(arr2[0]==key){
			return decodeURI(arr2[1]);
		}
	}
};

function setCookie(key,value,t){
	var oDate = new Date();
	oDate.setDate(oDate.getDate()+t);
	document.cookie = key+'='+value+';expires='+oDate.toGMTString();
}

function removeCookie(key){
	setCookie(key,'',-1);
}
