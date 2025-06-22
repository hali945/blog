import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    plugins: [
      llmstxt()
    ]
  },
  head: [[ 'link', { rel: 'icon', href: '/vitepress-logo-mini.svg' }]],
  srcDir: './src',
  title: "风之殇的博客",
  description: "A BLOG Site",
  base: '/blog/',
  themeConfig: {
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    logo: { src: '/vitepress-logo-mini.svg', width: 24, height: 24 },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
    ],

    sidebar: [
      { text: "前端工程化", link: "/engineer/index" },
      { text: "源码", link: "/sourceCode/index" },
      { text: "css", collapsed: true, items: [
        { text: "包含块", link: "/css/containing-block" },
        { text: "BFC", link: "/css/bfc" },
        { text: "IFC", link: "/css/ifc" },
        { text: "GFC", link: "/css/gfc" },
        { text: "FFC", link: "/css/ffc" }
      ]},
      { text: "JS", collapsed: true, items: [
        { text: '原型链', link: '/js/prototype' },
        { text: 'promise', link: '/js/promise' },
        { text: '闭包', link: '/js/closure' },
        { text: '内存泄漏', link: '/js/memory-leaks-closures' },
        { text: '内存泄漏和内存溢出', link: '/js/memory-leak-vs-overflow' },
        { text: '跨域', link: '/js/cors' },
        { text: '作用域', link: '/js/scope' },
        { text: 'reflect', link: '/js/reflect' },
        { text: 'this', link: '/js/this' },
        { text: '定时器', link: '/js/timer' },
        { text: '继承', link: '/js/inheritance' },
        { text: '内存管理', link: '/js/memory-management' },
        { text: 'primitives', link: '/js/primitive' },
        { text: '事件循环', link: '/js/event-loop' },
        { text: '垃圾回收', link: '/js/garbage-collection' },
        { text: 'http缓存', link: '/js/http-cache' },
      ] },
      { text: "AI", collapsed: true, items: [
        { text: 'idea', link: '/AI/idea' },
      ] },
      { text: "小程序", link: "/mini-program", collapsed: true },
      { text: "NPM", link: "/npm", collapsed: true },
      {
        collapsed: true,
        text: 'NODE',
        items: [
          { text: 'node', link: '/node' },
          { 
            collapsed: true, text: 'http', items: [
            { text: 'GET', link: '/node/http/get' },
            { text: 'POST', link: '/node/http/post' },
            { text: 'PUT', link: '/node/http/put' },
            { text: 'DELETE', link: '/node/http/delete' }
          ] },
          { text: 'require', items: [
            { text: 'require', link: '/node/require' },
          ] },
            { text: 'ip', items: [
            { text: 'ip', link: '/node/ip' },
          ] },
          { text: '防盗链', items: [
            { text: '防盗链', link: '/node/anti-theft-chain' },
          ] }
        ]
      },
      {
        text: "构建工具",
        collapsed: true,
        items: [
          { text: 'webpack', link: '/scaffolding/webpack' },
          { text: 'vite', link: '/scaffolding/vite' },
          { text: 'rollup', link: '/scaffolding/rollup' }
        ]
      },
      {
        text: "VUE",
        collapsed: true,
        items: [
          { text: 'vue3', link: '/vue/vue3' }
        ]
      },
      {
        text: "REACT",
        collapsed: true,
        items: [
          { text: 'react', link: '/react' }
        ]
      },
      {
        text: "chrome devtools",
        collapsed: true,
        items: [
          { text: 'network', link: '/chrome-devtools/network' }
        ]
      },
      {
        text: "test",
        link: "/test"
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hali945/blog/tree/master' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Hali'
    }
  }
})
