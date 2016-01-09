<?php
header("content-type:text/html;charset=utf-8");
$longitude = $_GET['longitude'];
$latitude = $_GET['latitude'];

$file_contents = file_get_contents('http://lbs.juhe.cn/api/getaddressbylngb?lngx='.$longitude.'&lngy='.$latitude) ;
$json =  $file_contents;
echo $json;