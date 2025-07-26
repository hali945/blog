# Window 与 Document 对象详解

## 定义

### Window 对象
`window` 对象代表浏览器窗口，是 JavaScript 的全局对象，包含了浏览器窗口的所有属性和方法。

### Document 对象
`document` 对象代表整个 HTML 文档，是 `window` 对象的一个属性，提供了访问和操作 HTML 文档内容的方法。

## 关系与区别

### 层级关系
```javascript
window.document === document  // true
window.document === window['document']  // true
```

### 主要区别

| 特性 | Window | Document |
|------|--------|----------|
| **作用域** | 全局对象，浏览器窗口 | HTML 文档对象 |
| **层级** | 顶级对象 | Window 的子对象 |
| **作用范围** | 整个浏览器窗口 | 当前 HTML 文档 |
| **主要功能** | 浏览器控制、全局变量 | DOM 操作、文档内容 |

## 事件使用对比

### Window 事件

#### 1. 窗口事件
```javascript
// 窗口加载完成
window.addEventListener('load', function() {
    console.log('页面完全加载完成');
});

// DOM 内容加载完成（推荐）
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 结构加载完成');
});

// 窗口大小改变
window.addEventListener('resize', function() {
    console.log('窗口大小改变:', window.innerWidth, window.innerHeight);
});

// 窗口滚动
window.addEventListener('scroll', function() {
    console.log('页面滚动位置:', window.scrollY);
});
```

#### 2. 焦点事件
```javascript
// 窗口获得焦点
window.addEventListener('focus', function() {
    console.log('窗口获得焦点');
});

// 窗口失去焦点
window.addEventListener('blur', function() {
    console.log('窗口失去焦点');
});
```

#### 3. 页面生命周期事件
```javascript
// 页面即将卸载
window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = ''; // 显示确认对话框
});

// 页面卸载
window.addEventListener('unload', function() {
    // 清理资源
    localStorage.clear();
});
```

### Document 事件

#### 1. DOM 事件
```javascript
// 点击事件
document.addEventListener('click', function(e) {
    console.log('文档被点击:', e.target);
});

// 键盘事件
document.addEventListener('keydown', function(e) {
    console.log('按键按下:', e.key);
});

// 鼠标事件
document.addEventListener('mousemove', function(e) {
    console.log('鼠标位置:', e.clientX, e.clientY);
});
```

#### 2. 文档状态事件
```javascript
// 文档可见性改变
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面隐藏');
    } else {
        console.log('页面显示');
    }
});

// 文档准备状态
document.addEventListener('readystatechange', function() {
    console.log('文档状态:', document.readyState);
});
```

## 使用细节

### Window 对象常用属性和方法

#### 1. 窗口属性
```javascript
// 窗口尺寸
console.log('窗口宽度:', window.innerWidth);
console.log('窗口高度:', window.innerHeight);
console.log('屏幕宽度:', window.screen.width);
console.log('屏幕高度:', window.screen.height);

// 滚动位置
console.log('水平滚动:', window.scrollX);
console.log('垂直滚动:', window.scrollY);
```

#### 2. 窗口控制
```javascript
// 打开新窗口
const newWindow = window.open('https://example.com', '_blank');

// 关闭当前窗口
window.close();

// 调整窗口大小
window.resizeTo(800, 600);

// 移动窗口
window.moveTo(100, 100);
```

#### 3. 定时器
```javascript
// 延迟执行
const timeoutId = window.setTimeout(() => {
    console.log('3秒后执行');
}, 3000);

// 清除延迟
window.clearTimeout(timeoutId);

// 循环执行
const intervalId = window.setInterval(() => {
    console.log('每秒执行一次');
}, 1000);

// 清除循环
window.clearInterval(intervalId);
```

### Document 对象常用属性和方法

#### 1. DOM 查询
```javascript
// 通过 ID 获取元素
const element = document.getElementById('myId');

// 通过类名获取元素
const elements = document.getElementsByClassName('myClass');

// 通过标签名获取元素
const divs = document.getElementsByTagName('div');

// 通过选择器获取元素
const element = document.querySelector('.myClass');
const elements = document.querySelectorAll('.myClass');
```

#### 2. DOM 操作
```javascript
// 创建元素
const newDiv = document.createElement('div');
newDiv.textContent = '新元素';

// 添加元素
document.body.appendChild(newDiv);

// 插入元素
const referenceElement = document.getElementById('reference');
document.body.insertBefore(newDiv, referenceElement);

// 删除元素
document.body.removeChild(newDiv);
```

#### 3. 文档信息
```javascript
// 文档标题
console.log('文档标题:', document.title);

// 文档 URL
console.log('文档 URL:', document.URL);

// 文档域名
console.log('文档域名:', document.domain);

// 文档字符集
console.log('字符集:', document.characterSet);
```

