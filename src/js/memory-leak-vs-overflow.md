# 内存泄漏与内存溢出的区别

## 基本概念

### 内存泄漏（Memory Leak）
内存泄漏是指程序中已动态分配的内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。

### 内存溢出（Memory Overflow）
内存溢出是指程序在申请内存时，没有足够的内存空间供其使用，出现 out of memory 的情况。

## 主要区别

| 特性 | 内存泄漏 | 内存溢出 |
|------|----------|----------|
| 定义 | 内存无法被释放 | 内存空间不足 |
| 发生原因 | 程序逻辑错误，忘记释放内存 | 程序申请的内存超过了系统可分配的内存 |
| 影响范围 | 渐进式影响，随着时间推移越来越严重 | 立即影响，程序可能直接崩溃 |
| 可恢复性 | 通常需要重启程序才能恢复 | 需要释放内存或增加系统内存才能恢复 |
| 检测难度 | 较难检测，需要专业工具 | 较易检测，通常有明确的错误信息 |

## 示例代码

### 内存泄漏示例

```javascript
// 1. 闭包导致的内存泄漏
function createLeak() {
    const element = document.getElementById('myElement');
    element.onclick = function() {
        console.log(element.id); // 闭包引用了element
    };
}

// 2. 定时器未清除
function startTimer() {
    const data = new Array(1000000).fill('some data');
    setInterval(() => {
        console.log(data.length);
    }, 1000);
}

// 3. 事件监听器未移除
function addEventListener() {
    const button = document.getElementById('myButton');
    button.addEventListener('click', function() {
        console.log('Button clicked');
    });
}
```

### 内存溢出示例

```javascript
// 1. 递归调用导致栈溢出
function stackOverflow() {
    stackOverflow(); // 无限递归
}

// 2. 大数组导致堆溢出
function heapOverflow() {
    const arr = [];
    while(true) {
        arr.push(new Array(1000000).fill('x')); // 不断创建大数组
    }
}

// 3. 字符串拼接导致内存溢出
function stringOverflow() {
    let str = '';
    while(true) {
        str += 'x'.repeat(1000000); // 不断拼接字符串
    }
}
```

## 预防措施

### 预防内存泄漏

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

### 预防内存溢出

1. **限制数据大小**
   - 设置合理的数组大小限制
   - 控制字符串长度
   - 限制递归深度

2. **使用流式处理**
   - 分批处理大量数据
   - 使用流式API
   - 及时释放不需要的数据

3. **内存监控**
   - 设置内存使用警告
   - 监控内存使用情况
   - 实现自动清理机制

## 检测方法

### 内存泄漏检测

1. **使用 Chrome DevTools**
   - Memory 面板
   - Performance 面板
   - Heap Snapshot

2. **使用性能分析工具**
   - Node.js 的 heapdump
   - Chrome Task Manager
   - Performance Monitor

### 内存溢出检测

1. **错误监控**
   - 捕获 OutOfMemoryError
   - 监控内存使用率
   - 设置内存使用阈值

2. **日志分析**
   - 记录内存使用情况
   - 分析内存增长趋势
   - 设置告警机制

## 总结

1. **内存泄漏**
   - 是程序逻辑问题
   - 需要及时清理资源
   - 使用适当的数据结构
   - 定期进行代码审查

2. **内存溢出**
   - 是资源限制问题
   - 需要控制数据规模
   - 使用流式处理
   - 实现内存监控

3. **共同点**
   - 都会影响程序性能
   - 都需要预防和监控
   - 都需要合理的处理机制 