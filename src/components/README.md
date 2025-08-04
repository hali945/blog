# Vue 3 瀑布流布局组件

一个功能完整的 Vue 3 瀑布流布局组件，支持多种布局方案和丰富的配置选项。

## 特性

- 🎨 **多种布局方案**：支持 CSS Grid、CSS Columns、Flexbox + JavaScript 三种实现
- 📱 **响应式设计**：自动适配不同屏幕尺寸
- 🖼️ **图片懒加载**：使用 Intersection Observer API 实现
- ⚡ **性能优化**：防抖处理、虚拟滚动支持
- 🎯 **可访问性**：支持键盘导航和屏幕阅读器
- 🎪 **动画效果**：流畅的过渡动画和悬停效果
- 🔧 **高度可配置**：丰富的 Props 和事件支持
- 📦 **插槽支持**：支持自定义项目模板

## 安装和使用

### 1. 导入组件

```vue
<template>
  <WaterfallLayout
    :items="items"
    :layout-type="'grid'"
    :columns="4"
    :gap="20"
    @item-click="handleItemClick"
  />
</template>

<script setup>
import WaterfallLayout from './components/pubu.vue'

const items = [
  {
    id: 1,
    title: '项目标题',
    description: '项目描述',
    image: 'https://example.com/image.jpg'
  }
  // ... 更多项目
]

const handleItemClick = ({ item, index }) => {
  console.log('点击了项目：', item.title)
}
</script>
```

### 2. 基本用法

```vue
<template>
  <div>
    <WaterfallLayout
      :items="items"
      layout-type="grid"
      :columns="4"
      :gap="20"
      :lazy-load="true"
      :responsive="true"
      @item-click="handleItemClick"
      @layout-complete="handleLayoutComplete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WaterfallLayout from './components/pubu.vue'

const items = ref([
  {
    id: 1,
    title: '美丽的风景',
    description: '这是一张非常美丽的风景照片',
    image: 'https://picsum.photos/400/300?random=1'
  },
  // ... 更多数据
])

const handleItemClick = ({ item, index }) => {
  console.log('点击了项目：', item.title, '索引：', index)
}

const handleLayoutComplete = () => {
  console.log('布局完成')
}
</script>
```

### 3. 自定义项目模板

```vue
<template>
  <WaterfallLayout :items="items" layout-type="grid">
    <template #item="{ item, index }">
      <div class="custom-item">
        <img :src="item.image" :alt="item.title" />
        <div class="item-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <div class="item-meta">
            <span>{{ item.date }}</span>
            <span>{{ item.author }}</span>
          </div>
        </div>
      </div>
    </template>
  </WaterfallLayout>
</template>
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `items` | Array | `[]` | 数据项数组 |
| `layoutType` | String | `'grid'` | 布局类型：`grid`、`columns`、`flexbox` |
| `columns` | Number | `4` | 列数 |
| `gap` | Number | `20` | 间距（像素） |
| `minColumnWidth` | Number | `300` | 最小列宽（像素） |
| `lazyLoad` | Boolean | `true` | 是否启用懒加载 |
| `responsive` | Boolean | `true` | 是否启用响应式 |
| `loading` | Boolean | `false` | 加载状态 |
| `loadingText` | String | `'加载中...'` | 加载文本 |
| `emptyText` | String | `'暂无数据'` | 空状态文本 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `item-click` | `{ item, index }` | 项目点击事件 |
| `layout-complete` | - | 布局完成事件 |
| `image-load` | `{ index }` | 图片加载完成 |
| `image-error` | `{ index }` | 图片加载失败 |

## 数据项格式

```javascript
const item = {
  id: 1,                    // 唯一标识
  title: '项目标题',         // 标题
  description: '项目描述',   // 描述
  image: 'image-url',       // 图片URL
  height: 300,              // 预估高度（可选）
  rowSpan: 1,               // Grid行跨度（可选）
  // 其他自定义属性...
}
```

## 布局方案对比

### 1. CSS Grid 方案
- **优点**：性能好，响应式支持好，浏览器兼容性好
- **缺点**：需要 JavaScript 计算行跨度
- **适用场景**：大多数项目

### 2. CSS Columns 方案
- **优点**：纯 CSS 实现，无需 JavaScript，性能最佳
- **缺点**：响应式调整困难，元素按列排列
- **适用场景**：简单场景，性能要求高的项目

### 3. Flexbox + JavaScript 方案
- **优点**：完全控制元素排列，可以实现复杂布局
- **缺点**：需要 JavaScript 计算，性能开销较大
- **适用场景**：复杂交互，需要精确控制的场景

## 性能优化建议

### 1. 图片优化
```javascript
// 使用懒加载
const items = [
  {
    id: 1,
    image: 'https://example.com/image.jpg',
    // 提供缩略图
    thumbnail: 'https://example.com/thumb.jpg',
    // 提供图片尺寸信息
    width: 400,
    height: 300
  }
]
```

### 2. 虚拟滚动（大量数据）
```javascript
// 只渲染可见区域的项目
const visibleItems = computed(() => {
  return items.value.slice(startIndex.value, endIndex.value)
})
```

### 3. 防抖处理
```javascript
// 窗口大小变化时防抖
const handleResize = debounce(() => {
  // 重新计算布局
}, 250)
```

## 响应式断点

组件内置了响应式断点：

- **桌面端**：≥ 1025px，默认 4 列
- **平板端**：769px - 1024px，3 列
- **移动端**：≤ 768px，2 列
- **小屏**：≤ 480px，1 列

## 浏览器兼容性

| 浏览器 | CSS Grid | CSS Columns | Flexbox |
|--------|----------|-------------|---------|
| Chrome | 57+ | 50+ | 28+ |
| Firefox | 52+ | 52+ | 28+ |
| Safari | 10.1+ | 9+ | 9+ |
| Edge | 16+ | 12+ | 12+ |

## 常见问题

### Q: 图片加载后布局错乱怎么办？
A: 确保在图片加载完成后调用布局重新计算：

```javascript
const onImageLoad = (index) => {
  // 图片加载完成后重新布局
  nextTick(() => {
    calculateLayout()
  })
}
```

### Q: 如何实现无限滚动？
A: 监听滚动事件，在接近底部时加载更多数据：

```javascript
const handleScroll = () => {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  if (scrollTop + windowHeight >= documentHeight - 100) {
    loadMoreItems()
  }
}
```

### Q: 如何自定义动画效果？
A: 通过 CSS 自定义动画：

```css
.waterfall-item {
  animation: customFadeIn 0.6s ease-out;
}

@keyframes customFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

## 示例项目

查看 `pubu-example.vue` 文件获取完整的使用示例，包括：

- 不同布局方案的切换
- 动态添加/删除项目
- 自定义项目模板
- 事件处理
- 响应式控制

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个组件！

## 许可证

MIT License 