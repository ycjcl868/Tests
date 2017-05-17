
/**
2.js 
 */
module.exports.id = function(){
	console.log('module.exports');
};
exports.id = function(){
	console.log('exports');
};

module.exports.id = 'module.exports的id';
exports.id = 'exports的id';


/**
 * 在1.js中
 1.js
var a = require('./2.js');
console.log(a.id); // exports的id
console.log(a.id()); // exports

 */