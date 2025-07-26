# 浏览器事件详解

## 概述

浏览器事件是 Web 开发中处理用户交互和系统状态变化的核心机制。现代浏览器支持数百种不同类型的事件，涵盖了从用户交互到系统状态变化的各个方面。

## 事件分类

### 1. 鼠标事件 (Mouse Events)

#### 基础鼠标事件

```javascript
// 点击事件
element.addEventListener('click', (event) => {
  console.log('点击事件:', event.clientX, event.clientY);
});

// 双击事件
element.addEventListener('dblclick', (event) => {
  console.log('双击事件');
});

// 鼠标按下
element.addEventListener('mousedown', (event) => {
  console.log('鼠标按下:', event.button); // 0: 左键, 1: 中键, 2: 右键
});

// 鼠标释放
element.addEventListener('mouseup', (event) => {
  console.log('鼠标释放');
});

// 鼠标移动
element.addEventListener('mousemove', (event) => {
  console.log('鼠标移动:', event.movementX, event.movementY);
});

// 鼠标进入
element.addEventListener('mouseenter', (event) => {
  console.log('鼠标进入元素');
});

// 鼠标离开
element.addEventListener('mouseleave', (event) => {
  console.log('鼠标离开元素');
});

// 鼠标悬停
element.addEventListener('mouseover', (event) => {
  console.log('鼠标悬停');
});

// 鼠标移出
element.addEventListener('mouseout', (event) => {
  console.log('鼠标移出');
});
```

#### 高级鼠标事件应用

```javascript
// 拖拽实现
class DragAndDrop {
  constructor(element) {
    this.element = element;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.setupEvents();
  }
  
  setupEvents() {
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }
  
  handleMouseDown(event) {
    this.isDragging = true;
    this.startX = event.clientX - this.element.offsetLeft;
    this.startY = event.clientY - this.element.offsetTop;
    this.element.style.cursor = 'grabbing';
  }
  
  handleMouseMove(event) {
    if (!this.isDragging) return;
    
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
  }
  
  handleMouseUp() {
    this.isDragging = false;
    this.element.style.cursor = 'grab';
  }
}

// 右键菜单
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  showCustomContextMenu(event.clientX, event.clientY);
});

// 鼠标滚轮
element.addEventListener('wheel', (event) => {
  event.preventDefault();
  const delta = event.deltaY;
  if (delta > 0) {
    console.log('向下滚动');
  } else {
    console.log('向上滚动');
  }
});
```

### 2. 键盘事件 (Keyboard Events)

#### 基础键盘事件

```javascript
// 按键按下
document.addEventListener('keydown', (event) => {
  console.log('按键按下:', event.key, event.code);
  
  // 组合键检测
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault();
    saveDocument();
  }
});

// 按键释放
document.addEventListener('keyup', (event) => {
  console.log('按键释放:', event.key);
});

// 按键输入
input.addEventListener('keypress', (event) => {
  console.log('按键输入:', event.key);
});
```

#### 高级键盘事件应用

```javascript
// 快捷键系统
class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.setupEvents();
  }
  
  register(keys, callback, description = '') {
    this.shortcuts.set(keys, { callback, description });
  }
  
  setupEvents() {
    document.addEventListener('keydown', (event) => {
      const key = this.getKeyCombination(event);
      const shortcut = this.shortcuts.get(key);
      
      if (shortcut) {
        event.preventDefault();
        shortcut.callback();
      }
    });
  }
  
  getKeyCombination(event) {
    const parts = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Meta');
    parts.push(event.key.toUpperCase());
    
    return parts.join('+');
  }
}

// 使用示例
const shortcuts = new KeyboardShortcuts();
shortcuts.register('Ctrl+S', () => save(), '保存');
shortcuts.register('Ctrl+Z', () => undo(), '撤销');
shortcuts.register('Ctrl+Y', () => redo(), '重做');

// 输入验证
class InputValidator {
  constructor(input) {
    this.input = input;
    this.setupEvents();
  }
  
  setupEvents() {
    this.input.addEventListener('keydown', (event) => {
      // 只允许数字输入
      if (!/[0-9]/.test(event.key) && 
          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) {
        event.preventDefault();
      }
    });
    
    this.input.addEventListener('keyup', (event) => {
      this.validateInput();
    });
  }
  
  validateInput() {
    const value = this.input.value;
    if (value.length > 10) {
      this.input.value = value.slice(0, 10);
    }
  }
}
```

### 3. 表单事件 (Form Events)

#### 基础表单事件

