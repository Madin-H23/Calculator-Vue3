# 阶段 0 · 初始化(步 1–2)

## 步 1 · `chore: Vite 初始化 Vue 3 项目`

- **指令(逐字,出自 PROMPT.md):** 用 `npm create vite@latest . -- --template vue` 在当前目录初始化;确认 `package.json`/`vite.config.js`/`index.html`/`src/main.js`/`src/App.vue` 存在,`npm install` 可装好依赖。验收:`npm run dev` 能看到 Vite 默认页。
- **AI 响应摘要:** 因目录已含已提交的规划文档(PROMPT/TODO/docs),改用**手写标准 Vite+Vue3 模板**(等价 create-vite 产物,避免与非空目录冲突)。写入 package.json/vite.config.js/index.html/.gitignore/jsconfig.json/src/main.js/src/style.css/src/App.vue/src/components/HelloWorld.vue/src/assets/vue.svg/public/vite.svg;`npm install` 装好 31 个依赖;`npm run build` 通过。
- **改动文件:** `package.json`、`package-lock.json`、`vite.config.js`、`index.html`、`.gitignore`、`jsconfig.json`、`src/main.js`、`src/style.css`、`src/App.vue`、`src/components/HelloWorld.vue`、`src/assets/vue.svg`、`public/vite.svg`
- **Commit:** `67f5474` `chore: Vite 初始化 Vue 3 项目`

## 步 2 · `chore: 清理默认模板并建立目录结构与 docs/ai-chat 归档目录`

- **指令(逐字):** 清空 App.vue 默认样式与无关内容,只留 `<div id="app">` 与最小 `<script setup>`;删除默认 logo、HelloWorld 等;按目录结构建空目录占位;建 `docs/ai-chat/`;根目录建 `README.md` 占位。验收:`npm run dev` 显示空白页无报错。
- **AI 响应摘要:** App.vue 精简为空 `<div id="app">`;main.js 去掉 style.css 引用;`git rm` HelloWorld/style.css/assets/public vite.svg;建 `src/components/.gitkeep`、`src/composables/.gitkeep`、`docs/ai-chat/.gitkeep`;根 README.md 占位。build + dev(HTTP 200)均通过。
- **改动文件:** `src/App.vue`、`src/main.js`、`README.md`(新增)、`src/components/.gitkeep`、`src/composables/.gitkeep`、`docs/ai-chat/.gitkeep`(新增);删 `HelloWorld.vue`/`style.css`/`assets/vue.svg`/`public/vite.svg`
- **Commit:** `19439d7` `chore: 清理默认模板并建立目录结构与 docs/ai-chat 归档目录`
