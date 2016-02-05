<?php
//配置头文件，编码信息
header('content-type:text/html;charset="utf-8');
error_reporting(0);

//[]数组类型
$arr1 = array('Leo','momo','zhangsen');
//json数据
$arr2 = array('username'=>'leo');
//echo 'leo,momo,zhangsen';数据很乱

//根据数据类型，返回相应类型,返回类数组{"username":"leo"}
echo json_encode($arr2);



