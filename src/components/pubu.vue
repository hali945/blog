<template>
  <div class="waterfall-container" ref="containerRef">
    <!-- CSS Grid 方案 -->
    <div v-if="layoutType === 'grid'" class="waterfall-grid" :style="gridStyles">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        class="waterfall-item"
        :style="{ gridRow: `span ${item.rowSpan || 1}` }"
        @click="handleItemClick(item, index)"
      >
        <slot name="item" :item="item" :index="index">
          <div class="default-item">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title || '图片'"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
              class="item-image"
            />
            <div v-if="item.title" class="item-title">{{ item.title }}</div>
            <div v-if="item.description" class="item-description">{{ item.description }}</div>
          </div>
        </slot>
      </div>
    </div>

    <!-- CSS Columns 方案 -->
    <div v-else-if="layoutType === 'columns'" class="waterfall-columns" :style="columnStyles">
      <div
        v-for="(item, index) in items"
        :key="item.id || index"
        class="waterfall-item"
        @click="handleItemClick(item, index)"
      >
        <slot name="item" :item="item" :index="index">
          <div class="default-item">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title || '图片'"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
              class="item-image"
            />
            <div v-if="item.title" class="item-title">{{ item.title }}</div>
            <div v-if="item.description" class="item-description">{{ item.description }}</div>
          </div>
        </slot>
      </div>
    </div>

    <!-- Flexbox + JavaScript 方案 -->
    <div v-else-if="layoutType === 'flexbox'" class="waterfall-flexbox" ref="flexboxRef">
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="waterfall-column"
        :style="{ flex: 1 }"
      >
        <div
          v-for="(item, itemIndex) in column"
          :key="item.id || itemIndex"
          class="waterfall-item"
          @click="handleItemClick(item, itemIndex)"
        >
          <slot name="item" :item="item" :index="itemIndex">
            <div class="default-item">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title || '图片'"
                @load="onImageLoad(itemIndex)"
                @error="onImageError(itemIndex)"
                class="item-image"
              />
              <div v-if="item.title" class="item-title">{{ item.title }}</div>
              <div v-if="item.description" class="item-description">{{ item.description }}</div>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">{{ loadingText }}</div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && items.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <div class="empty-text">{{ emptyText }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Props 定义
const props = defineProps({
  // 数据项
  items: {
    type: Array,
    default: () => []
  },
  // 布局类型：grid, columns, flexbox
  layoutType: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'columns', 'flexbox'].includes(value)
  },
  // 列数
  columns: {
    type: Number,
    default: 4
  },
  // 间距
  gap: {
    type: Number,
    default: 20
  },
  // 最小列宽
  minColumnWidth: {
    type: Number,
    default: 300
  },
  // 是否启用懒加载
  lazyLoad: {
    type: Boolean,
    default: true
  },
  // 是否启用响应式
  responsive: {
    type: Boolean,
    default: true
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 加载文本
  loadingText: {
    type: String,
    default: '加载中...'
  },
  // 空状态文本
  emptyText: {
    type: String,
    default: '暂无数据'
  }
})

// Emits 定义
const emit = defineEmits(['item-click', 'layout-complete', 'image-load', 'image-error'])

// 响应式数据
const containerRef = ref(null)
const flexboxRef = ref(null)
const columnHeights = ref([])
const flexboxColumns = ref([])

// 计算属性
const gridStyles = computed(() => ({
  gridTemplateColumns: `repeat(auto-fit, minmax(${props.minColumnWidth}px, 1fr))`,
  gap: `${props.gap}px`,
  gridAutoRows: '10px'
}))

const columnStyles = computed(() => ({
  columnCount: props.columns,
  columnGap: `${props.gap}px`
}))

// 方法
const handleItemClick = (item, index) => {
  emit('item-click', { item, index })
}

const onImageLoad = (index) => {
  emit('image-load', { index })
  if (props.layoutType === 'grid') {
    calculateGridRowSpans()
  } else if (props.layoutType === 'flexbox') {
    redistributeItems()
  }
}

const onImageError = (index) => {
  emit('image-error', { index })
}

