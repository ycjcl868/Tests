console.log(1);

console.log(2);
console.log('sadfbdasf'.includes('f'))
console.log(RegExp.escape("Buy it. use it."))
let hello = '123',
    world = '456'

console.log(`
In JavaScript
${hello} ${world}
`)

console.log(Number.isFinite(15))
console.log(Number.isNaN(15))
console.log(Number.isNaN(15))
console.log(Math.trunc(15.23423)) // 15
console.log(Math.sign(-5)) // -1

function foo() {
    console.log(arguments)
    // 转为真正的数组
    return Array.from(arguments, x => x*x);
}
console.log(foo(1,2,3));

const toArray = (() => {
    Array.from ? Array.from : obj => [].slice.call(obj)
})

console.log(Array.of(1,2,3))

console.log([1,2,3,4,5].find((n) => n>3 ));

console.log(['1','2',3].fill(5));

for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

console.log(Object.keys({"a":1,"b":3}));

const fun = (x, y) => {
    return {x, y}
}

let abc = {
    method() {
        return "Hello"
    }
}

console.log(fun('a',2));
console.log(abc.method());

// 检查严格相等
console.log(Object.is(+0,-0)) // false
console.log(Object.is(NaN,NaN)) // true

let target = {a:1}
let source1 = {b:2}
let source2 = {c:3}

Object.assign(target, source1, source2)
console.log(target);

// 对象克隆
Object.assign({}, source1);


var obj = {
    __proto__: {},
    method: function() {

    }
}

// Object.setPrototypeOf(object, prototype)

console.log(Symbol('Hello').toString());
console.log(Symbol('Hello').toString());
console.log(Symbol('Hello') === Symbol('Hello')); // false
var getTempItem = id => ({ id: id, name: "Temp" });
// 返回对象
console.log(getTempItem());

console.log(Array.from(new Set([1,2,3,4,4,5])));
