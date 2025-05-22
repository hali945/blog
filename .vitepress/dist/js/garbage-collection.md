---
url: /js/garbage-collection.md
---
# JavaScript 垃圾回收机制

## 什么是垃圾回收？

垃圾回收（Garbage Collection，简称 GC）是一种自动内存管理机制。它的主要职责是跟踪和回收不再使用的内存，防止内存泄漏，确保程序能够高效地使用内存资源。

## 垃圾回收的基本原理

### 1. 引用计数法

引用计数是最简单的垃圾回收算法。其核心思想是：

* 每个对象都有一个引用计数器
* 当对象被引用时，计数器加1
* 当引用失效时，计数器减1
* 当计数器为0时，对象被视为垃圾，可以被回收

**优点：**

* 实现简单
* 回收及时

**缺点：**

* 无法解决循环引用问题
* 计数器维护开销大

### 2. 标记清除法（Mark-Sweep）

这是目前主流垃圾回收算法，分为两个阶段：

1. **标记阶段**：
   * 从根对象（全局对象、活动函数调用栈等）开始遍历
   * 标记所有可达对象

2. **清除阶段**：
   * 遍历堆内存
   * 清除未被标记的对象

**优点：**

* 可以解决循环引用问题
* 实现相对简单

**缺点：**

* 会产生内存碎片
* 回收效率较低

### 3. 分代回收

现代 JavaScript 引擎（如 V8）采用分代回收策略：

1. **新生代（New Space）**：
   * 存放新创建的对象
   * 使用 Scavenge 算法（复制算法）
   * 回收频率高

2. **老生代（Old Space）**：
   * 存放存活时间较长的对象
   * 使用标记清除或标记整理算法
   * 回收频率低

## V8 引擎的垃圾回收

### 新生代回收（Scavenge）

1. 将内存分为两个相等的空间：From 空间和 To 空间
2. 新对象分配在 From 空间
3. 当 From 空间快满时，触发垃圾回收：
   * 将存活对象复制到 To 空间
   * 清空 From 空间
   * 交换 From 和 To 空间

### 老生代回收

1. **标记阶段**：
   * 使用三色标记法（白、灰、黑）
   * 从根对象开始遍历
   * 标记所有可达对象

2. **清除阶段**：
   * 清除未被标记的对象
   * 整理内存碎片（可选）

## 内存泄漏的常见原因

1. **全局变量**：
   ```javascript
   function leak() {
       leaked = 'I am a leaked global variable';
   }
   ```

2. **闭包**：
   ```javascript
   function createClosure() {
       const largeObject = new Array(1000000);
       return function() {
           console.log(largeObject);
       };
   }
   ```

3. **定时器未清除**：
   ```javascript
   setInterval(() => {
       // 如果不清除，会一直占用内存
   }, 1000);
   ```

4. **DOM 引用**：
   ```javascript
   const elements = {
       button: document.getElementById('button')
   };
   // 即使删除 DOM 元素，elements 对象仍然持有引用
   ```

## 最佳实践

1. **及时解除引用**：
   ```javascript
   let obj = { data: 'large data' };
   // 使用完后解除引用
   obj = null;
   ```

2. **使用 WeakMap/WeakSet**：
   ```javascript
   const weakMap = new WeakMap();
   weakMap.set(obj, 'value');
   // 当 obj 被回收时，weakMap 中的引用也会被自动回收
   ```

3. **避免闭包陷阱**：
   ```javascript
   function createSafeClosure() {
       const data = 'some data';
       return function() {
           // 只使用必要的数据
           return data;
       };
   }
   ```

4. **及时清理定时器**：
   ```javascript
   const timer = setInterval(() => {
       // 操作
   }, 1000);

   // 不再需要时清除
   clearInterval(timer);
   ```

## 性能优化建议

1. 避免频繁创建大对象
2. 使用对象池复用对象
3. 及时解除不需要的引用
4. 使用 Chrome DevTools 的 Memory 面板监控内存使用
5. 合理使用 WeakMap/WeakSet 存储临时数据

## 总结

垃圾回收是 JavaScript 运行时的重要机制，理解其工作原理对于编写高性能的应用程序至关重要。通过合理的内存管理和遵循最佳实践，可以有效避免内存泄漏，提高应用程序的性能和稳定性。