```javascript
// 表单提交
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  submitForm(formData);
});

// 表单重置
form.addEventListener('reset', (event) => {
  console.log('表单重置');
});

// 输入变化
input.addEventListener('input', (event) => {
  console.log('输入变化:', event.target.value);
});

// 内容变化
textarea.addEventListener('change', (event) => {
  console.log('内容变化:', event.target.value);
});

// 焦点获得
input.addEventListener('focus', (event) => {
  event.target.classList.add('focused');
});

// 焦点失去
input.addEventListener('blur', (event) => {
  event.target.classList.remove('focused');
  validateField(event.target);
});

// 选择文本
input.addEventListener('select', (event) => {
  console.log('文本被选择');
});

// 剪切
input.addEventListener('cut', (event) => {
  console.log('内容被剪切');
});

// 复制
input.addEventListener('copy', (event) => {
  console.log('内容被复制');
});

// 粘贴
input.addEventListener('paste', (event) => {
  console.log('内容被粘贴');
});
```

#### 高级表单事件应用

```javascript
// 实时表单验证
class FormValidator {
  constructor(form) {
    this.form = form;
    this.fields = new Map();
    this.setupEvents();
  }
  
  addField(name, rules) {
    const field = this.form.querySelector(`[name="${name}"]`);
    if (field) {
      this.fields.set(name, { field, rules });
    }
  }
  
  setupEvents() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.validateAll()) {
        this.submitForm();
      }
    });
    
    this.fields.forEach(({ field, rules }) => {
      field.addEventListener('blur', () => this.validateField(field, rules));
      field.addEventListener('input', () => this.clearError(field));
    });
  }
  
  validateField(field, rules) {
    const value = field.value;
    let isValid = true;
    let errorMessage = '';
    
    rules.forEach(rule => {
      if (!rule.test(value)) {
        isValid = false;
        errorMessage = rule.message;
      }
    });
    
    if (!isValid) {
      this.showError(field, errorMessage);
    } else {
      this.clearError(field);
    }
    
    return isValid;
  }
  
  validateAll() {
    let allValid = true;
    this.fields.forEach(({ field, rules }) => {
      if (!this.validateField(field, rules)) {
        allValid = false;
      }
    });
    return allValid;
  }
  
  showError(field, message) {
    this.clearError(field);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    field.parentNode.appendChild(error);
    field.classList.add('error');
  }
  
  clearError(field) {
    const error = field.parentNode.querySelector('.error-message');
    if (error) {
      error.remove();
    }
    field.classList.remove('error');
  }
}

// 使用示例
const validator = new FormValidator(document.getElementById('myForm'));
validator.addField('email', [
  { test: value => value.includes('@'), message: '请输入有效的邮箱地址' },
  { test: value => value.length > 0, message: '邮箱不能为空' }
]);
validator.addField('password', [
  { test: value => value.length >= 6, message: '密码至少6位' }
]);
```

### 4. 文档事件 (Document Events)

#### 基础文档事件

```javascript
// DOM 内容加载完成
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM 加载完成');
  initializeApp();
});

// 页面加载完成
window.addEventListener('load', (event) => {
  console.log('页面完全加载');
});

// 页面卸载
window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
  event.returnValue = '确定要离开页面吗？';
});

// 页面隐藏
document.addEventListener('visibilitychange', (event) => {
  if (document.hidden) {
    console.log('页面隐藏');
    pauseVideo();
  } else {
    console.log('页面显示');
    resumeVideo();
  }
});

// 页面大小变化
window.addEventListener('resize', (event) => {
  console.log('窗口大小变化:', window.innerWidth, window.innerHeight);
  updateLayout();
});

// 页面滚动
window.addEventListener('scroll', (event) => {
  console.log('页面滚动:', window.scrollY);
  updateScrollIndicator();
});
```

#### 高级文档事件应用

```javascript
// 页面状态管理
class PageStateManager {
  constructor() {
    this.setupEvents();
    this.state = {
      isVisible: !document.hidden,
      scrollY: window.scrollY,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
  
  setupEvents() {
    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
      this.state.isVisible = !document.hidden;
      this.handleVisibilityChange();
    });
    
    // 窗口大小变化
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.state.windowSize = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        this.handleResize();
      }, 100);
    });
    
    // 页面滚动
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.state.scrollY = window.scrollY;
        this.handleScroll();
      }, 10);
    });
  }
  
  handleVisibilityChange() {
    if (this.state.isVisible) {
      this.resumeActivities();
    } else {
      this.pauseActivities();
    }
  }
  
  handleResize() {
    this.updateLayout();
    this.saveState();
  }
  
  handleScroll() {
    this.updateScrollIndicator();
    this.checkInfiniteScroll();
  }
  
  pauseActivities() {
    // 暂停视频、动画等
    console.log('暂停活动');
  }
  
  resumeActivities() {
    // 恢复活动
    console.log('恢复活动');
  }
  
  updateLayout() {
    // 更新布局
    console.log('更新布局');
  }
  
  saveState() {
    localStorage.setItem('pageState', JSON.stringify(this.state));
  }
}
```

