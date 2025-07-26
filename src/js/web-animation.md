# Web Animation API 详解

## 定义

Web Animation API 是一个现代的 Web 标准，提供了在浏览器中创建和控制动画的原生 JavaScript API。它允许开发者以编程方式创建复杂的动画，而无需依赖 CSS 动画或第三方库。

### 核心概念

- **Animation 对象**: 表示一个动画实例
- **KeyframeEffect**: 定义关键帧动画
- **AnimationTimeline**: 控制动画的时间线
- **AnimationPlaybackEvent**: 动画播放事件

## 详细用法

### 1. 基础语法

```javascript
// 创建关键帧
const keyframes = [
  { opacity: 0, transform: 'translateY(20px)' },
  { opacity: 1, transform: 'translateY(0)' }
];

// 创建动画选项
const options = {
  duration: 1000,
  easing: 'ease-out',
  fill: 'forwards'
};

// 创建动画
const animation = element.animate(keyframes, options);
```

### 2. 关键帧定义

```javascript
// 对象形式
const keyframes = [
  { opacity: 0, transform: 'scale(0.5)' },
  { opacity: 0.5, transform: 'scale(1.2)' },
  { opacity: 1, transform: 'scale(1)' }
];

// 数组形式
const keyframes = [
  { opacity: [0, 1], transform: ['scale(0.5)', 'scale(1)'] }
];

// 百分比形式
const keyframes = [
  { opacity: 0, transform: 'translateX(0)' },
  { opacity: 1, transform: 'translateX(100px)' }
];
```

### 3. 动画选项详解

```javascript
const options = {
  // 持续时间（毫秒）
  duration: 1000,
  
  // 延迟开始时间
  delay: 500,
  
  // 缓动函数
  easing: 'ease-in-out', // 或 'linear', 'ease-in', 'ease-out'
  
  // 动画填充模式
  fill: 'forwards', // 'none', 'forwards', 'backwards', 'both'
  
  // 迭代次数
  iterations: 3, // 或 Infinity 表示无限循环
  
  // 迭代方向
  direction: 'normal', // 'reverse', 'alternate', 'alternate-reverse'
  
  // 播放速率
  playbackRate: 1.5
};
```

### 4. 动画控制

```javascript
const animation = element.animate(keyframes, options);

// 播放控制
animation.play();      // 播放
animation.pause();     // 暂停
animation.cancel();    // 取消
animation.finish();    // 完成

// 播放状态
console.log(animation.playState); // 'running', 'paused', 'finished'

// 时间控制
animation.currentTime = 500; // 设置当前时间（毫秒）
animation.startTime = 1000;  // 设置开始时间

// 播放速率
animation.playbackRate = 2; // 2倍速播放
```

### 5. 事件监听

```javascript
animation.addEventListener('finish', () => {
  console.log('动画完成');
});

animation.addEventListener('cancel', () => {
  console.log('动画被取消');
});

animation.addEventListener('remove', () => {
  console.log('动画被移除');
});
```

### 6. 高级用法

#### 组合动画

```javascript
// 创建多个动画
const fadeIn = element.animate([
  { opacity: 0 },
  { opacity: 1 }
], { duration: 1000 });

const slideIn = element.animate([
  { transform: 'translateX(-100px)' },
  { transform: 'translateX(0)' }
], { duration: 800, delay: 200 });

// 等待所有动画完成
Promise.all([
  fadeIn.finished,
  slideIn.finished
]).then(() => {
  console.log('所有动画完成');
});
```

#### 动态修改动画

```javascript
const animation = element.animate([
  { transform: 'translateX(0)' },
  { transform: 'translateX(100px)' }
], { duration: 2000 });

// 动态修改关键帧
animation.effect.setKeyframes([
  { transform: 'translateX(0)' },
  { transform: 'translateX(200px)' }
]);

// 动态修改选项
animation.effect.updateTiming({ duration: 3000 });
```

## 与其他 JS 动画库性能比较

### 1. 性能对比表

| 特性 | Web Animation API | GSAP | Anime.js | Velocity.js |
|------|------------------|------|----------|-------------|
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **内存占用** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **兼容性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **功能丰富度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

### 2. 详细性能分析

#### Web Animation API 优势

```javascript
// 原生性能，无额外开销
const animation = element.animate(keyframes, options);
// 直接使用浏览器的动画引擎，性能最优
```

#### 性能测试示例

```javascript
// 性能测试：创建1000个动画
console.time('Web Animation API');
for (let i = 0; i < 1000; i++) {
  const element = document.createElement('div');
  element.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], { duration: 1000 });
}
console.timeEnd('Web Animation API');

// 对比 GSAP
console.time('GSAP');
for (let i = 0; i < 1000; i++) {
  const element = document.createElement('div');
  gsap.to(element, { opacity: 1, duration: 1 });
}
console.timeEnd('GSAP');
```

### 3. 内存使用对比

```javascript
// Web Animation API - 自动垃圾回收
const animation = element.animate(keyframes, options);
animation.onfinish = () => {
  // 动画完成后自动清理
};

// GSAP - 需要手动清理
const tween = gsap.to(element, { opacity: 1, duration: 1 });
tween.kill(); // 手动清理
```

## 注意事项

### 1. 浏览器兼容性

```javascript
// 检查支持
if ('animate' in Element.prototype) {
  // 支持 Web Animation API
  element.animate(keyframes, options);
} else {
  // 降级处理
  element.style.transition = 'opacity 1s';
  element.style.opacity = '1';
}
```

### 2. 性能优化

