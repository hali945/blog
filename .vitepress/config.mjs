import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './src',
  title: "风之殇的博客",
  description: "A BLOG Site",
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
    logo: { src: '/assets/vitepress-logo-mini.svg', width: 24, height: 24 },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'markdown', link: '/markdown-examples' },
      { text: 'API', link: '/api-examples' },
    ],

    sidebar: [
      {
        collapsed: true,
        text: 'NODE',
        items: [
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
