# JavaScript 事件冒泡与捕获详解

## 1. 事件流机制概述

DOM 事件流包含三个阶段：
1. **捕获阶段（Capture Phase）**：事件从 Window 向下传播到目标元素
2. **目标阶段（Target Phase）**：事件到达目标元素
3. **冒泡阶段（Bubble Phase）**：事件从目标元素向上传播到 Window

## 2. 事件冒泡（Event Bubbling）

### 定义
事件冒泡是指事件从最内层的目标元素开始，逐级向上传播到父元素的过程。

### 基本用法
```html
<div id="outer">
  <div id="inner">
    <button id="btn">点击我</button>
  </div>
</div>

<script>
document.getElementById('btn').addEventListener('click', function(e) {
  console.log('按钮被点击');
});

document.getElementById('inner').addEventListener('click', function(e) {
  console.log('inner div 被点击');
});

document.getElementById('outer').addEventListener('click', function(e) {
  console.log('outer div 被点击');
});
</script>
```

点击按钮时，控制台输出顺序：
```
按钮被点击
inner div 被点击
outer div 被点击
```

## 3. 事件捕获（Event Capturing）

### 定义
事件捕获是指事件从最外层的父元素开始，逐级向下传播到目标元素的过程。

### 基本用法
```javascript
// 第三个参数为 true 表示在捕获阶段处理事件
document.getElementById('outer').addEventListener('click', function(e) {
  console.log('outer div 捕获阶段');
}, true);

document.getElementById('inner').addEventListener('click', function(e) {
  console.log('inner div 捕获阶段');
}, true);

document.getElementById('btn').addEventListener('click', function(e) {
  console.log('按钮捕获阶段');
}, true);
```

点击按钮时，控制台输出顺序：
```
outer div 捕获阶段
inner div 捕获阶段
按钮捕获阶段
```

## 4. addEventListener 第三个参数详解

```javascript
element.addEventListener(event, handler, options);
```

### 参数说明
- `event`：事件名称
- `handler`：事件处理函数
- `options`：配置对象或布尔值
  - `true`：在捕获阶段处理事件
  - `false`：在冒泡阶段处理事件（默认）
  - 对象：`{ capture: true/false, once: true, passive: true }`

### 完整示例
```javascript
// 冒泡阶段（默认）
element.addEventListener('click', handler, false);

// 捕获阶段
element.addEventListener('click', handler, true);

// 使用配置对象
element.addEventListener('click', handler, {
  capture: true,    // 捕获阶段
  once: true,       // 只执行一次
  passive: true     // 不会调用 preventDefault()
});
```

## 5. 阻止事件传播

### stopPropagation()
阻止事件继续传播（捕获和冒泡阶段都停止）

```javascript
document.getElementById('btn').addEventListener('click', function(e) {
  console.log('按钮被点击');
  e.stopPropagation(); // 阻止事件继续传播
});
```

### stopImmediatePropagation()
阻止事件传播，并且阻止同一元素上的其他事件监听器执行

```javascript
document.getElementById('btn').addEventListener('click', function(e) {
  console.log('第一个监听器');
  e.stopImmediatePropagation(); // 阻止后续监听器
});

document.getElementById('btn').addEventListener('click', function(e) {
  console.log('第二个监听器'); // 不会执行
});
```

## 6. 事件委托（Event Delegation）

### 定义
利用事件冒泡机制，将事件监听器添加到父元素上，通过事件目标来区分处理不同子元素的事件。

### 优势
- 减少内存占用
- 动态元素无需重新绑定事件
- 提高性能

### 实现示例
```html
<ul id="list">
  <li data-id="1">项目 1</li>
  <li data-id="2">项目 2</li>
  <li data-id="3">项目 3</li>
</ul>

<script>
document.getElementById('list').addEventListener('click', function(e) {
  if (e.target.tagName === 'LI') {
    console.log('点击了项目:', e.target.dataset.id);
  }
});
</script>
```

## 7. 实际应用场景

### 场景一：模态框关闭
```javascript
// 点击模态框外部区域关闭
modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    closeModal();
  }
});
```

### 场景二：表格行点击
```javascript
// 为整个表格添加点击事件
table.addEventListener('click', function(e) {
  const row = e.target.closest('tr');
  if (row) {
    selectRow(row);
  }
});
```

### 场景三：动态列表
```javascript
// 动态添加的列表项无需重新绑定事件
container.addEventListener('click', function(e) {
  if (e.target.matches('.delete-btn')) {
    deleteItem(e.target.dataset.id);
  }
});
```

## 8. 注意事项

### 性能考虑
- 避免在捕获阶段处理大量事件
- 合理使用事件委托，避免过度委托
- 及时移除不需要的事件监听器

### 兼容性
- `addEventListener` 的第三个参数在旧版浏览器中可能不支持对象形式
- 某些事件（如 focus、blur）不会冒泡

### 常见错误
```javascript
// 错误：阻止默认行为但不阻止传播
element.addEventListener('click', function(e) {
  e.preventDefault(); // 只阻止默认行为
  // 事件仍会继续传播
});

// 正确：同时阻止默认行为和传播
element.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
});
```

## 9. 调试技巧

### 查看事件传播路径
```javascript
element.addEventListener('click', function(e) {
  console.log('事件路径:', e.composedPath());
  console.log('当前目标:', e.target);
  console.log('当前阶段:', e.eventPhase); // 1:捕获 2:目标 3:冒泡
});
```

### 事件监听器检查
```javascript
// 查看元素上的所有事件监听器（开发工具中）
getEventListeners(element);
```

## 10. 参考链接

- [MDN: 事件冒泡](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/bubbles)
- [MDN: addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
- [MDN: 事件委托](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
