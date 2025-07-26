# JavaScript Observers 详解

## 概述

JavaScript 中的 Observer 模式是一组强大的 API，用于监听和响应 DOM 变化、元素可见性、尺寸变化等事件。这些 API 提供了高效、非阻塞的方式来监控各种状态变化。

## 主要 Observer 类型

### 1. MutationObserver

#### 定义
MutationObserver 用于监听 DOM 树的变化，包括子节点的增删、属性的修改、文本内容的变更等。

#### 基础用法

```javascript
// 创建观察器
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log('DOM 变化:', mutation.type);
    
    switch (mutation.type) {
      case 'childList':
        console.log('子节点变化:', mutation.addedNodes, mutation.removedNodes);
        break;
      case 'attributes':
        console.log('属性变化:', mutation.attributeName, mutation.oldValue);
        break;
      case 'characterData':
        console.log('文本内容变化:', mutation.target.textContent);
        break;
    }
  });
});

// 配置观察选项
const config = {
  childList: true,        // 观察子节点变化
  subtree: true,          // 观察所有后代节点
  attributes: true,       // 观察属性变化
  attributeOldValue: true, // 记录属性旧值
  characterData: true,    // 观察文本内容变化
  characterDataOldValue: true // 记录文本旧值
};

// 开始观察
observer.observe(targetNode, config);

// 停止观察
observer.disconnect();
```

#### 高级用法

```javascript
// 监听特定属性变化
const attributeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      console.log('类名变化:', mutation.target.className);
    }
  });
});

// 监听动态加载的内容
const dynamicContentObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // 处理新添加的元素
        if (node.matches('.dynamic-content')) {
          console.log('检测到动态内容:', node);
        }
      }
    });
  });
});

// 防抖处理
let debounceTimer;
const debouncedObserver = new MutationObserver((mutations) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log('DOM 变化完成，执行操作');
  }, 100);
});
```

### 2. IntersectionObserver

#### 定义
IntersectionObserver 用于监听元素是否进入或离开视口，常用于实现懒加载、无限滚动、动画触发等功能。

#### 基础用法

```javascript
// 创建观察器
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log('元素进入视口:', entry.target);
      entry.target.classList.add('visible');
    } else {
      console.log('元素离开视口:', entry.target);
      entry.target.classList.remove('visible');
    }
  });
}, {
  root: null,           // 根元素，null 表示视口
  rootMargin: '0px',    // 根元素的外边距
  threshold: 0.5        // 触发阈值，0-1 之间
});

// 观察元素
const target = document.querySelector('.lazy-image');
observer.observe(target);

// 停止观察
observer.unobserve(target);
observer.disconnect();
```

#### 高级用法

```javascript
// 懒加载图片
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
}, {
  rootMargin: '50px' // 提前 50px 加载
});

// 无限滚动
const infiniteScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadMoreContent();
    }
  });
}, {
  threshold: 0.1
});

// 动画触发
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeIn 0.6s ease-in';
    }
  });
}, {
  threshold: [0, 0.25, 0.5, 0.75, 1] // 多个阈值
});

// 性能监控
const performanceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const ratio = entry.intersectionRatio;
    const rect = entry.boundingClientRect;
    
    console.log(`可见比例: ${ratio}`);
    console.log(`元素位置:`, rect);
  });
});
```

### 3. ResizeObserver

#### 定义
ResizeObserver 用于监听元素尺寸的变化，包括宽度、高度、边框、内边距等的变化。

#### 基础用法

```javascript
// 创建观察器
const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const { width, height } = entry.contentRect;
    console.log(`元素尺寸变化: ${width}x${height}`);
    
    // 更新布局
    updateLayout(width, height);
  });
});

// 观察元素
const target = document.querySelector('.resizable');
observer.observe(target);

// 停止观察
observer.unobserve(target);
observer.disconnect();
```

#### 高级用法

