
::: info 1、怎么获取下面iife函数的obj对象并修改？

- 使用Object.defineProperty结合原型链返回对象本身
``` javascript 
var o = (function(){
    var obj = {
        a: 1,
        b: 2,
    }
    // Object.setPrototypeOf(obj, null)
    return {
        get: function(k){
            return obj[k]
        }
    }
})();

Object.defineProperty(Object.prototype, 'hack', {
    get: function(){
        return this.valueOf();
    }
})
const _obj = o.get('hack');
_obj.c = 3;
console.log(`output->o.hack`,o.get('hack'))
```
:::