## 事件使用对比总结

### 适用场景对比

| 事件类型 | Window 适用场景 | Document 适用场景 |
|----------|----------------|------------------|
| **加载事件** | 页面完全加载 | DOM 结构加载 |
| **尺寸事件** | 窗口大小改变 | 元素大小改变 |
| **滚动事件** | 页面整体滚动 | 特定元素滚动 |
| **焦点事件** | 窗口焦点 | 表单元素焦点 |
| **键盘事件** | 全局快捷键 | 特定元素键盘事件 |
| **鼠标事件** | 全局鼠标事件 | 元素鼠标事件 |

### 性能对比

```javascript
// Window 事件 - 全局监听，性能影响较大
window.addEventListener('scroll', function() {
    // 每次滚动都会触发，需要节流
    throttle(() => {
        console.log('页面滚动');
    }, 100);
});

// Document 事件 - 更精确的控制
document.addEventListener('click', function(e) {
    // 可以精确控制哪些元素响应
    if (e.target.matches('.clickable')) {
        console.log('可点击元素被点击');
    }
});
```

## 注意事项

### 1. 事件监听器管理

```javascript
// 避免内存泄漏
function addEventListeners() {
    const handler = function() {
        console.log('事件处理');
    };
    
    window.addEventListener('resize', handler);
    document.addEventListener('click', handler);
    
    // 返回清理函数
    return function() {
        window.removeEventListener('resize', handler);
        document.removeEventListener('click', handler);
    };
}

const cleanup = addEventListeners();
// 在组件卸载时调用
cleanup();
```

### 2. 事件委托

```javascript
// 推荐：使用事件委托减少事件监听器数量
document.addEventListener('click', function(e) {
    if (e.target.matches('.button')) {
        handleButtonClick(e.target);
    }
});

// 不推荐：为每个按钮单独添加监听器
document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});
```

### 3. 异步操作中的事件处理

```javascript
// 错误示例：在异步操作中访问事件对象
document.addEventListener('click', async function(e) {
    await someAsyncOperation();
    console.log(e.target); // 可能为 null
});

// 正确示例：保存事件对象
document.addEventListener('click', async function(e) {
    const target = e.target; // 立即保存
    await someAsyncOperation();
    console.log(target); // 安全访问
});
```

### 4. 浏览器兼容性

```javascript
// 兼容性处理
function addEventWithFallback(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
    }
}

// 使用
addEventWithFallback(window, 'load', function() {
    console.log('页面加载完成');
});
```

### 5. 性能优化

```javascript
// 使用防抖和节流
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 防抖处理窗口大小改变
window.addEventListener('resize', debounce(function() {
    console.log('窗口大小改变');
}, 250));

// 节流处理滚动事件
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

window.addEventListener('scroll', throttle(function() {
    console.log('页面滚动');
}, 100));
```

## 最佳实践

### 1. 事件监听器组织

```javascript
// 集中管理事件监听器
class EventManager {
    constructor() {
        this.listeners = new Map();
    }
    
    addListener(target, event, handler) {
        target.addEventListener(event, handler);
        this.listeners.set(`${target}-${event}`, { target, event, handler });
    }
    
    removeAll() {
        this.listeners.forEach(({ target, event, handler }) => {
            target.removeEventListener(event, handler);
        });
        this.listeners.clear();
    }
}

const eventManager = new EventManager();
```

### 2. 错误处理

```javascript
// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误:', e.error);
    // 发送错误日志
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的 Promise 拒绝:', e.reason);
    // 处理未捕获的 Promise 错误
});
```

### 3. 调试技巧

```javascript
// 开发环境下的调试
if (process.env.NODE_ENV === 'development') {
    // 监听所有点击事件
    document.addEventListener('click', function(e) {
        console.log('点击元素:', e.target);
        console.log('点击位置:', e.clientX, e.clientY);
    });
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        console.log('窗口尺寸:', window.innerWidth, 'x', window.innerHeight);
    });
}
```

## 总结

### Window vs Document 选择指南

1. **选择 Window 当：**
   - 需要监听整个浏览器窗口的事件
   - 处理页面级别的生命周期事件
   - 需要访问浏览器 API（如 localStorage、sessionStorage）
   - 处理全局键盘快捷键

2. **选择 Document 当：**
   - 需要操作 DOM 元素
   - 处理文档内容相关的事件
   - 实现事件委托
   - 处理表单和用户交互

3. **性能考虑：**
   - Window 事件影响整个页面，需要谨慎使用
   - Document 事件可以更精确地控制
   - 使用事件委托可以减少事件监听器数量

4. **最佳实践：**
   - 优先使用 Document 事件进行精确控制
   - 合理使用防抖和节流优化性能
   - 及时清理事件监听器避免内存泄漏
   - 考虑浏览器兼容性