// Grid 方案：计算行跨度
const calculateGridRowSpans = () => {
  nextTick(() => {
    const items = containerRef.value?.querySelectorAll('.waterfall-item')
    if (!items) return

    items.forEach((item, index) => {
      const height = item.offsetHeight
      const rowSpan = Math.ceil(height / 10) // 10px 是 grid-auto-rows 的值
      item.style.gridRow = `span ${rowSpan}`
    })

    emit('layout-complete')
  })
}

// Flexbox 方案：重新分配元素
const redistributeItems = () => {
  if (!flexboxRef.value) return

  // 初始化列高度
  columnHeights.value = new Array(props.columns).fill(0)
  flexboxColumns.value = Array.from({ length: props.columns }, () => [])

  // 分配元素到最短的列
  props.items.forEach((item, index) => {
    const minHeight = Math.min(...columnHeights.value)
    const columnIndex = columnHeights.value.indexOf(minHeight)
    
    flexboxColumns.value[columnIndex].push(item)
    
    // 模拟计算高度（实际高度会在图片加载后更新）
    const estimatedHeight = item.height || 200
    columnHeights.value[columnIndex] += estimatedHeight + props.gap
  })

  emit('layout-complete')
}

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 窗口大小变化处理
const handleResize = debounce(() => {
  if (props.layoutType === 'grid') {
    calculateGridRowSpans()
  } else if (props.layoutType === 'flexbox') {
    redistributeItems()
  }
}, 250)

// 懒加载处理
const setupLazyLoading = () => {
  if (!props.lazyLoad) return

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      }
    })
  })

  // 观察所有懒加载图片
  nextTick(() => {
    const lazyImages = containerRef.value?.querySelectorAll('img[data-src]')
    lazyImages?.forEach(img => imageObserver.observe(img))
  })

  return imageObserver
}

// 生命周期
onMounted(() => {
  // 初始化布局
  if (props.layoutType === 'flexbox') {
    redistributeItems()
  } else if (props.layoutType === 'grid') {
    calculateGridRowSpans()
  }

  // 设置懒加载
  const imageObserver = setupLazyLoading()

  // 监听窗口大小变化
  if (props.responsive) {
    window.addEventListener('resize', handleResize)
  }

  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    imageObserver?.disconnect()
  })
})

// 监听数据变化
watch(() => props.items, () => {
  if (props.layoutType === 'flexbox') {
    redistributeItems()
  }
}, { deep: true })

watch(() => props.columns, () => {
  if (props.layoutType === 'flexbox') {
    redistributeItems()
  }
})

watch(() => props.layoutType, () => {
  nextTick(() => {
    if (props.layoutType === 'grid') {
      calculateGridRowSpans()
    } else if (props.layoutType === 'flexbox') {
      redistributeItems()
    }
  })
})
</script>

<style scoped>
.waterfall-container {
  position: relative;
  width: 100%;
  min-height: 200px;
}

/* Grid 布局样式 */
.waterfall-grid {
  display: grid;
  width: 100%;
}

.waterfall-item {
  break-inside: avoid;
  transition: transform 0.3s ease;
}

.waterfall-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Columns 布局样式 */
.waterfall-columns {
  width: 100%;
}

.waterfall-columns .waterfall-item {
  break-inside: avoid;
  margin-bottom: 20px;
  display: block;
}

/* Flexbox 布局样式 */
.waterfall-flexbox {
  display: flex;
  gap: 20px;
  width: 100%;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 默认项目样式 */
.default-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.default-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.default-item:hover .item-image {
  transform: scale(1.02);
}

.item-title {
  padding: 12px 16px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.item-description {
  padding: 0 16px 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 懒加载样式 */
.lazy {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy.loaded {
  opacity: 1;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  color: #999;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .waterfall-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .waterfall-columns {
    column-count: 2 !important;
  }
  
  .waterfall-flexbox {
    flex-direction: column;
  }
  
  .waterfall-column {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .waterfall-grid {
    grid-template-columns: 1fr !important;
  }
  
  .waterfall-columns {
    column-count: 1 !important;
  }
}

/* 可访问性 */
.waterfall-item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 动画效果 */
.waterfall-item {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 图片加载失败样式 */
.item-image.error {
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #999;
  font-size: 14px;
}

.item-image.error::before {
  content: '图片加载失败';
}
</style>
