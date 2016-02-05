/**
 * 在一个模块中通过var 定义的变量，其作用域范围是
 * 当前模块，外部不能够直接的访问
 * 如果我们想一个模块访问另外一个模块中定义的变量
 * 可以：
 * 1、把变量作为global对象的一个属性，但是这样的做法是不推荐
 * 2、使用模块对象 module，访问接口
 *
 * module:保存提供和当前模块有关的一些信息
 *
 * 在这个module对象：有一个子对象：exports 对象
 * 我们可以通过这个对象把一个模块中的局部变量对象进行担任访问
 *
 * 在模块作用域内，还有一个内置的模块对象 exports，他其实就是module.exports
 *
 * //exports和module.exports的指向关系已经断开了
 */
var m5 = require('./5.js');//返回值，其实就被加载模块中的module.exports
//console.log(module);
console.log(m5.a);
