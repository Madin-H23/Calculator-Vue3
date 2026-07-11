# 阶段 3 样式 · 步 20

## `style: 整体配色、窗口尺寸、字体基准`

- **指令(逐字):** 按"四"设置窗口圆角、背景、字体、尺寸、主题变量(CSS 变量定义浅/深色色板,默认浅色)。验收:整体出现 Win11 窗口观感。
- **AI 响应摘要:** 重建 `src/style.css` —— `:root` 定义全套 CSS 变量(字体/背景/显示色/各 variant 底色/hover/pressed/= 强调色/圆角),`.dark` 覆盖深色板;`main.js` 重新引入 style.css;`Calculator.vue` 加 `<style scoped>` 的 `.calculator`(360px 圆角 8px 阴影边框)。
- **改动文件:** `src/style.css`(重建)、`src/main.js`、`src/components/Calculator.vue`
- **Commit:** `7f8d472` `style: 整体配色、窗口尺寸、字体基准`