```javascript
// 响应式布局
const responsiveObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const { width } = entry.contentRect;
    
    if (width < 768) {
      entry.target.classList.add('mobile');
      entry.target.classList.remove('desktop');
    } else {
      entry.target.classList.add('desktop');
      entry.target.classList.remove('mobile');
    }
  });
});

// 图表重绘
const chartObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const chart = entry.target;
    if (chart.chartInstance) {
      chart.chartInstance.resize();
    }
  });
});

// 防抖处理
let resizeTimer;
const debouncedResizeObserver = new ResizeObserver((entries) => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    entries.forEach((entry) => {
      console.log('尺寸变化完成:', entry.contentRect);
    });
  }, 100);
});
```

### 4. PerformanceObserver

#### 定义
PerformanceObserver 用于监听性能指标，包括页面加载性能、资源加载性能、用户交互性能等。

#### 基础用法

```javascript
// 监听页面加载性能
const navigationObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('页面加载时间:', entry.loadEventEnd - entry.loadEventStart);
    console.log('DOM 解析时间:', entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart);
  });
});

navigationObserver.observe({ entryTypes: ['navigation'] });

// 监听资源加载性能
const resourceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`资源 ${entry.name} 加载时间:`, entry.duration);
  });
});

resourceObserver.observe({ entryTypes: ['resource'] });

// 监听用户交互性能
const interactionObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log('交互延迟:', entry.processingStart - entry.startTime);
  });
});

interactionObserver.observe({ entryTypes: ['interaction'] });
```

#### 高级用法

```javascript
// 性能监控系统
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.setupObservers();
  }
  
  setupObservers() {
    // 监听所有性能指标
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric(entry);
      });
    });
    
    observer.observe({ 
      entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'] 
    });
  }
  
  recordMetric(entry) {
    const metric = {
      name: entry.name,
      type: entry.entryType,
      duration: entry.duration,
      timestamp: entry.startTime
    };
    
    this.metrics.set(entry.name, metric);
    this.sendToAnalytics(metric);
  }
  
  sendToAnalytics(metric) {
    // 发送到分析服务
    console.log('性能指标:', metric);
  }
}

// 使用示例
const monitor = new PerformanceMonitor();
```

### 5. ReportingObserver

#### 定义
ReportingObserver 用于监听浏览器报告的各种问题，如 CSP 违规、废弃 API 使用等。

#### 基础用法

```javascript
// 创建观察器
const observer = new ReportingObserver((reports) => {
  reports.forEach((report) => {
    console.log('报告类型:', report.type);
    console.log('报告内容:', report.body);
  });
}, {
  buffered: true // 缓冲已存在的报告
});

// 开始观察
observer.observe();

// 停止观察
observer.disconnect();
```

#### 高级用法

```javascript
// 错误监控系统
class ErrorMonitor {
  constructor() {
    this.setupReportingObserver();
    this.setupErrorHandling();
  }
  
  setupReportingObserver() {
    const observer = new ReportingObserver((reports) => {
      reports.forEach((report) => {
        this.handleReport(report);
      });
    }, { buffered: true });
    
    observer.observe();
  }
  
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.handlePromiseRejection(event.reason);
    });
  }
  
  handleReport(report) {
    const errorData = {
      type: report.type,
      url: report.url,
      body: report.body,
      timestamp: Date.now()
    };
    
    this.sendToErrorService(errorData);
  }
  
  sendToErrorService(errorData) {
    // 发送到错误监控服务
    console.log('错误报告:', errorData);
  }
}
```

## Observer 之间的区别

### 功能对比表

| Observer | 主要用途 | 触发条件 | 性能影响 | 浏览器支持 |
|----------|----------|----------|----------|------------|
| **MutationObserver** | DOM 变化监听 | DOM 结构/属性变化 | 中等 | 优秀 |
| **IntersectionObserver** | 元素可见性 | 元素进入/离开视口 | 低 | 优秀 |
| **ResizeObserver** | 元素尺寸变化 | 元素尺寸改变 | 低 | 良好 |
| **PerformanceObserver** | 性能指标 | 性能事件发生 | 很低 | 良好 |
| **ReportingObserver** | 浏览器报告 | 违规/错误发生 | 很低 | 一般 |

### 使用场景对比