### 5. 窗口事件 (Window Events)

#### 基础窗口事件

```javascript
// 窗口获得焦点
window.addEventListener('focus', (event) => {
  console.log('窗口获得焦点');
});

// 窗口失去焦点
window.addEventListener('blur', (event) => {
  console.log('窗口失去焦点');
});

// 窗口关闭前
window.addEventListener('beforeunload', (event) => {
  if (hasUnsavedChanges()) {
    event.preventDefault();
    event.returnValue = '有未保存的更改，确定要离开吗？';
  }
});

// 窗口卸载
window.addEventListener('unload', (event) => {
  // 清理资源
  cleanup();
});

// 窗口大小变化
window.addEventListener('resize', (event) => {
  console.log('窗口大小:', window.innerWidth, window.innerHeight);
});

// 窗口移动
window.addEventListener('move', (event) => {
  console.log('窗口移动');
});
```

### 6. 触摸事件 (Touch Events)

#### 基础触摸事件

```javascript
// 触摸开始
element.addEventListener('touchstart', (event) => {
  console.log('触摸开始:', event.touches.length);
  event.preventDefault(); // 防止默认行为
});

// 触摸移动
element.addEventListener('touchmove', (event) => {
  console.log('触摸移动');
  event.preventDefault();
});

// 触摸结束
element.addEventListener('touchend', (event) => {
  console.log('触摸结束');
});

// 触摸取消
element.addEventListener('touchcancel', (event) => {
  console.log('触摸取消');
});
```

#### 高级触摸事件应用

```javascript
// 手势识别
class GestureRecognizer {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.setupEvents();
  }
  
  setupEvents() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  handleTouchStart(event) {
    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  }
  
  handleTouchMove(event) {
    event.preventDefault();
  }
  
  handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();
    
    const deltaX = endX - this.startX;
    const deltaY = endY - this.startY;
    const deltaTime = endTime - this.startTime;
    
    // 检测滑动
    if (Math.abs(deltaX) > 50 && deltaTime < 300) {
      if (deltaX > 0) {
        this.onSwipeRight();
      } else {
        this.onSwipeLeft();
      }
    }
    
    // 检测点击
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
      this.onTap();
    }
  }
  
  onSwipeLeft() {
    console.log('向左滑动');
  }
  
  onSwipeRight() {
    console.log('向右滑动');
  }
  
  onTap() {
    console.log('点击');
  }
}
```

### 7. 媒体事件 (Media Events)

#### 基础媒体事件

```javascript
// 视频/音频事件
video.addEventListener('loadstart', () => console.log('开始加载'));
video.addEventListener('durationchange', () => console.log('时长变化'));
video.addEventListener('loadedmetadata', () => console.log('元数据加载完成'));
video.addEventListener('loadeddata', () => console.log('数据加载完成'));
video.addEventListener('progress', () => console.log('加载进度'));
video.addEventListener('canplay', () => console.log('可以播放'));
video.addEventListener('canplaythrough', () => console.log('可以流畅播放'));
video.addEventListener('play', () => console.log('开始播放'));
video.addEventListener('pause', () => console.log('暂停'));
video.addEventListener('ended', () => console.log('播放结束'));
video.addEventListener('timeupdate', () => console.log('时间更新'));
video.addEventListener('volumechange', () => console.log('音量变化'));
video.addEventListener('ratechange', () => console.log('播放速率变化'));
video.addEventListener('seeking', () => console.log('正在跳转'));
video.addEventListener('seeked', () => console.log('跳转完成'));
video.addEventListener('waiting', () => console.log('等待数据'));
video.addEventListener('stalled', () => console.log('数据停滞'));
video.addEventListener('error', () => console.log('播放错误'));
```

#### 高级媒体事件应用

```javascript
// 视频播放器
class VideoPlayer {
  constructor(video) {
    this.video = video;
    this.setupEvents();
    this.state = {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1
    };
  }
  
  setupEvents() {
    this.video.addEventListener('loadedmetadata', () => {
      this.state.duration = this.video.duration;
      this.updateDuration();
    });
    
    this.video.addEventListener('timeupdate', () => {
      this.state.currentTime = this.video.currentTime;
      this.updateProgress();
    });
    
    this.video.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.updatePlayButton();
    });
    
    this.video.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.updatePlayButton();
    });
    
    this.video.addEventListener('ended', () => {
      this.onVideoEnd();
    });
    
    this.video.addEventListener('error', (event) => {
      this.handleError(event);
    });
  }
  
  updateProgress() {
    const progress = (this.state.currentTime / this.state.duration) * 100;
    this.updateProgressBar(progress);
  }
  
  updatePlayButton() {
    const button = document.querySelector('.play-button');
    button.textContent = this.state.isPlaying ? '暂停' : '播放';
  }
  
  onVideoEnd() {
    console.log('视频播放结束');
    this.showReplayButton();
  }
  
  handleError(event) {
    console.error('视频播放错误:', event);
    this.showErrorMessage();
  }
}
```

