/**
 * Nodejs操作Mysql
 *
 *
 *
 *
 *	本地mysql信息
 * 	    'VAR_PAGE'=>'p',
	    'PAGE_SIZE'=>15,
		'DB_TYPE'=>'mysql',
	    'DB_HOST'=>'localhost',
	    'DB_NAME'=>'zfd3',
	    'DB_USER'=>'root',
	    'DB_PWD'=>'gyH8SwajxbcULT0l',
	    'DB_PREFIX'=>'zfd_',
	    'DEFAULT_C_LAYER' =>  'Action',
	    'DEFAULT_CITY' => '440100',
	    'DATA_CACHE_SUBDIR'=>true,
        'DATA_PATH_LEVEL'=>2,
	    'SESSION_PREFIX' => 'WSTMALL',
        'COOKIE_PREFIX'  => 'WSTMALL',
		'LOAD_EXT_CONFIG' => 'wst_config'
 */
var mysql = require('mysql');
var options = {
	'host':'localhost',
	'port':'3306',
	'user':'root',
	'password':'gyH8SwajxbcULT0l',
	'database':'nodejs',
	'charset':'UTF8_GENERAL_CI'
};
var connection  = mysql.createConnection(options);
connection.connect(function(err){//与服务器建立起连接
	//回调函数
	if(err){
		console.log('连接不上了。。。');
	}else{
		console.log('连接上了');
		/*var query = "SELECT * FROM posts WHERE title="+connection.escape("a");//防止sql注入
		console.log(query);*/
		connection.query('INSERT INTO users SET ?',{username:'凌牛',firstname:'陆'},function(err,result){
			if(err)console.log('插入数据失败');
			else{
				connection.query('SELECT * FROM ??',['users'],function(err,result){
					if(err)console.log('查询数据失败');
					else{
						for(var i = 0 ;  i< result.length ; i++){
							console.log(result[i]);
						}
						connection.end();
					}
				})
			}
		})
	}
})



/*connection.end(function(err){
	//回调函数
	console.log('取消了');
})*/

//也可以进行销毁
//connection.destroy();