```javascript
// 选择合适的 Observer
class ObserverSelector {
  static selectObserver(useCase) {
    switch (useCase) {
      case 'DOM_CHANGES':
        return MutationObserver;
      case 'VISIBILITY':
        return IntersectionObserver;
      case 'RESIZE':
        return ResizeObserver;
      case 'PERFORMANCE':
        return PerformanceObserver;
      case 'ERRORS':
        return ReportingObserver;
      default:
        throw new Error('未知的观察器类型');
    }
  }
}
```

## 注意事项

### 1. 性能考虑

```javascript
// ❌ 错误：过度使用 MutationObserver
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // 每次变化都执行复杂操作
    complexOperation();
  });
});

// ✅ 正确：使用防抖
let debounceTimer;
const debouncedObserver = new MutationObserver((mutations) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    complexOperation();
  }, 100);
});
```

### 2. 内存泄漏

```javascript
// ❌ 错误：忘记断开连接
const observer = new MutationObserver(callback);
observer.observe(target);

// ✅ 正确：及时清理
const observer = new MutationObserver(callback);
observer.observe(target);

// 在组件销毁时清理
function cleanup() {
  observer.disconnect();
}
```

### 3. 浏览器兼容性

```javascript
// 检查支持
function checkObserverSupport() {
  const support = {
    MutationObserver: 'MutationObserver' in window,
    IntersectionObserver: 'IntersectionObserver' in window,
    ResizeObserver: 'ResizeObserver' in window,
    PerformanceObserver: 'PerformanceObserver' in window,
    ReportingObserver: 'ReportingObserver' in window
  };
  
  return support;
}

// 降级处理
if ('IntersectionObserver' in window) {
  // 使用 IntersectionObserver
} else {
  // 降级到 scroll 事件
  window.addEventListener('scroll', handleScroll);
}
```

### 4. 错误处理

```javascript
// 包装 Observer 创建
function createSafeObserver(ObserverClass, callback, options) {
  try {
    return new ObserverClass(callback, options);
  } catch (error) {
    console.error('创建 Observer 失败:', error);
    return null;
  }
}

// 使用示例
const observer = createSafeObserver(MutationObserver, callback, config);
if (observer) {
  observer.observe(target);
}
```

## 妙用

### 1. 组合使用

```javascript
// 智能组件监控
class SmartComponentMonitor {
  constructor(element) {
    this.element = element;
    this.observers = new Map();
    this.setupObservers();
  }
  
  setupObservers() {
    // 监听 DOM 变化
    this.observers.set('mutation', new MutationObserver((mutations) => {
      this.handleDOMChanges(mutations);
    }));
    
    // 监听可见性
    this.observers.set('intersection', new IntersectionObserver((entries) => {
      this.handleVisibilityChange(entries);
    }));
    
    // 监听尺寸变化
    this.observers.set('resize', new ResizeObserver((entries) => {
      this.handleResize(entries);
    }));
    
    // 开始观察
    this.observers.get('mutation').observe(this.element, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    this.observers.get('intersection').observe(this.element);
    this.observers.get('resize').observe(this.element);
  }
  
  handleDOMChanges(mutations) {
    console.log('DOM 变化:', mutations.length);
  }
  
  handleVisibilityChange(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.element.classList.add('visible');
      } else {
        this.element.classList.remove('visible');
      }
    });
  }
  
  handleResize(entries) {
    entries.forEach(entry => {
      const { width, height } = entry.contentRect;
      this.element.style.setProperty('--width', width + 'px');
      this.element.style.setProperty('--height', height + 'px');
    });
  }
  
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}
```

### 2. 虚拟滚动

