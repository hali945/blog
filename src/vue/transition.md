# Vue Transition 组件详解

## 1. 原理概述

Vue 的 `<transition>` 组件用于为进入/离开 DOM 的元素或组件添加过渡效果。其原理是：
- 在元素插入或移除时，自动为元素添加特定的 CSS 类名（如 v-enter、v-leave 等）。
- 结合 CSS 动画/过渡或 JavaScript 钩子函数，实现动画效果。
- 支持单元素/组件和列表过渡（配合 `<transition-group>`）。

## 2. 基本用法

```vue
<template>
  <button @click="show = !show">切换</button>
  <transition name="fade">
    <p v-if="show">Hello Vue!</p>
  </transition>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
```

## 3. 过渡类名说明

- `v-enter-from`：进入开始状态
- `v-enter-active`：进入激活状态
- `v-enter-to`：进入结束状态
- `v-leave-from`：离开开始状态
- `v-leave-active`：离开激活状态
- `v-leave-to`：离开结束状态

（自定义 name 时，如 name="fade"，类名会变为 fade-enter-from 等）

## 4. 使用技巧

- **自定义过渡持续时间**：通过 `:duration` 属性设置进入和离开动画的时长。
- **JavaScript 钩子**：可用 @before-enter、@enter、@after-enter、@before-leave、@leave、@after-leave 等事件自定义动画逻辑。
- **结合 animate.css 等第三方库**：只需在过渡类名中引入对应动画类。
- **多元素/列表过渡**：使用 `<transition-group>`，并为每个子元素设置唯一 key。
- **appear 属性**：让初始渲染时也应用过渡。

```vue
<transition appear name="fade">
  <div v-if="show">首次渲染也有动画</div>
</transition>
```

## 5. 应用场景

- 元素/组件的显示与隐藏（如弹窗、提示、抽屉等）
- 列表项的增删动画
- 页面切换动画
- 加载动画、骨架屏
- 复杂交互中的渐变、滑动、缩放等效果

## 6. 注意事项

- 过渡只对条件渲染（v-if/v-show）或动态组件生效。
- 列表过渡需使用 `<transition-group>`，且子元素需有唯一 key。
- CSS 过渡需确保类名和动画时长设置正确，否则动画可能不生效。
- 动画过长或过短都可能影响用户体验。
- 使用 JavaScript 钩子时，需调用 done() 回调，否则过渡不会结束。
- 过渡动画会影响性能，复杂动画应谨慎使用。

## 7. 参考链接

- [Vue 官方文档：过渡 & 动画](https://cn.vuejs.org/guide/built-ins/transition.html)
- [Vue 官方文档：Transition 组件 API](https://cn.vuejs.org/api/built-in-components.html#transition)

