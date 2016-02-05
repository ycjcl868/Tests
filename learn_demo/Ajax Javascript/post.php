<?php
header("content-type:text/html;charset=utf-8");
error_reporting(0);
$username = $_POST['username'];
$age = $_POST['age'];
echo "用户名为：{$username},年龄为：{$age}";