```javascript
// 虚拟滚动实现
class VirtualScroller {
  constructor(container, itemHeight = 50) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.items = [];
    this.visibleItems = new Map();
    this.setupObservers();
  }
  
  setupObservers() {
    // 监听容器滚动
    this.container.addEventListener('scroll', () => {
      this.updateVisibleItems();
    });
    
    // 监听容器尺寸变化
    this.resizeObserver = new ResizeObserver(() => {
      this.updateVisibleItems();
    });
    
    this.resizeObserver.observe(this.container);
  }
  
  updateVisibleItems() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / this.itemHeight),
      this.items.length
    );
    
    // 更新可见项
    this.renderVisibleItems(startIndex, endIndex);
  }
  
  renderVisibleItems(startIndex, endIndex) {
    // 渲染可见范围内的项目
    for (let i = startIndex; i < endIndex; i++) {
      if (!this.visibleItems.has(i)) {
        const item = this.createItem(this.items[i], i);
        item.style.position = 'absolute';
        item.style.top = (i * this.itemHeight) + 'px';
        this.container.appendChild(item);
        this.visibleItems.set(i, item);
      }
    }
    
    // 移除不可见的项目
    this.visibleItems.forEach((item, index) => {
      if (index < startIndex || index >= endIndex) {
        item.remove();
        this.visibleItems.delete(index);
      }
    });
  }
}
```

### 3. 自动保存

```javascript
// 自动保存表单
class AutoSaveForm {
  constructor(form) {
    this.form = form;
    this.saveTimeout = null;
    this.setupObserver();
  }
  
  setupObserver() {
    // 监听表单变化
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'value') {
          this.debouncedSave();
        }
      });
    });
    
    // 监听输入事件
    this.form.addEventListener('input', () => {
      this.debouncedSave();
    });
    
    this.observer.observe(this.form, {
      subtree: true,
      attributes: true,
      attributeFilter: ['value']
    });
  }
  
  debouncedSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.save();
    }, 1000);
  }
  
  async save() {
    const formData = new FormData(this.form);
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: formData
      });
      console.log('自动保存成功');
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  }
}
```

### 4. 性能监控

```javascript
// 综合性能监控
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.setupObservers();
  }
  
  setupObservers() {
    // 监听性能指标
    this.performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordPerformanceMetric(entry);
      });
    });
    
    // 监听错误报告
    this.reportingObserver = new ReportingObserver((reports) => {
      reports.forEach((report) => {
        this.recordError(report);
      });
    }, { buffered: true });
    
    this.performanceObserver.observe({
      entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint']
    });
    
    this.reportingObserver.observe();
  }
  
  recordPerformanceMetric(entry) {
    const metric = {
      name: entry.name,
      type: entry.entryType,
      duration: entry.duration,
      timestamp: entry.startTime
    };
    
    this.metrics.set(`${entry.entryType}-${entry.name}`, metric);
    this.analyzePerformance(metric);
  }
  
  recordError(report) {
    const error = {
      type: report.type,
      body: report.body,
      timestamp: Date.now()
    };
    
    this.metrics.set(`error-${Date.now()}`, error);
    this.analyzeError(error);
  }
  
  analyzePerformance(metric) {
    // 性能分析逻辑
    if (metric.duration > 1000) {
      console.warn('性能警告:', metric);
    }
  }
  
  analyzeError(error) {
    // 错误分析逻辑
    console.error('检测到错误:', error);
  }
  
  getMetrics() {
    return Array.from(this.metrics.values());
  }
}
```

## 总结

JavaScript Observers 是现代 Web 开发中不可或缺的工具，它们提供了：

### 优势
- **高效性**: 异步、非阻塞的监听机制
- **精确性**: 针对特定事件类型的专门化监听
- **灵活性**: 可配置的观察选项
- **性能**: 比传统事件监听更高效

### 最佳实践
1. 选择合适的 Observer 类型
2. 及时清理资源，避免内存泄漏
3. 使用防抖/节流优化性能
4. 考虑浏览器兼容性和降级方案
5. 合理组合多个 Observer

### 适用场景
- **MutationObserver**: DOM 变化监听、动态内容处理
- **IntersectionObserver**: 懒加载、无限滚动、动画触发
- **ResizeObserver**: 响应式布局、图表重绘
- **PerformanceObserver**: 性能监控、用户体验优化
- **ReportingObserver**: 错误监控、合规检查

通过合理使用这些 Observer，可以构建出高性能、响应式的现代 Web 应用。