```javascript
// 避免频繁创建动画
const animation = element.animate(keyframes, options);

// 重用动画对象
animation.cancel();
animation.play();

// 使用 will-change 提示浏览器
element.style.willChange = 'transform, opacity';
```

### 3. 常见陷阱

```javascript
// ❌ 错误：直接修改正在播放的动画
animation.effect.setKeyframes(newKeyframes); // 可能导致性能问题

// ✅ 正确：先暂停再修改
animation.pause();
animation.effect.setKeyframes(newKeyframes);
animation.play();

// ❌ 错误：忘记清理事件监听器
animation.addEventListener('finish', handler);

// ✅ 正确：及时清理
animation.addEventListener('finish', handler);
animation.addEventListener('cancel', () => {
  animation.removeEventListener('finish', handler);
});
```

### 4. 调试技巧

```javascript
// 获取动画信息
console.log(animation.effect.getKeyframes());
console.log(animation.effect.getTiming());

// 监听动画状态变化
const observer = new MutationObserver(() => {
  console.log('动画状态:', animation.playState);
});

observer.observe(element, {
  attributes: true,
  attributeFilter: ['style']
});
```

## 妙用

### 1. 滚动触发动画

```javascript
// 滚动视差效果
const parallaxElements = document.querySelectorAll('.parallax');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      const speed = element.dataset.speed || 0.5;
      
      element.animate([
        { transform: 'translateY(0)' },
        { transform: `translateY(${window.innerHeight * speed}px)` }
      ], {
        duration: 1000,
        fill: 'forwards',
        easing: 'linear'
      });
    }
  });
});

parallaxElements.forEach(el => observer.observe(el));
```

### 2. 手势动画

```javascript
// 拖拽动画
let startX, startY;
let animation;

element.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  startY = e.clientY;
  
  // 取消之前的动画
  if (animation) animation.cancel();
});

element.addEventListener('mousemove', (e) => {
  if (startX !== undefined) {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    animation = element.animate([
      { transform: 'translate(0, 0)' },
      { transform: `translate(${deltaX}px, ${deltaY}px)` }
    ], {
      duration: 0,
      fill: 'forwards'
    });
  }
});
```

### 3. 状态机动画

```javascript
// 按钮状态动画
class ButtonStateMachine {
  constructor(element) {
    this.element = element;
    this.currentState = 'idle';
    this.animations = new Map();
    this.setupAnimations();
  }
  
  setupAnimations() {
    // 悬停动画
    this.animations.set('hover', this.element.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.05)' }
    ], { duration: 200, fill: 'forwards' }));
    
    // 点击动画
    this.animations.set('click', this.element.animate([
      { transform: 'scale(1.05)' },
      { transform: 'scale(0.95)' },
      { transform: 'scale(1.05)' }
    ], { duration: 150, fill: 'forwards' }));
  }
  
  transitionTo(newState) {
    if (this.animations.has(newState)) {
      this.animations.get(newState).play();
      this.currentState = newState;
    }
  }
}
```

### 4. 数据可视化动画

```javascript
// 进度条动画
function animateProgress(element, targetValue, duration = 1000) {
  const currentValue = parseFloat(element.style.width) || 0;
  
  element.animate([
    { width: `${currentValue}%` },
    { width: `${targetValue}%` }
  ], {
    duration,
    easing: 'ease-out',
    fill: 'forwards'
  });
}

// 数字计数动画
function animateCounter(element, targetValue, duration = 2000) {
  const startValue = 0;
  const steps = 60;
  const stepValue = targetValue / steps;
  const stepDuration = duration / steps;
  
  let currentStep = 0;
  
  const animation = element.animate([
    { opacity: 1 }
  ], { duration: stepDuration, iterations: steps });
  
  animation.addEventListener('finish', () => {
    currentStep++;
    const currentValue = Math.min(stepValue * currentStep, targetValue);
    element.textContent = Math.round(currentValue);
    
    if (currentStep < steps) {
      animation.play();
    }
  });
}
```

### 5. 微交互动画

```javascript
// 加载动画
function createLoadingAnimation(container) {
  const dots = Array.from({ length: 3 }, () => {
    const dot = document.createElement('div');
    dot.className = 'loading-dot';
    container.appendChild(dot);
    return dot;
  });
  
  dots.forEach((dot, index) => {
    dot.animate([
      { opacity: 0.3, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1.2)' },
      { opacity: 0.3, transform: 'scale(0.8)' }
    ], {
      duration: 1000,
      delay: index * 200,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  });
}

// 通知动画
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  notification.animate([
    { transform: 'translateX(100%)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ], {
    duration: 300,
    easing: 'ease-out',
    fill: 'forwards'
  });
  
  setTimeout(() => {
    notification.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(100%)', opacity: 0 }
    ], {
      duration: 300,
      easing: 'ease-in',
      fill: 'forwards'
    }).onfinish = () => {
      document.body.removeChild(notification);
    };
  }, 3000);
}
```

## 总结

Web Animation API 是一个强大的原生动画解决方案，具有以下特点：

### 优势
- **性能优异**: 直接使用浏览器动画引擎
- **内存友好**: 自动垃圾回收
- **标准化**: 符合 Web 标准
- **灵活性**: 支持复杂的动画控制

### 适用场景
- 需要高性能动画的应用
- 对包大小敏感的项目
- 需要精确控制动画的场景
- 现代浏览器环境

### 最佳实践
1. 检查浏览器兼容性
2. 合理使用动画选项
3. 及时清理资源
4. 考虑降级方案
5. 优化动画性能

Web Animation API 为现代 Web 应用提供了强大而灵活的动画能力，是构建流畅用户体验的重要工具。
