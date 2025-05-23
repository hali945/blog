---
url: /js/event-loop.md
---
# JavaScript 事件循环（Event Loop）

## 什么是事件循环？

事件循环是 JavaScript 实现异步编程的核心机制。它允许 JavaScript 在执行单线程代码的同时，能够处理异步操作，实现非阻塞的 I/O 操作。

## 浏览器中的事件循环

### 基本结构

浏览器的事件循环包含以下主要组件：

1. **调用栈（Call Stack）**
   * 用于存储正在执行的代码
   * 遵循后进先出（LIFO）原则
   * 一次只能执行一个任务

2. **任务队列（Task Queues）**
   * **宏任务队列（Macro Task Queue）**
     * setTimeout/setInterval
     * I/O 操作
     * UI 渲染
     * 事件监听
   * **微任务队列（Micro Task Queue）**
     * Promise.then/catch/finally
     * MutationObserver
     * process.nextTick（Node.js 特有）

### 执行顺序

1. 执行同步代码（调用栈）
2. 检查微任务队列，执行所有微任务
3. 执行一个宏任务
4. 重复步骤 2-3

```javascript
console.log('1'); // 同步代码

setTimeout(() => {
    console.log('2'); // 宏任务
}, 0);

Promise.resolve().then(() => {
    console.log('3'); // 微任务
});

console.log('4'); // 同步代码

// 输出顺序：1, 4, 3, 2
```

## Node.js 中的事件循环

### 阶段（Phases）

Node.js 的事件循环分为六个阶段：

1. **timers 阶段**
   * 执行 setTimeout 和 setInterval 的回调

2. **pending callbacks 阶段**
   * 执行一些系统操作的回调（如 TCP 错误）

3. **idle, prepare 阶段**
   * 内部使用

4. **poll 阶段**
   * 执行 I/O 回调
   * 检查是否有新的 I/O 事件
   * 执行 setImmediate 回调

5. **check 阶段**
   * 执行 setImmediate 回调

6. **close callbacks 阶段**
   * 执行关闭事件的回调（如 socket.on('close')）

### 微任务队列

Node.js 中的微任务队列分为两种：

1. **nextTick 队列**
   * process.nextTick 的回调
   * 优先级最高

2. **Promise 队列**
   * Promise 的回调
   * 优先级次之

```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
}, 0);

setImmediate(() => {
    console.log('3');
});

process.nextTick(() => {
    console.log('4');
});

Promise.resolve().then(() => {
    console.log('5');
});

// 输出顺序：1, 4, 5, 2, 3
```

## 浏览器与 Node.js 的区别

### 1. 任务队列的优先级

**浏览器：**

* 微任务队列优先于宏任务队列
* 所有微任务执行完毕后才会执行宏任务

**Node.js：**

* 微任务队列分为 nextTick 和 Promise 两个队列
* nextTick 队列优先于 Promise 队列
* 每个阶段结束后都会检查微任务队列

### 2. 定时器实现

**浏览器：**

* setTimeout 的最小延迟为 4ms
* 受页面状态影响（如页面不可见时可能被限制）

**Node.js：**

* setTimeout 的延迟更精确
* 不受页面状态影响
* 提供 setImmediate 作为替代方案

### 3. I/O 处理

**浏览器：**

* 主要处理 DOM 事件和网络请求
* 受同源策略限制

**Node.js：**

* 处理文件系统、网络、子进程等
* 提供更多底层 API

## 使用场景和注意事项

### 浏览器环境

1. **UI 渲染优化**

```javascript
// 使用 requestAnimationFrame 优化动画
function animate() {
    // 更新动画
    requestAnimationFrame(animate);
}
```

2. **避免阻塞主线程**

```javascript
// 使用 Web Worker 处理复杂计算
const worker = new Worker('worker.js');
worker.postMessage({ data: complexData });
```

3. **事件委托**

```javascript
// 使用事件委托优化事件监听
document.body.addEventListener('click', (e) => {
    if (e.target.matches('.button')) {
        // 处理按钮点击
    }
});
```

### Node.js 环境

1. **异步 I/O 操作**

```javascript
// 使用流处理大文件
const fs = require('fs');
const readStream = fs.createReadStream('large-file.txt');
readStream.pipe(writeStream);
```

2. **定时任务处理**

```javascript
// 使用 setImmediate 代替 setTimeout(0)
setImmediate(() => {
    // 在下一个事件循环执行
});
```

3. **错误处理**

```javascript
// 使用 process.nextTick 确保错误处理在同步代码之后
function apiCall(callback) {
    process.nextTick(() => {
        try {
            // 异步操作
        } catch (err) {
            callback(err);
        }
    });
}
```

## 最佳实践

1. **避免阻塞事件循环**
   * 将耗时操作放在 Worker 中
   * 使用流处理大文件
   * 避免同步 I/O 操作

2. **合理使用微任务**
   * 优先使用 Promise 而不是回调
   * 谨慎使用 process.nextTick（Node.js）
   * 避免在微任务中执行耗时操作

3. **内存管理**
   * 及时清理定时器
   * 避免闭包导致的内存泄漏
   * 使用 WeakMap/WeakSet 存储临时数据

4. **错误处理**
   * 使用 try-catch 捕获同步错误
   * 使用 Promise.catch 处理异步错误
   * 实现全局错误处理机制

## 总结

事件循环是 JavaScript 异步编程的核心，理解其工作原理对于编写高性能的应用程序至关重要。浏览器和 Node.js 环境的事件循环实现有所不同，需要根据具体场景选择合适的异步处理方式。通过遵循最佳实践，可以充分利用事件循环的特性，编写出高效、可靠的代码。
