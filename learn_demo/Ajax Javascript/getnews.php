<?php

header('content-type:text/html;charset="utf-8"');
error_reporting(0);
$news = array(
    array('title'=>'习近平:改革再难也要推进 敢于啃硬骨头','date'=>'北京朝阳区书记调任昆明书记 职位已空缺3月'),
    array('title'=>'沪指大涨3.44%逼近3800点 股民当街叫卖羊驼','date'=>'深航持刀纵火案现场:空姐高喊有没有军人武警'),
    array('title'=>'山西高院一庭长被指包养情妇 奔驰上幽会','date'=>'曝中国2号航母基地基本完工 可容纳2艘航母'),
    array('title'=>'吞人电梯厂商将开发布会 受害方不满商场道歉','date'=>'中国驻索马里使馆遇袭续:武警身缠绷带手持枪'),
    array('title'=>'西安世园会8个雕像私处被摸 颜色已变黑(图)','date'=>'浙江嵊州不雅视频男女归案 涉嫌制作淫秽物品'),
    array('title'=>'非洲"狮王"遭美国牙医猎杀后剥皮割头(图)','date'=>'被拐女子成山村教师"感动河北" 警方回应'),
);

echo json_encode($news);



