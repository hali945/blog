<!--
 * @Author: hali 13656691830@163.com
 * @Date: 2025-05-14 21:14:27
 * @LastEditors: hali 13656691830@163.com
 * @LastEditTime: 2025-05-14 21:16:36
 * @FilePath: \docs\src\js\作用域.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# JavaScript作用域

## 1、作用域的基本概念

::: info 什么是作用域
- 作用域是变量和函数的可访问范围
- 作用域决定了代码中变量和其他资源的可见性
- JavaScript采用词法作用域（静态作用域）
- 作用域在代码编写时就确定了
:::

## 2、作用域的类型

### 2.1 全局作用域
```javascript
// 全局变量
var globalVar = '全局变量';
let globalLet = '全局let';
const globalConst = '全局const';

// 全局函数
function globalFunc() {
    console.log('全局函数');
}
```

### 2.2 函数作用域
```javascript
function test() {
    // 函数作用域内的变量
    var funcVar = '函数变量';
    let funcLet = '函数let';
    const funcConst = '函数const';
    
    console.log(funcVar); // 可以访问
}
// console.log(funcVar); // 报错，无法访问
```

### 2.3 块级作用域
```javascript
{
    // 块级作用域
    let blockLet = '块级let';
    const blockConst = '块级const';
    var blockVar = '块级var'; // var没有块级作用域
}

// console.log(blockLet); // 报错
// console.log(blockConst); // 报错
console.log(blockVar); // 可以访问
```

## 3、作用域链

::: info 作用域链
- 作用域链是JavaScript查找变量的机制
- 从当前作用域开始，逐级向上查找
- 直到找到变量或到达全局作用域
:::

```javascript
const global = '全局变量';

function outer() {
    const outer = '外部变量';
    
    function inner() {
        const inner = '内部变量';
        console.log(inner); // 内部变量
        console.log(outer); // 外部变量
        console.log(global); // 全局变量
    }
    
    inner();
}
```

## 4、变量提升

::: warning 变量提升
1. var声明的变量会提升
   ```javascript
   console.log(a); // undefined
   var a = 1;
   ```

2. let和const不会提升
   ```javascript
   console.log(b); // 报错
   let b = 2;
   ```

3. 函数声明会提升
   ```javascript
   sayHello(); // 可以执行
   function sayHello() {
       console.log('Hello');
   }
   ```
:::

## 5、闭包

::: tip 闭包
- 闭包是函数和其周围状态的组合
- 闭包可以访问外部函数的作用域
- 闭包常用于数据私有化
:::

```javascript
function createCounter() {
    let count = 0; // 私有变量
    
    return {
        increment() {
            count++;
            return count;
        },
        getCount() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1
```

## 6、最佳实践

::: info 作用域相关最佳实践
1. 优先使用let和const
   - 避免变量提升
   - 提供块级作用域
   - 防止变量重复声明

2. 避免全局变量
   - 使用模块化
   - 使用闭包
   - 使用命名空间

3. 合理使用闭包
   - 注意内存泄漏
   - 避免过度使用
   - 及时释放不需要的引用
:::

## 7、常见面试题

::: tip 作用域相关面试题
1. 什么是作用域链？
   - 变量查找的机制
   - 从内到外逐级查找
   - 直到找到或到达全局作用域

2. let、const、var的区别？
   - 变量提升
   - 块级作用域
   - 重复声明
   - 暂时性死区

3. 什么是闭包？有什么优缺点？
   - 函数和其周围状态的组合
   - 优点：数据私有化、函数工厂
   - 缺点：内存泄漏、性能影响
:::
