# JavaScript 内存管理

## 内存模型

JavaScript 的内存模型主要包含两个部分：

1. **栈（Stack）**
   - 用于存储基本类型数据（Number, String, Boolean, null, undefined, Symbol）
   - 按值访问
   - 内存空间固定
   - 自动分配和释放
   - 后进先出（LIFO）的数据结构

2. **堆（Heap）**
   - 用于存储引用类型数据（Object, Array, Function）
   - 按引用访问
   - 动态分配内存
   - 需要手动释放（通过垃圾回收机制）
   - 无序存储

## 栈和堆的区别

### 存储方式
- **栈**：直接存储值
- **堆**：存储引用（指针），指向实际数据

### 访问方式
- **栈**：按值访问，直接操作数据
- **堆**：按引用访问，通过指针间接访问数据

### 内存分配
- **栈**：由系统自动分配和释放
- **堆**：由开发者手动申请和释放（JavaScript 中通过垃圾回收机制自动管理）

## 示例说明

```javascript
// 栈内存示例
let a = 1;        // 基本类型，存储在栈中
let b = a;        // 复制值，b 获得 a 的副本
b = 2;            // 修改 b 不会影响 a
console.log(a);   // 输出: 1

// 堆内存示例
let obj1 = { name: 'John' };  // 引用类型，存储在堆中
let obj2 = obj1;              // 复制引用，obj2 指向同一个对象
obj2.name = 'Jane';           // 修改 obj2 会影响 obj1
console.log(obj1.name);       // 输出: 'Jane'
```

## 内存管理注意事项

### 1. 内存泄漏
- 全局变量未及时释放
- 闭包使用不当
- 定时器未清除
- DOM 引用未清除

### 2. 垃圾回收
JavaScript 使用以下垃圾回收算法：
- 标记清除（Mark-and-Sweep）
- 引用计数（Reference Counting）

### 3. 性能优化建议
- 及时解除不再使用的引用
- 避免创建过多闭包
- 使用完定时器后及时清除
- 避免频繁创建大对象
- 使用对象池复用对象

### 4. 常见问题及解决方案

#### 全局变量污染
```javascript
// 不推荐
var globalVar = 'something';

// 推荐
(function() {
    var localVar = 'something';
})();
```

#### 闭包内存泄漏
```javascript
// 不推荐
function createClosure() {
    let largeData = new Array(1000000);
    return function() {
        console.log(largeData.length);
    };
}

// 推荐
function createClosure() {
    let largeData = new Array(1000000);
    return function() {
        console.log(largeData.length);
        largeData = null; // 使用完后解除引用
    };
}
```

#### 定时器清理
```javascript
// 不推荐
setInterval(() => {
    // 某些操作
}, 1000);

// 推荐
const timer = setInterval(() => {
    // 某些操作
}, 1000);

// 使用完后清除
clearInterval(timer);
```

## 最佳实践

1. **使用严格模式**
   ```javascript
   'use strict';
   ```

2. **及时释放资源**
   ```javascript
   // 使用完对象后解除引用
   let obj = { /* ... */ };
   // 使用完后
   obj = null;
   ```

3. **避免循环引用**
   ```javascript
   // 不推荐
   let obj1 = {};
   let obj2 = {};
   obj1.ref = obj2;
   obj2.ref = obj1;

   // 推荐
   let obj1 = {};
   let obj2 = {};
   obj1.ref = obj2;
   // 使用完后
   obj1.ref = null;
   ```

4. **使用 WeakMap/WeakSet**
   ```javascript
   // 使用 WeakMap 存储对象引用
   const cache = new WeakMap();
   ```

## 调试工具

1. Chrome DevTools Memory 面板
2. Performance 面板
3. Memory 快照
4. 堆分析工具

## 内存与定时器的关系

### 定时器的内存影响

1. **定时器的工作原理**
   - 定时器（setTimeout/setInterval）会创建一个闭包
   - 定时器回调函数会持有外部作用域的引用
   - 定时器会阻止其引用的变量被垃圾回收

2. **常见的内存泄漏场景**

```javascript
// 场景1：未清除的定时器
function startTimer() {
    let data = new Array(1000000); // 大数组
    setInterval(() => {
        console.log(data.length); // 定时器持有 data 的引用
    }, 1000);
}
// 即使 startTimer 执行完毕，data 也不会被回收

// 场景2：循环创建定时器
function createTimers() {
    for(let i = 0; i < 1000; i++) {
        setTimeout(() => {
            console.log(i);
        }, 1000);
    }
}
// 会创建大量定时器，占用内存

// 场景3：DOM 元素与定时器
function startDOMTimer() {
    const element = document.getElementById('myElement');
    setInterval(() => {
        console.log(element.innerHTML); // 定时器持有 DOM 元素的引用
    }, 1000);
}
// 即使元素被删除，定时器仍持有其引用
```

### 定时器内存管理最佳实践

1. **及时清除定时器**
```javascript
// 推荐做法
let timer = setInterval(() => {
    // 某些操作
}, 1000);

// 在不需要时清除
clearInterval(timer);
timer = null; // 解除引用
```

