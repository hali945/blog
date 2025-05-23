/*
 * @Author: hali 13656691830@163.com
 * @Date: 2025-04-28 20:23:25
 * @LastEditors: hali 13656691830@163.com
 * @LastEditTime: 2025-05-04 20:45:16
 * @FilePath: \docs\.vitepress\theme\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// https://vitepress.dev/guide/custom-theme
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './custom.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(Antd);
  }
}