### 8. 其他特殊事件

#### 网络事件

```javascript
// 在线状态
window.addEventListener('online', () => {
  console.log('网络连接恢复');
  syncData();
});

window.addEventListener('offline', () => {
  console.log('网络连接断开');
  enableOfflineMode();
});

// 网络信息变化
navigator.connection.addEventListener('change', () => {
  console.log('网络类型:', navigator.connection.effectiveType);
  adjustQuality();
});
```

#### 存储事件

```javascript
// localStorage 变化
window.addEventListener('storage', (event) => {
  console.log('存储变化:', event.key, event.newValue, event.oldValue);
  updateUI();
});
```

#### 剪贴板事件

```javascript
// 剪贴板变化
navigator.clipboard.addEventListener('clipboardchange', () => {
  console.log('剪贴板内容变化');
});
```

#### 设备方向事件

```javascript
// 设备方向
window.addEventListener('deviceorientation', (event) => {
  console.log('设备方向:', event.alpha, event.beta, event.gamma);
});

// 设备运动
window.addEventListener('devicemotion', (event) => {
  console.log('设备运动:', event.acceleration);
});
```

## 事件处理最佳实践

### 1. 事件委托

```javascript
// 使用事件委托处理动态元素
document.addEventListener('click', (event) => {
  if (event.target.matches('.delete-button')) {
    deleteItem(event.target.dataset.id);
  } else if (event.target.matches('.edit-button')) {
    editItem(event.target.dataset.id);
  }
});
```

### 2. 防抖和节流

```javascript
// 防抖函数
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

// 节流函数
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

// 使用示例
const debouncedResize = debounce(() => {
  updateLayout();
}, 250);

const throttledScroll = throttle(() => {
  updateScrollIndicator();
}, 100);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);
```

### 3. 事件清理

```javascript
// 组件事件管理
class EventManager {
  constructor() {
    this.listeners = new Map();
  }
  
  add(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    if (!this.listeners.has(element)) {
      this.listeners.set(element, []);
    }
    this.listeners.get(element).push({ event, handler, options });
  }
  
  remove(element, event, handler) {
    element.removeEventListener(event, handler);
    
    const listeners = this.listeners.get(element);
    if (listeners) {
      const index = listeners.findIndex(
        l => l.event === event && l.handler === handler
      );
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  removeAll(element) {
    const listeners = this.listeners.get(element);
    if (listeners) {
      listeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
      this.listeners.delete(element);
    }
  }
  
  destroy() {
    this.listeners.forEach((listeners, element) => {
      this.removeAll(element);
    });
    this.listeners.clear();
  }
}
```

## 事件类型总结表

| 事件类别 | 主要事件 | 触发时机 | 常用场景 |
|----------|----------|----------|----------|
| **鼠标事件** | click, dblclick, mousedown, mouseup, mousemove | 鼠标交互 | 点击、拖拽、悬停 |
| **键盘事件** | keydown, keyup, keypress | 键盘输入 | 快捷键、输入验证 |
| **表单事件** | submit, reset, input, change, focus, blur | 表单操作 | 表单验证、自动保存 |
| **文档事件** | DOMContentLoaded, load, visibilitychange | 页面状态 | 初始化、页面管理 |
| **窗口事件** | resize, scroll, focus, blur | 窗口变化 | 响应式布局、滚动处理 |
| **触摸事件** | touchstart, touchmove, touchend | 触摸交互 | 移动端手势 |
| **媒体事件** | play, pause, ended, timeupdate | 媒体播放 | 视频播放器 |
| **网络事件** | online, offline | 网络状态 | 离线处理 |
| **存储事件** | storage | 存储变化 | 数据同步 |
| **设备事件** | deviceorientation, devicemotion | 设备状态 | 移动端应用 |

## 总结

浏览器事件系统是现代 Web 开发的基础，掌握各种事件类型和最佳实践对于构建高质量的用户界面至关重要。

### 关键要点
1. **选择合适的监听方式**: 根据需求选择事件委托或直接监听
2. **性能优化**: 使用防抖和节流处理高频事件
3. **内存管理**: 及时清理事件监听器避免内存泄漏
4. **兼容性考虑**: 注意不同浏览器的事件支持差异
5. **用户体验**: 合理使用事件提升交互体验

通过深入理解和正确使用这些事件，可以构建出响应迅速、用户体验优秀的 Web 应用。