2. **使用防抖和节流**
```javascript
// 防抖示例
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

// 节流示例
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

3. **避免在循环中创建定时器**
```javascript
// 不推荐
for(let i = 0; i < 1000; i++) {
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}

// 推荐
let count = 0;
function logCount() {
    console.log(count++);
    if (count < 1000) {
        setTimeout(logCount, 1000);
    }
}
setTimeout(logCount, 1000);
```

4. **使用 requestAnimationFrame 替代 setInterval**
```javascript
// 对于动画场景，使用 requestAnimationFrame 更合适
function animate() {
    // 动画逻辑
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 定时器内存泄漏检测

1. **使用 Chrome DevTools**
   - 在 Memory 面板中查看定时器引用
   - 使用 Performance 面板监控定时器创建和清除
   - 通过 Memory 快照对比定时器数量

2. **代码层面的检测**
```javascript
// 监控定时器数量
let timerCount = 0;
const originalSetTimeout = window.setTimeout;
window.setTimeout = function() {
    timerCount++;
    console.log(`Active timers: ${timerCount}`);
    return originalSetTimeout.apply(this, arguments);
};

const originalClearTimeout = window.clearTimeout;
window.clearTimeout = function(timer) {
    timerCount--;
    console.log(`Active timers: ${timerCount}`);
    return originalClearTimeout.apply(this, arguments);
};
```

### 总结

定时器与内存管理的关系主要体现在：
- 定时器会创建闭包，持有外部变量引用
- 未清除的定时器会导致内存泄漏
- 大量定时器会占用系统资源
- 合理使用定时器清理机制
- 采用防抖和节流优化定时器使用
- 使用适当的工具监控定时器状态

## 引用类型的地址存储

### 存储机制

1. **引用类型的存储结构**
   - 引用类型的实际数据存储在堆内存中
   - 变量名存储在栈内存中
   - 栈内存中存储的是指向堆内存的引用地址（指针）

2. **内存分配过程**
```javascript
let obj = { name: 'John' };
```
上述代码的内存分配过程：
- 在堆内存中分配空间存储对象 `{ name: 'John' }`
- 在栈内存中创建变量 `obj`
- 将堆内存中对象的地址存储在栈内存的 `obj` 变量中

### 图解说明

```
栈内存（Stack）         堆内存（Heap）
+-------------+        +-------------+
|    obj      |        |             |
|  [0x1234]   | -----> | {           |
+-------------+        |   name:     |
                       |   'John'    |
                       | }           |
                       +-------------+
```

### 引用传递示例

```javascript
// 示例1：对象引用
let obj1 = { name: 'John' };  // 在堆中创建对象，栈中存储引用
let obj2 = obj1;              // 复制引用地址，两个变量指向同一个对象

// 示例2：数组引用
let arr1 = [1, 2, 3];         // 在堆中创建数组，栈中存储引用
let arr2 = arr1;              // 复制引用地址，两个变量指向同一个数组

// 示例3：函数引用
function foo() { return 'hello'; }
let func1 = foo;              // 在堆中存储函数，栈中存储引用
let func2 = func1;            // 复制引用地址，两个变量指向同一个函数
```

### 引用类型的特点

1. **共享性**
   - 多个变量可以引用同一个对象
   - 通过任一引用修改对象，其他引用都会受到影响

2. **动态性**
   - 堆内存中的对象可以动态添加或删除属性
   - 对象大小可以动态变化

3. **垃圾回收**
   - 当没有引用指向堆内存中的对象时，该对象会被垃圾回收
   - 引用计数为0时，对象被回收

### 注意事项

1. **避免循环引用**
```javascript
// 不推荐
let obj1 = {};
let obj2 = {};
obj1.ref = obj2;
obj2.ref = obj1;  // 创建循环引用

// 推荐
let obj1 = {};
let obj2 = {};
obj1.ref = obj2;
// 使用完后
obj1.ref = null;  // 解除引用
```

2. **使用 WeakMap/WeakSet**
```javascript
// 使用 WeakMap 存储对象引用，不会阻止垃圾回收
const cache = new WeakMap();
let obj = { data: 'some data' };
cache.set(obj, 'cached value');
// 当 obj 没有其他引用时，WeakMap 中的引用不会阻止垃圾回收
```

3. **性能考虑**
   - 频繁创建和销毁大对象会影响性能
   - 考虑使用对象池复用对象
   - 避免过深的对象嵌套

### 调试技巧

1. **查看对象引用**
```javascript
// 使用 console.log 查看对象引用
let obj = { name: 'John' };
console.log(obj);  // 显示对象内容
console.log('%o', obj);  // 显示对象结构
```

2. **使用 Chrome DevTools**
   - 在 Memory 面板中查看对象引用
   - 使用堆快照分析对象引用关系
   - 监控对象创建和销毁

## 总结

JavaScript 的内存管理虽然大部分由引擎自动完成，但开发者仍需注意：
- 理解栈和堆的区别
- 避免内存泄漏
- 合理使用垃圾回收机制
- 遵循最佳实践
- 使用适当的调试工具
