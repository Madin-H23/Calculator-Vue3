# Windows 11 计算器(Vue 3 + Vite)实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: 用 `superpowers:subagent-driven-development`(推荐)或 `superpowers:executing-plans` 逐任务执行。步骤用 `- [ ]` 复选框跟踪。

**Goal:** 用 Vue 3 + Vite 从零实现一个高保真还原 Windows 11 标准计算器的可用网页计算器,产出 29 个细颗粒提交。

**Architecture:** `Calculator.vue` 持有 `useCalculator()` composable 的状态,props 下发 / emit 上抛的单向数据流;`Button`→`ButtonPad`→`Calculator` 三级事件透传。布局→逻辑→样式三阶段严格隔离。

**Tech Stack:** Vue 3 `<script setup>`(Composition API)、Vite 5、JavaScript(ES2020+)。无 TS / 无 UI 库 / 无状态库 / 无图标库 / 无测试框架。

**上游:** `PROMPT.md`(29 步清单 + commit message 基准)、`TODO.md`(执行清单)、`docs/superpowers/specs/2026-07-11-calculator-design.md`(设计规格,权威语义)。

---

## 全局约定(每个任务都遵守)

- **验证**:每个实现步骤后跑 `npm run build`,期望 `built in` 且无报错。阶段门(任务 2/10/19/27 末)额外跑 `npm run dev` 浏览器冒烟。
- **提交**:subject 与 `PROMPT.md` 清单**逐字一致**;body 加尾注。命令形如:
  ```bash
  git commit -m "feat(layout): 计算器外框容器组件" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
  ```
  仅 `git add` 该步触及的文件(不越界)。
- **归档**:执行期间保留每步的"指令 + 改动 + 摘要"运行笔记;**任务 28 统一写入 `docs/ai-chat/` 并提交**(不每步提交归档,避免 hash 先有鸡先有蛋)。
- **两处认可豁免**:任务 5 内联 `display:grid`(PROMPT 已准);任务 27 主题切换逻辑就地加(spec §8)。
- **每步前**:`node_modules` 已于任务 1 装好,后续 `npm run build` 直接可用。

---

## 文件结构(责任划分)

| 文件 | 责任 | 创建于 |
|---|---|---|
| `index.html` | 入口 HTML,挂载 `#app` | 任务1 |
| `package.json` / `vite.config.js` / `.gitignore` / `jsconfig.json` | 构建配置 | 任务1 |
| `src/main.js` | 创建并挂载 Vue 应用 | 任务1 |
| `src/style.css` | 全局 reset + 主题 CSS 变量(浅/深) | 任务1(占位)→ 任务20(主题变量) |
| `src/App.vue` | 渲染 `<Calculator/>` | 任务1(默认)→ 任务2(清空)→ 任务3(挂载 Calculator) |
| `src/components/Calculator.vue` | 持有 `useCalculator()` + `theme`;标题栏 + 装配 Display/ButtonPad;dispatch | 任务3 |
| `src/components/Display.vue` | 展示 expression/current;`-`→`−` 转换 | 任务4 |
| `src/components/ButtonPad.vue` | 内存行(flex)+ 主区 4×6 Grid;buttons 描述符;透传 press | 任务5–10 |
| `src/components/Button.vue` | 通用按钮;variant 决定样式;active 高亮;点击 emit press | 任务6 |
| `src/composables/useCalculator.js` | 计算状态机(全部 action) | 任务11–19 |
| `docs/ai-chat/*.md` + `index.md` | 对话归档 | 任务28 |
| `README.md` | 运行方式 + 阶段对照 | 任务2(占位)→ 任务29 |

---

# 阶段 0 — 初始化

## Task 1: `chore: Vite 初始化 Vue 3 项目`

**Files:** Create `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `jsconfig.json`, `src/main.js`, `src/style.css`, `src/App.vue`, `src/components/HelloWorld.vue`, `src/assets/vue.svg`, `public/vite.svg`

> 目录已含已提交的规划文档(PROMPT.md/TODO.md/docs),故**直接手写标准 Vite+Vue 模板文件**(等价 `npm create vite@latest . -- --template vue` 的产物,避免与非空目录冲突)。

- [ ] **Step 1: 写 `package.json`**
```json
{
  "name": "calculator",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "vue": "^3.4.21" },
  "devDependencies": { "@vitejs/plugin-vue": "^5.0.4", "vite": "^5.2.8" }
}
```

- [ ] **Step 2: 写 `vite.config.js`**
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({ plugins: [vue()] })
```

- [ ] **Step 3: 写 `index.html`**
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 4: 写 `.gitignore`**
```
node_modules
dist
dist-ssr
*.local
logs
*.log
npm-debug.log*
.DS_Store
.idea
.vscode/*
!.vscode/extensions.json
```

- [ ] **Step 5: 写 `jsconfig.json`**
```json
{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }
```

