# JavaScript 内存泄漏与闭包

## 什么是内存泄漏？

内存泄漏（Memory Leak）是指程序中已动态分配的内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。

## 闭包与内存泄漏的关系

闭包（Closure）是 JavaScript 中一个重要的概念，它允许函数访问并操作函数外部的变量。虽然闭包非常有用，但如果使用不当，可能会导致内存泄漏。

### 闭包导致内存泄漏的常见场景

1. **循环引用**
```javascript
function createLeak() {
    const element = document.getElementById('myElement');
    element.onclick = function() {
        console.log(element.id); // 闭包引用了element
    };
}
```

2. **定时器未清除**
```javascript
function startTimer() {
    const data = new Array(1000000).fill('some data');
    setInterval(() => {
        console.log(data.length);
    }, 1000);
}
```

3. **事件监听器未移除**
```javascript
function addEventListener() {
    const button = document.getElementById('myButton');
    button.addEventListener('click', function() {
        console.log('Button clicked');
    });
    // 忘记移除事件监听器
}
```

## 如何避免内存泄漏

### 1. 及时清理引用

```javascript
function cleanUp() {
    const element = document.getElementById('myElement');
    const handler = function() {
        console.log('clicked');
    };
    
    element.addEventListener('click', handler);
    
    // 使用完后清理
    element.removeEventListener('click', handler);
}
```

### 2. 使用 WeakMap 和 WeakSet

```javascript
const cache = new WeakMap();

function cacheData(key, value) {
    cache.set(key, value);
    // 当key对象被垃圾回收时，对应的value也会被回收
}
```

### 3. 避免闭包陷阱

```javascript
// 不好的做法
function createBadClosure() {
    const elements = document.getElementsByTagName('div');
    for (var i = 0; i < elements.length; i++) {
        elements[i].onclick = function() {
            console.log(i); // 所有点击都会打印最后一个i的值
        };
    }
}

// 好的做法
function createGoodClosure() {
    const elements = document.getElementsByTagName('div');
    for (let i = 0; i < elements.length; i++) {
        elements[i].onclick = (function(index) {
            return function() {
                console.log(index); // 正确打印每个元素的索引
            };
        })(i);
    }
}
```

## 检测内存泄漏

### 使用 Chrome DevTools

1. 打开 Chrome DevTools
2. 切换到 Memory 标签
3. 使用 Heap Snapshot 功能
4. 比较不同时间点的内存快照

### 使用 Performance Monitor

1. 打开 Chrome DevTools
2. 按 Esc 键打开抽屉式面板
3. 选择 Performance Monitor
4. 观察 JS Heap Size 的变化

## 最佳实践

1. **及时清理资源**
   - 清除定时器
   - 移除事件监听器
   - 清空引用

2. **使用适当的数据结构**
   - 优先使用 WeakMap 和 WeakSet
   - 避免循环引用

3. **代码审查**
   - 检查闭包使用
   - 检查资源清理
   - 检查事件监听器

4. **性能监控**
   - 定期检查内存使用情况
   - 使用性能分析工具
   - 设置内存使用警告

## 总结

内存泄漏是 JavaScript 开发中常见的问题，特别是在使用闭包时。通过理解闭包的工作原理和内存管理机制，我们可以避免大多数内存泄漏问题。记住以下关键点：

1. 及时清理不再使用的引用
2. 正确使用闭包
3. 定期进行内存检查
4. 使用适当的工具进行监控
5. 遵循最佳实践指南 