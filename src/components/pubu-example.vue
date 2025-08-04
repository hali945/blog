<template>
  <div class="waterfall-example">
    <h1>瀑布流布局示例</h1>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label>布局类型：</label>
        <select v-model="layoutType" @change="handleLayoutChange">
          <option value="grid">CSS Grid</option>
          <option value="columns">CSS Columns</option>
          <option value="flexbox">Flexbox + JS</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>列数：</label>
        <input 
          type="range" 
          v-model="columns" 
          min="1" 
          max="6" 
          @input="handleColumnsChange"
        />
        <span>{{ columns }}</span>
      </div>
      
      <div class="control-group">
        <label>间距：</label>
        <input 
          type="range" 
          v-model="gap" 
          min="10" 
          max="50" 
          step="5"
        />
        <span>{{ gap }}px</span>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="lazyLoad" />
          懒加载
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="responsive" />
          响应式
        </label>
      </div>
      
      <button @click="addItems" class="add-btn">添加项目</button>
      <button @click="clearItems" class="clear-btn">清空</button>
    </div>
    
    <!-- 瀑布流组件 -->
    <WaterfallLayout
      :items="items"
      :layout-type="layoutType"
      :columns="columns"
      :gap="gap"
      :lazy-load="lazyLoad"
      :responsive="responsive"
      :loading="loading"
      @item-click="handleItemClick"
      @layout-complete="handleLayoutComplete"
      @image-load="handleImageLoad"
      @image-error="handleImageError"
    >
      <!-- 自定义项目模板 -->
      <template #item="{ item, index }">
        <div class="custom-item">
          <div class="item-header">
            <span class="item-id">#{{ index + 1 }}</span>
            <span class="item-type">{{ item.type }}</span>
          </div>
          
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.title"
            class="custom-image"
            @load="onImageLoad(index)"
            @error="onImageError(index)"
          />
          
          <div class="item-content">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-meta">
              <span class="item-date">{{ item.date }}</span>
              <span class="item-author">{{ item.author }}</span>
            </div>
          </div>
          
          <div class="item-actions">
            <button class="action-btn like-btn">
              ❤️ {{ item.likes || 0 }}
            </button>
            <button class="action-btn share-btn">
              📤 分享
            </button>
          </div>
        </div>
      </template>
    </WaterfallLayout>
    
    <!-- 统计信息 -->
    <div class="stats">
      <p>总项目数：{{ items.length }}</p>
      <p>已加载图片：{{ loadedImages }}</p>
      <p>布局类型：{{ layoutType }}</p>
      <p>列数：{{ columns }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import WaterfallLayout from './pubu.vue'

// 响应式数据
const layoutType = ref('grid')
const columns = ref(4)
const gap = ref(20)
const lazyLoad = ref(true)
const responsive = ref(true)
const loading = ref(false)
const loadedImages = ref(0)

// 模拟数据
const mockItems = [
  {
    id: 1,
    title: '美丽的风景',
    description: '这是一张非常美丽的风景照片，展现了自然的魅力。',
    image: 'https://picsum.photos/400/300?random=1',
    type: '风景',
    date: '2024-01-15',
    author: '摄影师A',
    likes: 128
  },
  {
    id: 2,
    title: '城市夜景',
    description: '繁华都市的夜晚，灯火通明，美不胜收。',
    image: 'https://picsum.photos/400/500?random=2',
    type: '城市',
    date: '2024-01-14',
    author: '摄影师B',
    likes: 256
  },
  {
    id: 3,
    title: '可爱的小猫',
    description: '一只非常可爱的小猫咪，正在好奇地看着镜头。',
    image: 'https://picsum.photos/400/350?random=3',
    type: '动物',
    date: '2024-01-13',
    author: '摄影师C',
    likes: 512
  },
  {
    id: 4,
    title: '美食佳肴',
    description: '色香味俱全的美食，让人垂涎欲滴。',
    image: 'https://picsum.photos/400/400?random=4',
    type: '美食',
    date: '2024-01-12',
    author: '摄影师D',
    likes: 64
  },
  {
    id: 5,
    title: '艺术设计',
    description: '充满创意的艺术设计作品，展现了设计师的才华。',
    image: 'https://picsum.photos/400/600?random=5',
    type: '艺术',
    date: '2024-01-11',
    author: '设计师E',
    likes: 1024
  },
  {
    id: 6,
    title: '科技产品',
    description: '最新的科技产品展示，引领未来发展方向。',
    image: 'https://picsum.photos/400/450?random=6',
    type: '科技',
    date: '2024-01-10',
    author: '科技F',
    likes: 2048
  },
  {
    id: 7,
    title: '运动瞬间',
    description: '捕捉运动中的精彩瞬间，展现力量与美。',
    image: 'https://picsum.photos/400/380?random=7',
    type: '运动',
    date: '2024-01-09',
    author: '摄影师G',
    likes: 128
  },
  {
    id: 8,
    title: '自然风光',
    description: '大自然的鬼斧神工，创造出的绝美风光。',
    image: 'https://picsum.photos/400/520?random=8',
    type: '自然',
    date: '2024-01-08',
    author: '摄影师H',
    likes: 512
  }
]

const items = ref([...mockItems])

// 方法
const handleLayoutChange = () => {
  console.log('布局类型改变为：', layoutType.value)
}

const handleColumnsChange = () => {
  console.log('列数改变为：', columns.value)
}

const handleItemClick = ({ item, index }) => {
  console.log('点击了项目：', item.title, '索引：', index)
  alert(`点击了：${item.title}`)
}

const handleLayoutComplete = () => {
  console.log('布局完成')
}

const handleImageLoad = ({ index }) => {
  loadedImages.value++
  console.log(`图片 ${index} 加载完成`)
}

const handleImageError = ({ index }) => {
  console.log(`图片 ${index} 加载失败`)
}

const onImageLoad = (index) => {
  console.log(`自定义图片 ${index} 加载完成`)
}

const onImageError = (index) => {
  console.log(`自定义图片 ${index} 加载失败`)
}

const addItems = () => {
  loading.value = true
  
  // 模拟加载延迟
  setTimeout(() => {
    const newItems = mockItems.map(item => ({
      ...item,
      id: Date.now() + Math.random(),
      image: `https://picsum.photos/400/${300 + Math.floor(Math.random() * 300)}?random=${Date.now()}`,
      title: `新项目 ${items.value.length + 1}`,
      likes: Math.floor(Math.random() * 1000)
    }))
    
    items.value.push(...newItems.slice(0, 4))
    loading.value = false
  }, 1000)
}

const clearItems = () => {
  items.value = []
}

// 生命周期
onMounted(() => {
  console.log('瀑布流示例组件已挂载')
})
</script>

<style scoped>
.waterfall-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.control-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-weight: 600;
  color: #555;
  min-width: 80px;
}

select, input[type="range"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-btn, .clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.add-btn {
  background: #007bff;
  color: white;
}

.add-btn:hover {
  background: #0056b3;
}

.clear-btn {
  background: #dc3545;
  color: white;
}

.clear-btn:hover {
  background: #c82333;
}

/* 自定义项目样式 */
.custom-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.item-id {
  font-weight: bold;
  font-size: 14px;
}

.item-type {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.custom-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.custom-item:hover .custom-image {
  transform: scale(1.05);
}

.item-content {
  padding: 16px;
  flex: 1;
}

.item-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.item-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.item-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #007bff;
}

.like-btn:hover {
  color: #e74c3c;
}

.share-btn:hover {
  color: #007bff;
}

.stats {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stats p {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-group {
    justify-content: space-between;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
}
</style> 