- [ ] **Step 6: 写 `src/main.js`**
```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 7: 写 `src/style.css`(默认占位样式)**
```css
:root { font-family: system-ui, sans-serif; line-height: 1.5; }
body { margin: 0; display: flex; place-items: center; min-width: 320px; min-height: 100vh; }
#app { max-width: 1280px; margin: 0 auto; padding: 2rem; text-align: center; }
button { border-radius: 8px; border: 1px solid transparent; padding: 0.6em 1.2em; font-size: 1em; font-weight: 500; font-family: inherit; background-color: #1a1a1a; cursor: pointer; transition: border-color 0.25s; }
button:hover { border-color: #646cff; }
button:focus, button:focus-visible { outline: 4px auto -webkit-focus-ring-color; }
@media (prefers-color-scheme: dark) { body { color: #fff; background: #242424; } }
```

- [ ] **Step 8: 写 `src/App.vue`(默认模板,含 HelloWorld + logo)**
```vue
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo { height: 6em; padding: 1.5em; will-change: filter; transition: filter 300ms; }
.logo:hover { filter: drop-shadow(0 0 2em #646cffaa); }
.logo.vue:hover { filter: drop-shadow(0 0 2em #42b883aa); }
</style>
```

- [ ] **Step 9: 写 `src/components/HelloWorld.vue`**
```vue
<script setup>
defineProps({ msg: String })
</script>

<template>
  <h1>{{ msg }}</h1>
</template>
```

- [ ] **Step 10: 写 `src/assets/vue.svg` 与 `public/vite.svg`(最小有效 SVG)**
```svg
<!-- src/assets/vue.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 261.76 226.69"><path d="M161.096.001l-30.225 52.351L100.647.001H0l130.871 226.688L261.76.001z" fill="#42b883"/></svg>
```
```svg
<!-- public/vite.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 410 404"><path d="M399 75 232 393a16 16 0 0 1-28 0L11 75a16 16 0 0 1 14-23h360a16 16 0 0 1 14 23Z" fill="#646cff"/></svg>
```

- [ ] **Step 11: 安装依赖**
Run: `npm install`
Expected: 完成,生成 `node_modules/` 与 `package-lock.json`。

- [ ] **Step 12: 验证 build + dev**
Run: `npm run build`
Expected: `vite v5.x building… ✓ built in <1s`,生成 `dist/`。

- [ ] **Step 13: 提交**
```bash
git add package.json package-lock.json vite.config.js index.html .gitignore jsconfig.json src/ public/
git commit -m "chore: Vite 初始化 Vue 3 项目" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 2: `chore: 清理默认模板并建立目录结构与 docs/ai-chat 归档目录`

**Files:** Modify `src/App.vue`;Delete `src/components/HelloWorld.vue`, `src/style.css`(内容清空为最小), `src/assets/`, `public/vite.svg`;Create `src/components/.gitkeep`, `src/composables/.gitkeep`, `docs/ai-chat/.gitkeep`, `README.md`

- [ ] **Step 1: `src/App.vue` 清空为最小骨架**
```vue
<script setup>
</script>

<template>
  <div id="app"></div>
</template>
```

- [ ] **Step 2: 删除默认模板附带物**
Run: `git rm src/components/HelloWorld.vue src/style.css src/assets/vue.svg public/vite.svg`(目录用 `git rm -r src/assets`)。若 `src/style.css` 仍被 `main.js` 引用,Step 3 处理。

- [ ] **Step 3: `src/main.js` 去掉 style.css 引用**
```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 4: 建空目录占位与归档目录**
Run:
```bash
mkdir -p src/composables docs/ai-chat
touch src/components/.gitkeep src/composables/.gitkeep docs/ai-chat/.gitkeep
```

- [ ] **Step 5: 写根 `README.md` 占位**
```markdown
# Calculator(Vue 3 + Vite)

> Windows 11 标准计算器网页还原。详细说明将在最后一步补充。
```

- [ ] **Step 6: 验证**(阶段门)
Run: `npm run build`
Expected: 编译通过(`App.vue` 仅空 `<div id="app">`,无引用残留)。
Run: `npm run dev`,打开浏览器确认空白页无控制台报错,Ctrl-C 退出。

- [ ] **Step 7: 提交**
```bash
git add src/App.vue src/main.js README.md src/components/.gitkeep src/composables/.gitkeep docs/ai-chat/.gitkeep
git add -u src/components/HelloWorld.vue src/style.css src/assets public/vite.svg   # 删除纳入暂存
git commit -m "chore: 清理默认模板并建立目录结构与 docs/ai-chat 归档目录" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

# 阶段 1 — 布局(只结构,无 `@click`、无 `<style>`)

> 本阶段 Button.vue 无任何 `@click`/`emit`;ButtonPad 用内联 `display:grid`(豁免)排布;组件无 `<style>` 块。

## Task 3: `feat(layout): 计算器外框容器组件`

**Files:** Create `src/components/Calculator.vue`;Modify `src/App.vue`

- [ ] **Step 1: 写 `Calculator.vue`(空容器)**
```vue
<script setup>
</script>

<template>
  <div class="calculator"></div>
</template>
```

- [ ] **Step 2: `App.vue` 引入挂载**
```vue
<script setup>
import Calculator from './components/Calculator.vue'
</script>

<template>
  <Calculator />
</template>
```

- [ ] **Step 3: 验证 + 提交**
Run: `npm run build` → 通过。
```bash
git add src/components/Calculator.vue src/App.vue
git commit -m "feat(layout): 计算器外框容器组件" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 4: `feat(layout): 显示区组件(表达式行 + 结果行占位)`

**Files:** Create `src/components/Display.vue`;Modify `src/components/Calculator.vue`

- [ ] **Step 1: 写 `Display.vue`(占位静态文本)**
```vue
<script setup>
defineProps({ expression: String, current: String })
</script>

<template>
  <div class="display">
    <div class="expression">{{ expression }}</div>
    <div class="current">{{ current }}</div>
  </div>
</template>
```

- [ ] **Step 2: `Calculator.vue` 放入 Display(占位传值)**
```vue
<script setup>
import Display from './Display.vue'
</script>

<template>
  <div class="calculator">
    <Display expression="" current="0" />
  </div>
</template>
```

- [ ] **Step 3: 验证 + 提交**
Run: `npm run build` → 通过(页面显示 `0`)。
```bash
git add src/components/Display.vue src/components/Calculator.vue
git commit -m "feat(layout): 显示区组件(表达式行 + 结果行占位)" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 5: `feat(layout): 按钮区网格容器`

**Files:** Create `src/components/ButtonPad.vue`;Modify `src/components/Calculator.vue`

- [ ] **Step 1: 写 `ButtonPad.vue`(4 列 grid 空容器,内联样式豁免)**
```vue
<script setup>
</script>

<template>
  <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);"></div>
</template>
```

- [ ] **Step 2: `Calculator.vue` 放入 ButtonPad**
```vue
<script setup>
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'
</script>

<template>
  <div class="calculator">
    <Display expression="" current="0" />
    <ButtonPad />
  </div>
</template>
```

- [ ] **Step 3: 验证 + 提交**
Run: `npm run build` → 通过。
```bash
git add src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(layout): 按钮区网格容器" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 6: `feat(layout): 通用按钮组件 Button.vue`

**Files:** Create `src/components/Button.vue`;Modify `src/components/ButtonPad.vue`(用 Button 铺数字 7 8 9 等)

- [ ] **Step 1: 写 `Button.vue`(只渲染,不绑事件)**
```vue
<script setup>
defineProps({
  label: String,
  variant: String, // 'number' | 'operator' | 'function' | 'equals'
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <button :class="['btn', variant, { active }]" :disabled="disabled">{{ label }}</button>
</template>
```

- [ ] **Step 2: `ButtonPad.vue` 铺出数字按钮(先用部分数字)**
```vue
<script setup>
import Button from './Button.vue'
const buttons = [
  { label: '7', variant: 'number' },
  { label: '8', variant: 'number' },
  { label: '9', variant: 'number' },
]
</script>

<template>
  <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);">
    <Button v-for="(b, i) in buttons" :key="i" :label="b.label" :variant="b.variant" />
  </div>
</template>
```

- [ ] **Step 3: 验证 + 提交**
Run: `npm run build` → 通过(页面上能看到 7 8 9)。
```bash
git add src/components/Button.vue src/components/ButtonPad.vue
git commit -m "feat(layout): 通用按钮组件 Button.vue" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 7: `feat(layout): 四则运算符按钮 ÷ × − +`

**Files:** Modify `src/components/ButtonPad.vue`

- [ ] **Step 1: 在 buttons 数组补运算符(放对应行)**
```vue
<script setup>
import Button from './Button.vue'
const buttons = [
  { label: '7', variant: 'number' },
  { label: '8', variant: 'number' },
  { label: '9', variant: 'number' },
  { label: '×', variant: 'operator' },
  { label: '4', variant: 'number' },
  { label: '5', variant: 'number' },
  { label: '6', variant: 'number' },
  { label: '−', variant: 'operator' },
  { label: '1', variant: 'number' },
  { label: '2', variant: 'number' },
  { label: '3', variant: 'number' },
  { label: '+', variant: 'operator' },
]
</script>
```
(模板 `<Button v-for...>` 不变。)

- [ ] **Step 2: 验证 + 提交**
Run: `npm run build` → 通过。
```bash
git add src/components/ButtonPad.vue
git commit -m "feat(layout): 四则运算符按钮 ÷ × − +" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 8: `feat(layout): 等号与清零按钮 = C CE ⌫`

**Files:** Modify `src/components/ButtonPad.vue`

- [ ] **Step 1: 补 = / C / CE / ⌫**

把 buttons 数组扩展为(暂不追求最终顺序,本步只让这些键就位;Task 10 再排成 Win11 顺序):
```js
const buttons = [
  { label: 'C', variant: 'function' },
  { label: 'CE', variant: 'function' },
  { label: '⌫', variant: 'function' },
  { label: '÷', variant: 'operator' },
  { label: '7', variant: 'number' }, { label: '8', variant: 'number' }, { label: '9', variant: 'number' }, { label: '×', variant: 'operator' },
  { label: '4', variant: 'number' }, { label: '5', variant: 'number' }, { label: '6', variant: 'number' }, { label: '−', variant: 'operator' },
  { label: '1', variant: 'number' }, { label: '2', variant: 'number' }, { label: '3', variant: 'number' }, { label: '+', variant: 'operator' },
  { label: '0', variant: 'number' }, { label: '.', variant: 'number' }, { label: '=', variant: 'equals' },
]
```

- [ ] **Step 2: 验证 + 提交**
Run: `npm run build` → 通过(= C CE ⌫ 可见)。
```bash
git add src/components/ButtonPad.vue
git commit -m "feat(layout): 等号与清零按钮 = C CE ⌫" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 9: `feat(layout): 高级功能按钮 % 1/x x² √x ±`

**Files:** Modify `src/components/ButtonPad.vue`

- [ ] **Step 1: 补 % / 1/x / x² / √x / ±**

buttons 数组扩展(加入 function 类高级键):
```js
const buttons = [
  { label: '%', variant: 'function' }, { label: 'CE', variant: 'function' }, { label: 'C', variant: 'function' }, { label: '⌫', variant: 'function' },
  { label: '1/x', variant: 'function' }, { label: 'x²', variant: 'function' }, { label: '√x', variant: 'function' }, { label: '÷', variant: 'operator' },
  { label: '7', variant: 'number' }, { label: '8', variant: 'number' }, { label: '9', variant: 'number' }, { label: '×', variant: 'operator' },
  { label: '4', variant: 'number' }, { label: '5', variant: 'number' }, { label: '6', variant: 'number' }, { label: '−', variant: 'operator' },
  { label: '1', variant: 'number' }, { label: '2', variant: 'number' }, { label: '3', variant: 'number' }, { label: '+', variant: 'operator' },
  { label: '±', variant: 'function' }, { label: '0', variant: 'number' }, { label: '.', variant: 'number' }, { label: '=', variant: 'equals' },
]
```

- [ ] **Step 2: 验证 + 提交**
Run: `npm run build` → 通过(全部主区按键就位)。
```bash
git add src/components/ButtonPad.vue
git commit -m "feat(layout): 高级功能按钮 % 1/x x² √x ±" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 10: `feat(layout): 组装各组件到主页面并补齐完整 4×6 网格顺序`

**Files:** Modify `src/components/ButtonPad.vue`(内存行 + 确认 4×6 顺序)、`src/components/Calculator.vue`(整体装配,仍为静态占位)

- [ ] **Step 1: ButtonPad 增加内存行(独立 flex,全 disabled)+ 确认主区顺序**

```vue
<script setup>
import Button from './Button.vue'
const memoryButtons = ['MC', 'MR', 'M+', 'M-', 'MS', 'M▾']
const buttons = [
  { label: '%', variant: 'function' }, { label: 'CE', variant: 'function' }, { label: 'C', variant: 'function' }, { label: '⌫', variant: 'function' },
  { label: '1/x', variant: 'function' }, { label: 'x²', variant: 'function' }, { label: '√x', variant: 'function' }, { label: '÷', variant: 'operator' },
  { label: '7', variant: 'number' }, { label: '8', variant: 'number' }, { label: '9', variant: 'number' }, { label: '×', variant: 'operator' },
  { label: '4', variant: 'number' }, { label: '5', variant: 'number' }, { label: '6', variant: 'number' }, { label: '−', variant: 'operator' },
  { label: '1', variant: 'number' }, { label: '2', variant: 'number' }, { label: '3', variant: 'number' }, { label: '+', variant: 'operator' },
  { label: '±', variant: 'function' }, { label: '0', variant: 'number' }, { label: '.', variant: 'number' }, { label: '=', variant: 'equals' },
]
</script>

<template>
  <div>
    <div class="memory-row" style="display: flex;">
      <Button v-for="(m, i) in memoryButtons" :key="'m' + i" :label="m" variant="function" disabled />
    </div>
    <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);">
      <Button v-for="(b, i) in buttons" :key="i" :label="b.label" :variant="b.variant" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: 验证(阶段门)** + 提交
Run: `npm run build` → 通过。
Run: `npm run dev`,浏览器确认:内存行 6 个禁用键 + 主区 4×6 共 24 键,顺序与 Win11 一致(% CE C ⌫ / 1/x x² √x ÷ / 7 8 9 × / …)。Ctrl-C 退出。
```bash
git add src/components/ButtonPad.vue
git commit -m "feat(layout): 组装各组件到主页面并补齐完整 4×6 网格顺序" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

# 阶段 2 — 逻辑(只行为,不写 CSS)

> 建立事件链 `Button(@click→emit press)`→`ButtonPad(@press→透传 payload)`→`Calculator(dispatch→useCalculator action)`。按钮仍无 CSS。
> `useCalculator.js` 在 Task 11 创建,后续 task 追加 action。

## Task 11: `feat(logic): 数字 0-9 输入与显示更新`

**Files:** Create `src/composables/useCalculator.js`;Modify `Button.vue`(点击 emit)、`ButtonPad.vue`(数字描述符加 type/value + 透传 press)、`Calculator.vue`(持状态 + dispatch + Display 绑定)

- [ ] **Step 1: 写 `useCalculator.js`(脚手架 + `inputDigit`)**
```js
import { ref, computed } from 'vue'

export function useCalculator() {
  const current = ref('0')
  const expression = ref('')
  const prevValue = ref(null)
  const pendingOp = ref(null)
  const resetNext = ref(false)
  const error = ref(false)
  const activeOp = computed(() => (error.value ? null : pendingOp.value))

  function clearAll() {
    current.value = '0'
    expression.value = ''
    prevValue.value = null
    pendingOp.value = null
    resetNext.value = false
    error.value = false
  }

  function inputDigit(d) {
    if (error.value) { clearAll(); current.value = d; return }
    if (resetNext.value) { current.value = d; resetNext.value = false; return }
    current.value = current.value === '0' ? d : current.value + d
  }

  return { current, expression, activeOp, inputDigit }
}
```

- [ ] **Step 2: `Button.vue` 点击 emit press**
```vue
<script setup>
defineProps({
  label: String,
  variant: String,
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})
defineEmits(['press'])
</script>

<template>
  <button :class="['btn', variant, { active }]" :disabled="disabled" @click="$emit('press')">{{ label }}</button>
</template>
```

- [ ] **Step 3: `ButtonPad.vue` 数字描述符加 type/value + 透传 press**
```vue
<script setup>
import Button from './Button.vue'
defineEmits(['press'])
const props = defineProps({ activeOp: String })
const memoryButtons = ['MC', 'MR', 'M+', 'M-', 'MS', 'M▾']
const buttons = [
  { label: '%', variant: 'function' }, { label: 'CE', variant: 'function' }, { label: 'C', variant: 'function' }, { label: '⌫', variant: 'function' },
  { label: '1/x', variant: 'function' }, { label: 'x²', variant: 'function' }, { label: '√x', variant: 'function' }, { label: '÷', variant: 'operator' },
  { label: '7', variant: 'number', type: 'digit', value: '7' },
  { label: '8', variant: 'number', type: 'digit', value: '8' },
  { label: '9', variant: 'number', type: 'digit', value: '9' },
  { label: '×', variant: 'operator' },
  { label: '4', variant: 'number', type: 'digit', value: '4' },
  { label: '5', variant: 'number', type: 'digit', value: '5' },
  { label: '6', variant: 'number', type: 'digit', value: '6' },
  { label: '−', variant: 'operator' },
  { label: '1', variant: 'number', type: 'digit', value: '1' },
  { label: '2', variant: 'number', type: 'digit', value: '2' },
  { label: '3', variant: 'number', type: 'digit', value: '3' },
  { label: '+', variant: 'operator' },
  { label: '±', variant: 'function' },
  { label: '0', variant: 'number', type: 'digit', value: '0' },
  { label: '.', variant: 'number' },
  { label: '=', variant: 'equals' },
]
</script>

<template>
  <div>
    <div class="memory-row" style="display: flex;">
      <Button v-for="(m, i) in memoryButtons" :key="'m' + i" :label="m" variant="function" disabled />
    </div>
    <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);">
      <Button
        v-for="(b, i) in buttons" :key="i" :label="b.label" :variant="b.variant"
        :active="b.type === 'op' && b.value === props.activeOp"
        @press="$emit('press', { type: b.type, value: b.value })"
      />
    </div>
  </div>
</template>
```
> 仅数字键有 type/value,其它键暂无,点击会 emit `{type: undefined}`,dispatch 不命中即忽略(后续 task 补)。

- [ ] **Step 4: `Calculator.vue` 持状态 + dispatch + 绑定 Display**

> **本阶段约定**:Calculator 用**解构**拿 composable:`const { current, expression, activeOp, ...各 action } = useCalculator()`。解构出的 ref/computed 在模板自动解包(`:current="current"`、`:active-op="activeOp"`,**不要写 `.value`**)。后续每个 logic task:① 在解构列表追加新 action 名;② 在 `dispatch` 追加分支(直接调用,无 `calc.` 前缀)。
```vue
<script setup>
import { useCalculator } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'

const { current, expression, activeOp, inputDigit } = useCalculator()

function dispatch(p) {
  if (p.type === 'digit') inputDigit(p.value)
}
</script>

<template>
  <div class="calculator">
    <Display :expression="expression" :current="current" />
    <ButtonPad :active-op="activeOp" @press="dispatch" />
  </div>
</template>
```

- [ ] **Step 5: 验证 + 提交**
Run: `npm run build` → 通过。Run `npm run dev`,点击 7 8 9 等数字能输入显示,前导零被替换(`0`→按 `5` 显示 `5`)。Ctrl-C 退出。
```bash
git add src/composables/useCalculator.js src/components/Button.vue src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): 数字 0-9 输入与显示更新" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 12: `feat(logic): 小数点输入(防重复)`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`(dot 描述符 + dispatch 在 Calculator)

- [ ] **Step 1: `useCalculator.js` 加 `inputDot`**

在 `inputDigit` 之后加:
```js
function inputDot() {
  if (error.value) { clearAll(); current.value = '0.'; return }
  if (resetNext.value) { current.value = '0.'; resetNext.value = false; return }
  if (!current.value.includes('.')) current.value += '.'
}
```
并在 `return` 中追加 `inputDot`。

- [ ] **Step 2: `ButtonPad.vue` dot 描述符加 type**
```js
{ label: '.', variant: 'number', type: 'dot' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `inputDot`;dispatch 加 dot 分支**
```js
const { current, expression, activeOp, inputDigit, inputDot } = useCalculator()
function dispatch(p) {
  if (p.type === 'digit') inputDigit(p.value)
  else if (p.type === 'dot') inputDot()
}
```

- [ ] **Step 4: 验证 + 提交**
Run `npm run build`;`npm run dev` 验证:`5 . 5` → `5.5`;再按 `.` 无效(不出现 `5.5.`)。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): 小数点输入(防重复)" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 13: `feat(logic): 四则运算选择与表达式拼接`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`

- [ ] **Step 1: `useCalculator.js` 顶部加 OP_SYMBOL 与 compute/format,并实现 `chooseOp`**

文件顶部(import 之后)加:
```js
const OP_SYMBOL = { '+': '+', '-': '−', '×': '×', '÷': '÷' }

function compute(a, b, op) {
  if (op === '÷' && b === 0) return '不能除以零'
  let r
  if (op === '+') r = a + b
  else if (op === '-') r = a - b
  else if (op === '×') r = a * b
  else r = a / b
  if (!isFinite(r)) return '无效输入'
  return r
}

function format(n) {
  if (!isFinite(n)) return '无效输入'
  return Number(n.toPrecision(15)).toString()
}
```
在 composable 内(`clearAll` 附近)加 `chooseOp`:
```js
function chooseOp(op) {
  if (error.value) return
  let val = parseFloat(current.value)
  if (pendingOp.value && !resetNext.value && prevValue.value != null) {
    const r = compute(prevValue.value, val, pendingOp.value)
    if (typeof r === 'string') { setError(r); return }
    val = r
    current.value = format(val)
  }
  prevValue.value = val
  pendingOp.value = op
  expression.value = `${format(val)} ${OP_SYMBOL[op]}`
  resetNext.value = true
}

function setError(msg) { current.value = msg; error.value = true }
```
`return` 追加 `chooseOp`。

- [ ] **Step 2: `ButtonPad.vue` 四个运算符描述符加 type/value**
```js
{ label: '÷', variant: 'operator', type: 'op', value: '÷' },
{ label: '×', variant: 'operator', type: 'op', value: '×' },
{ label: '−', variant: 'operator', type: 'op', value: '-' },
{ label: '+', variant: 'operator', type: 'op', value: '+' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `chooseOp`;dispatch 加 op 分支**
```js
else if (p.type === 'op') chooseOp(p.value)
```

- [ ] **Step 4: 验证 + 提交**
Run `npm run dev`:`8 + 9` → 表达式行 `8 +`,结果行 `9`,运算符 `+` 视觉高亮(逻辑层标记,视觉待样式阶段);连续运算 `8 + 9 ×` → 中间结果。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): 四则运算选择与表达式拼接" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 14: `feat(logic): = 等于计算(基础四则)`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`

- [ ] **Step 1: `useCalculator.js` 实现 `equals`**
```js
function equals() {
  if (error.value || pendingOp.value == null || prevValue.value == null) return
  const val = parseFloat(current.value)
  const r = compute(prevValue.value, val, pendingOp.value)
  expression.value = `${format(prevValue.value)} ${OP_SYMBOL[pendingOp.value]} ${format(val)} =`
  if (typeof r === 'string') { setError(r); pendingOp.value = null; resetNext.value = true; return }
  current.value = format(r)
  pendingOp.value = null
  prevValue.value = null
  resetNext.value = true
}
```
`return` 追加 `equals`。

- [ ] **Step 2: `ButtonPad.vue` = 描述符加 type**
```js
{ label: '=', variant: 'equals', type: 'equals' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `equals`;dispatch 加 equals**
```js
else if (p.type === 'equals') equals()
```

- [ ] **Step 4: 验证 + 提交**
`npm run dev`:`8 + 9 =` → 表达式 `8 + 9 =`、结果 `17`;`9 ÷ 0 =` → `不能除以零`。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): = 等于计算(基础四则)" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 15: `feat(logic): C 全清 / CE 清当前`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`

- [ ] **Step 1: `useCalculator.js` 加 `clearEntry`(`clearAll` 已存在)**
```js
function clearEntry() { current.value = '0'; resetNext.value = false; error.value = false }
```
`return` 追加 `clearAll, clearEntry`。

- [ ] **Step 2: `ButtonPad.vue` C / CE 描述符加 type**
```js
{ label: '%', variant: 'function' },
{ label: 'CE', variant: 'function', type: 'ce' },
{ label: 'C', variant: 'function', type: 'clear' },
{ label: '⌫', variant: 'function' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `clearAll, clearEntry`;dispatch 加 clear/ce**
```js
else if (p.type === 'clear') clearAll()
else if (p.type === 'ce') clearEntry()
```

- [ ] **Step 4: 验证 + 提交**
`npm run dev`:`8 + 9` 后 `C` → 全清回 `0`;`8 +` 后 `CE` → 当前清 `0`、表达式保留。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): C 全清 / CE 清当前" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 16: `feat(logic): Backspace 退格删除`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`

- [ ] **Step 1: `useCalculator.js` 加 `backspace`**
```js
function backspace() {
  if (error.value || resetNext.value) return
  current.value = current.value.length > 1 ? current.value.slice(0, -1) : '0'
  if (current.value === '-') current.value = '0'
}
```
`return` 追加 `backspace`。

- [ ] **Step 2: `ButtonPad.vue` ⌫ 描述符加 type**
```js
{ label: '⌫', variant: 'function', type: 'back' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `backspace`;dispatch 加 back**
```js
else if (p.type === 'back') backspace()
```

- [ ] **Step 4: 验证 + 提交**
`npm run dev`:输入 `123`,⌫ 逐位删至 `0`。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): Backspace 退格删除" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 17: `feat(logic): ± 正负号切换`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`

- [ ] **Step 1: `useCalculator.js` 加 `negate`**
```js
function negate() {
  if (error.value || current.value === '0') return
  current.value = current.value.startsWith('-') ? current.value.slice(1) : '-' + current.value
}
```
`return` 追加 `negate`。

- [ ] **Step 2: `ButtonPad.vue` ± 描述符加 type**
```js
{ label: '±', variant: 'function', type: 'negate' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `negate`;dispatch 加 negate**
```js
else if (p.type === 'negate') negate()
```

- [ ] **Step 4: 验证 + 提交**
`npm run dev`:`5 → ± → -5 → ± → 5`。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): ± 正负号切换" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 18: `feat(logic): % 百分比换算`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`

- [ ] **Step 1: `useCalculator.js` 加 `percent`**
```js
function percent() {
  if (error.value) return
  current.value = format(parseFloat(current.value) / 100)
  resetNext.value = true
}
```
`return` 追加 `percent`。

- [ ] **Step 2: `ButtonPad.vue` % 描述符加 type**
```js
{ label: '%', variant: 'function', type: 'percent' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `percent`;dispatch 加 percent**
```js
else if (p.type === 'percent') percent()
```

- [ ] **Step 4: 验证 + 提交**
`npm run dev`:`50 %` → `0.5`。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue
git commit -m "feat(logic): % 百分比换算" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 19: `feat(logic): 1/x、x²、√x 科学功能键`

**Files:** Modify `useCalculator.js`、`ButtonPad.vue`、`Calculator.vue`、`Display.vue`(`-`→`−` 转换)

- [ ] **Step 1: `useCalculator.js` 加 reciprocal/square/sqrt**
```js
function reciprocal() {
  if (error.value) return
  const v = parseFloat(current.value)
  if (v === 0) { setError('不能除以零'); return }
  const r = 1 / v
  if (!isFinite(r)) { setError('无效输入'); return }
  expression.value = `1/(${current.value})`
  current.value = format(r)
  resetNext.value = true
}

function square() {
  if (error.value) return
  const v = parseFloat(current.value)
  const r = v * v
  if (!isFinite(r)) { setError('无效输入'); return }
  expression.value = `sqr(${current.value})`
  current.value = format(r)
  resetNext.value = true
}

function sqrt() {
  if (error.value) return
  const v = parseFloat(current.value)
  if (v < 0) { setError('无效输入'); return }
  const r = Math.sqrt(v)
  if (!isFinite(r)) { setError('无效输入'); return }
  expression.value = `√(${current.value})`
  current.value = format(r)
  resetNext.value = true
}
```
`return` 追加 `reciprocal, square, sqrt`。

- [ ] **Step 2: `ButtonPad.vue` 三个科学键描述符加 type**
```js
{ label: '1/x', variant: 'function', type: 'reciprocal' },
{ label: 'x²', variant: 'function', type: 'square' },
{ label: '√x', variant: 'function', type: 'sqrt' },
```

- [ ] **Step 3: `Calculator.vue` 解构追加 `reciprocal, square, sqrt`;dispatch 加三键**
```js
else if (p.type === 'reciprocal') reciprocal()
else if (p.type === 'square') square()
else if (p.type === 'sqrt') sqrt()
```

- [ ] **Step 4: `Display.vue` 加 `-`→`−` 转换**
```vue
<script setup>
import { computed } from 'vue'
const props = defineProps({ expression: String, current: String })
const exprView = computed(() => (props.expression || '').replaceAll('-', '−'))
const curView = computed(() => (props.current || '').replaceAll('-', '−'))
</script>

<template>
  <div class="display">
    <div class="expression">{{ exprView }}</div>
    <div class="current">{{ curView }}</div>
  </div>
</template>
```

- [ ] **Step 5: 验证(阶段门)** + 提交
Run `npm run build`;`npm run dev` 回归(spec §10):
`9 1/x → 0.111…`、`3 x² → 9`、`9 √x → 3`、`9 ± √x → 无效输入`;`8 + 9 = 17`、`9 ÷ 0 = 不能除以零`;`5 ±` 切换;`50 % → 0.5`;`C/CE/⌫`;`5.` 合法;不出现 `5.5.5`;负号显示为 `−`。Ctrl-C。
```bash
git add src/composables/useCalculator.js src/components/ButtonPad.vue src/components/Calculator.vue src/components/Display.vue
git commit -m "feat(logic): 1/x、x²、√x 科学功能键" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

# 阶段 3 — 样式(只视觉,不改结构/逻辑)

> 新增各组件 `<style scoped>` 与全局 `src/style.css` 主题变量。颜色取自 `PROMPT.md` §4。

## Task 20: `style: 整体配色、窗口尺寸、字体基准`

**Files:** Create `src/style.css`(主题变量);Modify `Calculator.vue`(加 `<style scoped>` 与窗口观感;重新在 main.js 引入 style.css)

- [ ] **Step 1: 写 `src/style.css`(全局 reset + CSS 变量:浅/深色板)**
```css
:root {
  --font: 'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --bg: #F3F3F3;
  --display-expr: #616161;
  --display-result: #201F1F;
  --fn-bg: #F9F9F9;  --fn-hover: #F0F0F0;  --fn-pressed: #E6E6E6;
  --num-bg: #FBFBFB; --num-hover: #F3F3F3; --num-pressed: #EBEBEB;
  --op-bg: #FBFBFB;  --op-hover: #F3F3F3;  --op-pressed: #EBEBEB;
  --eq-bg: #0078D4;  --eq-hover: #1A86D9;  --eq-pressed: #0067C0;  --eq-fg: #FFFFFF;
  --accent: #0078D4;
  --memory-fg: #B5B5B5;
  --btn-fg: #201F1F;
  --radius-window: 8px;
  --radius-btn: 4px;
}
.dark {
  --bg: #202020;
  --display-expr: #9A9A9A;
  --display-result: #FFFFFF;
  --fn-bg: #2B2B2B;  --fn-hover: #3A3A3A;  --fn-pressed: #4A4A4A;
  --num-bg: #2B2B2B; --num-hover: #3A3A3A; --num-pressed: #4A4A4A;
  --op-bg: #2B2B2B;  --op-hover: #3A3A3A;  --op-pressed: #4A4A4A;
  --memory-fg: #5A5A5A;
  --btn-fg: #FFFFFF;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); }
body { font-family: var(--font); }
```

- [ ] **Step 2: `main.js` 重新引入 style.css**
```js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 3: `Calculator.vue` 加窗口观感 `<style scoped>`**
```vue
<style scoped>
.calculator {
  width: 360px;
  margin: 40px auto;
  background: var(--bg);
  border-radius: var(--radius-window);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: var(--font);
}
</style>
```

- [ ] **Step 4: 验证 + 提交**
`npm run build` → 通过;`npm run dev` → 出现 Win11 圆角窗口观感(浅灰)。Ctrl-C。
```bash
git add src/style.css src/main.js src/components/Calculator.vue
git commit -m "style: 整体配色、窗口尺寸、字体基准" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 21: `style: 显示区字号层级与右对齐`

**Files:** Modify `Display.vue`

- [ ] **Step 1: `Display.vue` 加 `<style scoped>`**
```vue
<style scoped>
.display { padding: 8px 16px 12px; text-align: right; }
.expression {
  min-height: 22px;
  font-size: 16px;
  color: var(--display-expr);
  word-break: break-all;
}
.current {
  font-size: 42px;
  font-weight: 400;
  color: var(--display-result);
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
```

- [ ] **Step 2: 验证 + 提交**
`npm run dev` → 表达式小灰字、结果大字右对齐。Ctrl-C。
```bash
git add src/components/Display.vue
git commit -m "style: 显示区字号层级与右对齐" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 22: `style: 数字按钮底色与尺寸`

**Files:** Modify `Button.vue`

- [ ] **Step 1: `Button.vue` 加 `<style scoped>`(先做 number + 通用)**
```vue
<style scoped>
.btn {
  border: none;
  border-radius: var(--radius-btn);
  font-family: var(--font);
  color: var(--btn-fg);
  cursor: pointer;
  user-select: none;
}
.btn:disabled { cursor: default; }
.btn.number {
  background: var(--num-bg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.number:hover { background: var(--num-hover); }
.btn.number:active { background: var(--num-pressed); }
</style>
```

- [ ] **Step 2: 验证 + 提交**
`npm run dev` → 数字键贴合 Win11(#FBFBFB、22px、600、4px 圆角)。Ctrl-C。
```bash
git add src/components/Button.vue
git commit -m "style: 数字按钮底色与尺寸" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 23: `style: 运算符列按钮样式`

**Files:** Modify `Button.vue`

- [ ] **Step 1: `Button.vue` `<style>` 追加 operator(含 active 高亮)**
```css
.btn.operator {
  background: var(--op-bg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.operator:hover { background: var(--op-hover); }
.btn.operator:active { background: var(--op-pressed); }
.btn.operator.active {
  background: var(--accent);
  color: var(--eq-fg);
}
```

- [ ] **Step 2: 验证 + 提交**
`npm run dev` → 按 `+` 后该键高亮(强调蓝底白字),下次输入后高亮消失。Ctrl-C。
```bash
git add src/components/Button.vue
git commit -m "style: 运算符列按钮样式" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 24: `style: = 等号强调色`

**Files:** Modify `Button.vue`

- [ ] **Step 1: `Button.vue` `<style>` 追加 equals**
```css
.btn.equals {
  background: var(--eq-bg);
  color: var(--eq-fg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.equals:hover { background: var(--eq-hover); }
.btn.equals:active { background: var(--eq-pressed); }
```

- [ ] **Step 2: 验证 + 提交**
`npm run dev` → = 键蓝色突出、文字白。Ctrl-C。
```bash
git add src/components/Button.vue
git commit -m "style: = 等号强调色" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 25: `style: 功能键与高级键区分色`

**Files:** Modify `Button.vue`

- [ ] **Step 1: `Button.vue` `<style>` 追加 function**
```css
.btn.function {
  background: var(--fn-bg);
  font-size: 16px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.function:hover { background: var(--fn-hover); }
.btn.function:active { background: var(--fn-pressed); }
.btn.function:disabled {
  color: var(--memory-fg);
  background: transparent;
  font-size: 13px;
}
```

- [ ] **Step 2: 验证 + 提交**
`npm run dev` → % CE C ⌫ 与 1/x x² √x ± 为 #F9F9F9 系、16px;内存行小字浅灰禁用。Ctrl-C。
```bash
git add src/components/Button.vue
git commit -m "style: 功能键与高级键区分色" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 26: `style: hover / active 交互态`

**Files:** Modify `Button.vue`(已含各 variant 的 hover/active;本步补通用过渡与禁用态收尾)、`ButtonPad.vue`(网格间隙)

- [ ] **Step 1: `Button.vue` 给 `.btn` 加过渡**
```css
.btn { transition: background-color 0.08s ease, transform 0.05s ease; }
.btn:not(:disabled):active { transform: scale(0.98); }
```
(追加到 `.btn` 规则或紧随其后。)

- [ ] **Step 2: `ButtonPad.vue` 给网格与内存行加间隙(内联 grid 升级为 scoped style 亦可,但保持不越界:仅加间隙)**
```vue
<style scoped>
.memory-row { gap: 2px; padding: 2px 4px; }
.memory-row :deep(.btn) { flex: 1 1 0; height: 32px; }
.button-pad { gap: 2px; padding: 2px 4px 4px; }
.button-pad :deep(.btn) { width: 100%; }
</style>
```
并把 ButtonPad 根模板两处内联 `style="display: grid;..."`/`style="display: flex;"` 保留(结构不动,样式由 scoped 补间隙)。

- [ ] **Step 3: 验证 + 提交**
`npm run dev` → 鼠标悬停/按下各键有底色+轻微缩放反馈,深色主题同步(切深色后变量生效)。Ctrl-C。
```bash
git add src/components/Button.vue src/components/ButtonPad.vue
git commit -m "style: hover / active 交互态" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 27: `style: 圆角、边框、阴影、内存按钮行收尾细节`

**Files:** Modify `Calculator.vue`(标题栏 + 主题切换按钮 + 主题逻辑[认可豁免])、`ButtonPad.vue`、`Button.vue`(细节微调)

- [ ] **Step 1: `Calculator.vue` 加标题栏 + 主题切换按钮 + 主题逻辑(豁免)**

> 在 Task 11–19 的 Calculator.vue 基础上:`<script setup>` 改为下方(完整解构 + 主题状态 + 完整 dispatch);`<template>` 加标题栏;`<style scoped>` 含完整 `.calculator` 规则(同 Task 20)+ 新增标题栏规则。
```vue
<script setup>
import { ref } from 'vue'
import { useCalculator } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'

const {
  current, expression, activeOp,
  inputDigit, inputDot, chooseOp, equals,
  clearAll, clearEntry, backspace, negate, percent,
  reciprocal, square, sqrt,
} = useCalculator()

const theme = ref('light')
function toggleTheme() { theme.value = theme.value === 'light' ? 'dark' : 'light' }

function dispatch(p) {
  if (p.type === 'digit') inputDigit(p.value)
  else if (p.type === 'dot') inputDot()
  else if (p.type === 'op') chooseOp(p.value)
  else if (p.type === 'equals') equals()
  else if (p.type === 'clear') clearAll()
  else if (p.type === 'ce') clearEntry()
  else if (p.type === 'back') backspace()
  else if (p.type === 'negate') negate()
  else if (p.type === 'percent') percent()
  else if (p.type === 'reciprocal') reciprocal()
  else if (p.type === 'square') square()
  else if (p.type === 'sqrt') sqrt()
}
</script>

<template>
  <div class="calculator" :class="{ dark: theme === 'dark' }">
    <div class="title-bar">
      <span class="menu">≡</span>
      <span class="mode">标准</span>
      <span class="caret">▾</span>
      <button class="theme-toggle" @click="toggleTheme">{{ theme === 'light' ? '🌙' : '☀' }}</button>
    </div>
    <Display :expression="expression" :current="current" />
    <ButtonPad :active-op="activeOp" @press="dispatch" />
  </div>
</template>

<style scoped>
.calculator {
  width: 360px;
  margin: 40px auto;
  background: var(--bg);
  border-radius: var(--radius-window);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: var(--font);
}
.title-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px 4px; font-size: 14px; color: var(--display-expr);
}
.title-bar .menu { font-size: 18px; }
.title-bar .caret { font-size: 12px; }
.title-bar .theme-toggle {
  margin-left: auto; border: none; background: transparent; cursor: pointer;
  font-size: 16px; color: var(--display-expr); border-radius: var(--radius-btn); padding: 2px 6px;
}
.title-bar .theme-toggle:hover { background: var(--fn-hover); }
</style>
```
> `.dark` 主题由根容器 `:class="{ dark: ... }"` 切换;色板变量在 `src/style.css` 的 `.dark` 规则下覆盖(浅色默认)。

- [ ] **Step 2: 细节微调(可选小改,不越界到结构/逻辑)**
- `Calculator.vue` `.calculator` 已有阴影/圆角;确认 `border`、`overflow:hidden` 存在。
- `ButtonPad.vue`:确认内存行与主区间无错位。

- [ ] **Step 3: 验证(阶段门)** + 提交
Run `npm run build`;`npm run dev` 整体回归 + 点 🌙/☀ 切换浅/深主题生效,视觉贴近 Win11 标准计算器。Ctrl-C。
```bash
git add src/components/Calculator.vue
git commit -m "style: 圆角、边框、阴影、内存按钮行收尾细节" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

# 收尾

## Task 28: `docs: 归档各阶段完整 AI 对话记录`

**Files:** Create `docs/ai-chat/index.md`, `00-init.md`, `01-layout-01.md` … `01-layout-08.md`, `02-logic-01.md` … `02-logic-09.md`, `03-style-01.md` … `03-style-08.md`, `04-finalize.md`

- [ ] **Step 1: 用 git log 取 29 个 hash**
Run: `git log --reverse --pretty=format:'%h %s'` → 记录每个 subject 对应的 hash。

- [ ] **Step 2: 写每个归档文件**

每个文件统一字段(逐字指令取自 `PROMPT.md` 对应步;AI 响应摘要 + 改动文件 + commit hash):
```markdown
# <阶段> · 步 <N>

**指令(逐字):** <PROMPT.md 该步标题与描述>
**AI 响应摘要:** <本步实际做了什么>
**改动文件:** <list>
**Commit:** `<hash>` `<subject>`
```
- `00-init.md` ← 步 1–2
- `01-layout-01.md` … `01-layout-08.md` ← 步 3–10(各一文件)
- `02-logic-01.md` … `02-logic-09.md` ← 步 11–19
- `03-style-01.md` … `03-style-08.md` ← 步 20–27
- `04-finalize.md` ← 步 28–29

- [ ] **Step 3: 写 `docs/ai-chat/index.md`(总索引)**
```markdown
# AI 对话归档索引

| 步 | Commit | Subject | 文件 |
|---|---|---|---|
| 1 | <h> | chore: Vite 初始化 Vue 3 项目 | 00-init.md |
| 2 | <h> | chore: 清理默认模板… | 00-init.md |
| 3 | <h> | feat(layout): 计算器外框容器组件 | 01-layout-01.md |
| ... | ... | ... | ... |
| 29 | <h> | docs: README 说明 | 04-finalize.md |
```

- [ ] **Step 4: 删除 `.gitkeep` 占位(已有真实文件)**
Run: `git rm docs/ai-chat/.gitkeep`(若目录已有 .md 文件)。

- [ ] **Step 5: 验证 + 提交**
Run `npm run build`(不应受影响);人工抽查 index.md 与若干分文件可逐 commit 反查。
```bash
git add docs/ai-chat/
git commit -m "docs: 归档各阶段完整 AI 对话记录" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Task 29: `docs: README 说明(运行方式 + 阶段对照)`

**Files:** Modify `README.md`

- [ ] **Step 1: 写完整 `README.md`**
```markdown
# Calculator — Windows 11 标准计算器(Vue 3 + Vite)

高保真还原 Windows 11 标准计算器外观与交互。Vue 3 `<script setup>` + Vite,无 TS / 无 UI 库 / 无状态库。

## 运行
```bash
npm install
npm run dev      # 开发预览
npm run build    # 生产构建
```

## 项目结构
- `src/components/`:`Calculator`(状态持有+装配)、`Display`、`ButtonPad`、`Button`
- `src/composables/useCalculator.js`:计算状态机
- `docs/superpowers/specs/`:设计规格
- `docs/ai-chat/`:29 步 AI 对话归档(见 `index.md`)

## 阶段对照(29 个提交)
| 阶段 | 步 | Commit | 说明 |
|---|---|---|---|
| 初始化 | 1 | <h> | Vite 项目 |
| 初始化 | 2 | <h> | 清理+目录骨架 |
| 布局 | 3–10 | <h…> | 组件骨架(无事件无样式) |
| 逻辑 | 11–19 | <h…> | 计算状态机(毛坯无 CSS) |
| 样式 | 20–27 | <h…> | Win11 高保真视觉 |
| 收尾 | 28–29 | <h…> | 归档 + README |

## 还原说明
- 视觉基准:`PROMPT.md` §4(色板/网格/字号/浅深主题)。
- 已知简化(见 spec §6.5):连续 `=`、`%` 二元上下文、一元表达式链。
- 两处认可豁免:步5 内联 grid;步27 主题切换逻辑。
```
(hash 由 `git log` 填入。)

- [ ] **Step 2: 验证 + 提交(最终)**
Run `npm run build`;Run `git log --oneline` 确认 29(+规划)条记录。
```bash
git add README.md
git commit -m "docs: README 说明(运行方式 + 阶段对照)" -m "Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
推送:`git push`(阶段末推送,按既定节奏)。

---

# 自检(写计划后用 spec 复核)

**1. Spec 覆盖:** spec 各节 → 任务映射:
- §3 架构/状态归属 → Task 11(事件链 + Calculator 持状态)
- §4 组件接口 → Task 3–6(结构)、Task 11(事件);Display `-`→`−` → Task 19 Step 4
- §5 按钮布局/每键 {label,variant,type,value} → Task 6–10(结构)+ Task 11–19(type/value);内存行 flex → Task 10
- §6.1 状态字段 → Task 11 起逐步引入
- §6.2 compute/format(含溢出→ERR)→ Task 13(compute/format)、Task 19(一元守卫)
- §6.3 各 action → Task 11(inputDigit)、12(inputDot)、13(chooseOp)、14(equals)、15(clearAll/CE)、16(backspace)、17(negate)、18(percent)、19(reciprocal/square/sqrt);negate 不改 resetNext、percent resetNext、错误态 clearAll 均已显式
- §6.4 dispatch 表 → Task 11–19 逐步补全 switch
- §6.5 已知简化 → 不实现(已在 README/spec 标注)
- §7 错误处理 → compute ERR + setError,覆盖 Task 14/19
- §8 主题切换(豁免)→ Task 27
- §9 视觉规格 → Task 20–27
- §10 验证 → 每步 build + 阶段门 dev(Task 2/10/19/27)+ Task 19 回归清单
- §11 阶段映射/豁免 → 全局约定 + Task 5/27
- §12 决策 → 落实于各任务

**2. 占位符扫描:** 无 TBD/TODO;所有代码块为可直接写入的完整内容(`<h>` 仅出现于归档/README 的 hash 占位,于 Task 28/29 Step 1 由 `git log` 实填 —— 这是执行期数据,非计划占位)。

**3. 类型/命名一致性:** `inputDigit/inputDot/chooseOp/equals/clearAll/clearEntry/backspace/negate/percent/reciprocal/square/sqrt`、props `label/variant/disabled/active`、payload `type/value`、CSS 变量名(`--num-bg` 等)跨任务一致;`activeOp` 在 Calculator→ButtonPad→Button 路径一致;OP_SYMBOL 与 ButtonPad 中 `−` 键 `value:'-'` 一致(spec §6.1)。

**4. 阶段隔离复核:**
- 布局(Task 3–10):无 `@click`、无 `<style>`(仅 ButtonPad 内联 grid,豁免)。✓
- 逻辑(Task 11–19):仅 Task 11 在 Button.vue 加 `@click`(建立事件链);无 `<style>`。✓
- 样式(Task 20–27):仅加 `<style>`/CSS 变量;Task 27 主题逻辑为认可豁免。✓
