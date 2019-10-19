let str = require('./a.js')
require('./index.css')
require('./index.less')
@log
class A{
    a = 1;
}
let b = new A()
console.log(b.a)