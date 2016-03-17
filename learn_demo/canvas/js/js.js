//定义画笔颜色
var bColor = ["#000000","#999999","#CC66FF","#FF0000","#FF0000","#FF9900","#FFFF00","#008000","#00CCFF"];
//当前画笔颜色
var col = "#FF0000";
//初始化笔刷
var initBrush = function(){ 
	for (var i=0;i<bColor.length;i++) {
		var bk = $("<span class='bk'></span>")
				.css("backgroundColor",bColor[i])
				.click(function(){
					col = $(this).css("backgroundColor");
				});
		$("#bk").append(bk);
	};
};
//初始化画板
var initPainter = function(){
	//绑定绘图canvas
	var can = $("#cav"),self = this,x=0,y=0;
	var ctx = can[0].getContext("2d");
	ctx.lineWidth = 2;
	can.on("mousedown",function(e){
		e.preventDefault();
		ctx.strokeStyle = col;
		x = e.offsetX;
		y = e.offsetY;
		//开始画图
		ctx.beginPath();
		ctx.moveTo(x,y);
		can.on("mousemove",function(e){
			var nx = e.offsetX,
				ny = e.offsetY;
			ctx.lineTo(x,y);
			x = nx;
			y = ny;
		});
		can.on("mouseup",function(){
			//取消鼠标移动事件
			can.off("mousemove");
		})
	})
};
$(function(){
	initBrush();
	initPainter();
})
