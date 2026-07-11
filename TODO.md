# 计算器项目执行 TODO 清单(待审查)

> 本文档依据 `PROMPT.md`《五、29 步执行清单》拆解而成,是给 AI 的施工计划。
> **当前状态:待人工审查。审查通过后,AI 将严格"单步单提交"逐项执行,不得跳步、不得合并。**
>
> 每步执行流程:唯一任务 → 自测(`npm run build` / `npm run dev`) → `git add` → 用**完全一致**的 commit message 提交 → 追加对话到 `docs/ai-chat/`。

---

## 一、总览

| 项 | 内容 |
|---|---|
| 技术栈 | Vue 3 `<script setup>` + Composition API + Vite + JavaScript(无 TS / 无 UI 库 / 无状态库) |
| 目标 | 高保真还原 Windows 11 标准计算器外观与交互 |
| 提交总数 | **29 个**,颗粒度尽量小,commit message 与下表逐字一致 |
| 三阶段 | 阶段0 初始化(2) → 阶段1 布局(8) → 阶段2 逻辑(9) → 阶段3 样式(8) → 收尾(2) |
| 考核重点 | 调度 AI 拆分需求、提交颗粒度尽可能小、阶段隔离 |

---

## 二、硬性纪律(违反即失败,执行前再次确认)

1. **单步单提交**:每一步只做清单中规定的一件事,完成后立即提交。严禁合并多步、严禁跳步。
2. **阶段隔离**:
   - 布局阶段(步 3–10):只写结构(组件 + 模板),**不绑 `@click`、不写 `<style>`**。
   - 逻辑阶段(步 11–19):只写行为(事件 + 计算状态机),**不写 CSS,样式保持毛坯**。
   - 样式阶段(步 20–27):只写 CSS/视觉,**不改组件结构、不改计算逻辑**。
3. **Commit 规范**:Conventional Commits,英文 type + 中文简述,与下表**逐字一致**。
4. **不越界**:每个提交只触碰该步涉及的文件;不顺手重构无关代码、不改格式化配置。
5. **对话归档**:每步把"指令 + AI 响应摘要 + 改动文件 + commit hash"追加到 `docs/ai-chat/` 对应文件。
6. **自测**:每步提交前必须验证该步预期表现,确认无误再提交。

---

## 三、目标目录结构

```
calculator/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── PROMPT.md
├── TODO.md                 ← 本文件
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   │   ├── Calculator.vue   # 外框容器
│   │   ├── Display.vue      # 显示区
│   │   ├── ButtonPad.vue    # 按钮区网格容器
│   │   └── Button.vue       # 通用按钮(可复用,带 variant)
│   └── composables/
│       └── useCalculator.js # 计算状态机(逻辑阶段集中于此)
└── docs/
    ├── ai-chat/             # 对话归档
    └── README.md            # 补充说明
```

---

## 四、29 步执行清单

> 说明:每步格式 —— **【步骤号】commit message** / 唯一任务 / 涉及文件 / 验收标准。
> 复选框 `[ ]` 用于执行时勾选跟踪进度。

### 阶段 0 — 初始化(2 步)

- [ ] **1. `chore: Vite 初始化 Vue 3 项目`**
  - 任务:用 `npm create vite@latest . -- --template vue` 初始化,`npm install` 装好依赖。
  - 涉及文件:`package.json`、`vite.config.js`、`index.html`、`src/main.js`、`src/App.vue`(及默认模板附带文件)。
  - 验收:`npm run dev` 能看到 Vite 默认页。

- [ ] **2. `chore: 清理默认模板并建立目录结构与 docs/ai-chat 归档目录`**
  - 任务:清空 `App.vue` 默认样式/无关内容,只留 `<div id="app">` 与最小 `<script setup>`;删 HelloWorld/logo;建空目录占位 `.gitkeep`;建 `docs/ai-chat/`;根目录建 `README.md` 占位。
  - 涉及文件:`App.vue`、删除 `components/HelloWorld.vue`、`assets/`、`public/` 默认资源、新增 `src/components/`、`src/composables/`、`docs/ai-chat/` 占位、根 `README.md`。
  - 验收:`npm run dev` 显示空白页无报错。

### 阶段 1 — 布局阶段(8 步 · 只结构,不事件不样式)

> 本阶段所有按钮**无 `@click`**,显示区只放静态占位文本,组件**不写 `<style>`**(ButtonPad 的 grid 排布用内联 `display:grid` 保证不崩,不追求美观)。

- [ ] **3. `feat(layout): 计算器外框容器组件`**
  - 任务:新建 `Calculator.vue`(根 div 带 class,内部暂空),在 `App.vue` 引入挂载。
  - 涉及文件:`src/components/Calculator.vue`、`src/App.vue`。
  - 验收:页面出现一个空容器 div,无报错。

- [ ] **4. `feat(layout): 显示区组件(表达式行 + 结果行占位)`**
  - 任务:新建 `Display.vue`,两行:上行表达式(占位空串)、下行结果(占位 `0`),放入 `Calculator.vue`。
  - 涉及文件:`src/components/Display.vue`、`src/components/Calculator.vue`。
  - 验收:显示区出现两行文字。

- [ ] **5. `feat(layout): 按钮区网格容器`**
  - 任务:新建 `ButtonPad.vue`,根元素为 4 列网格容器(内联 `display:grid`),内部暂空。
  - 涉及文件:`src/components/ButtonPad.vue`、`src/components/Calculator.vue`。
  - 验收:容器存在,无报错。

- [ ] **6. `feat(layout): 通用按钮组件 Button.vue`**
  - 任务:新建可复用 `Button.vue`,props `label`、`variant`(`number|operator|function|equals`),模板渲染 button,**不绑事件**;`ButtonPad.vue` 用它铺出数字按钮(先放 7 8 9 等)。
  - 涉及文件:`src/components/Button.vue`、`src/components/ButtonPad.vue`。
  - 验收:页面能看到数字按钮。

- [ ] **7. `feat(layout): 四则运算符按钮 ÷ × − +`**
  - 任务:`ButtonPad.vue` 用 `Button` 铺出 ÷ × − +(`variant=operator`)。
  - 涉及文件:`src/components/ButtonPad.vue`。
  - 验收:四个运算符按钮出现在网格。

- [ ] **8. `feat(layout): 等号与清零按钮 = C CE ⌫`**
  - 任务:铺出 =(`equals`)、C、CE、⌫(`function`)。
  - 涉及文件:`src/components/ButtonPad.vue`。
  - 验收:这些按钮可见。

- [ ] **9. `feat(layout): 高级功能按钮 % 1/x x² √x ±`**
  - 任务:铺出 %、¹⁄ₓ(显示 `1/x` 或符号)、x²、√x(`√`)、±,`variant=function`。
  - 涉及文件:`src/components/ButtonPad.vue`。
  - 验收:全部按钮就位。

- [ ] **10. `feat(layout): 组装各组件到主页面并补齐完整 4×6 网格顺序`**
  - 任务:按网格顺序(行优先)把所有按钮以正确行列放入 4×6 网格;补齐内存按钮行(MC MR M+ M- MS M▾)作为 `disabled` 占位。
  - 涉及文件:`src/components/ButtonPad.vue`(及 `Calculator.vue` 装配)。
  - 网格顺序:
    ```
    %       CE      C       ⌫
    ¹⁄ₓ     x²      √x      ÷
    7       8       9       ×
    4       5       6       −
    1       2       3       +
    ±       0       .       =
    ```
  - 验收:页面呈现完整布局骨架(虽无样式),顺序与 Win11 一致。

### 阶段 2 — 逻辑阶段(9 步 · 只行为,不写 CSS)

> 新建 `src/composables/useCalculator.js` 承载状态机;`Calculator.vue` 持有状态并下发给 `Display`/`ButtonPad`。状态字段:`expression`、`current`、`pendingOp`、`resetNext`。按钮仍无 CSS。

- [ ] **11. `feat(logic): 数字 0-9 输入与显示更新`**
  - 任务:数字按钮绑事件,点击 → 更新 `current`(`current==='0'` 时替换而非拼接)。
  - 涉及文件:`useCalculator.js`、`Calculator.vue`、`ButtonPad.vue`、`Button.vue`(绑 emit)。
  - 验收:点击数字能正确输入与显示。

- [ ] **12. `feat(logic): 小数点输入(防重复)`**
  - 任务:点 `.`:`current` 已含小数点则忽略,否则追加;处理 `5.` 合法中间态。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:不会出现 `5.5.5`。

- [ ] **13. `feat(logic): 四则运算选择与表达式拼接`**
  - 任务:点 ÷ × − +:把当前数与运算符拼入 `expression`(如 `8 +`),记录 `pendingOp`,`resetNext=true`;运算符选中态逻辑标记。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:连续 `8 + 9` 能正确显示表达式。

- [ ] **14. `feat(logic): = 等于计算(基础四则)`**
  - 任务:点 =:按 `pendingOp` 计算,结果显示在 `current` 行,`expression` 显示完整算式;除零显示 `不能除以零`。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:`8 + 9 =` 得 17,`9 ÷ 0 =` 提示除零。

- [ ] **15. `feat(logic): C 全清 / CE 清当前`**
  - 任务:`C` 清空所有状态回 `0`;`CE` 仅清 `current` 为 `0`,保留表达式。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:两者行为区分正确。

- [ ] **16. `feat(logic): Backspace 退格删除`**
  - 任务:`⌫` 删除 `current` 末位,删空归 `0`。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:可逐位删除。

- [ ] **17. `feat(logic): ± 正负号切换`**
  - 任务:`±`:`current` 在 `x` 与 `-x` 间切换。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:`5 → ± → -5 → ± → 5`。

- [ ] **18. `feat(logic): % 百分比换算`**
  - 任务:`%`:`current = current / 100`。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:`50 % → 0.5`。

- [ ] **19. `feat(logic): 1/x、x²、√x 科学功能键`**
  - 任务:`1/x` 取倒数、`x²` 平方、`√x` 开方;非法情形(负数开方)显示 `无效输入`;`expression` 反映操作。
  - 涉及文件:`useCalculator.js`、`ButtonPad.vue`。
  - 验收:三个键功能正确。

### 阶段 3 — 样式阶段(8 步 · 只视觉,不改结构/逻辑)

> 新增/补全各组件 `<style scoped>`(及 CSS 变量),严禁改组件结构或计算逻辑。

- [ ] **20. `style: 整体配色、窗口尺寸、字体基准`**
  - 任务:窗口圆角 8px、浅色背景 `#F3F3F3`、字体 Segoe UI、宽度约 360px、定义浅/深色主题 CSS 变量(默认浅色)。
  - 涉及文件:`Calculator.vue` `<style>`、(可加全局 `style.css`)。
  - 验收:整体出现 Win11 窗口观感。

- [ ] **21. `style: 显示区字号层级与右对齐`**
  - 任务:表达式小灰字(`#616161`、~16px)、结果大字(`#201F1F`、~42px)、右对齐、超长缩小。
  - 涉及文件:`Display.vue` `<style>`。
  - 验收:显示区观感贴近 Win11。

- [ ] **22. `style: 数字按钮底色与尺寸`**
  - 任务:数字键底色 `#FBFBFB`、hover `#F3F3F3`、pressed `#EBEBEB`、字号 ~22px、字重 600、圆角 4px。
  - 涉及文件:`Button.vue` `<style>`。
  - 验收:数字键贴合。

- [ ] **23. `style: 运算符列按钮样式`**
  - 任务:÷ × − + 底色与数字一致、字号相当;被选中待执行态用强调色描边/底色高亮(逻辑层已标记)。
  - 涉及文件:`Button.vue` `<style>`(operator variant)。
  - 验收:运算符视觉与高亮态正确。

- [ ] **24. `style: = 等号强调色`**
  - 任务:= 底色强调蓝 `#0078D4`、文字白、hover `#1A86D9`、pressed `#0067C0`。
  - 涉及文件:`Button.vue` `<style>`(equals variant)。
  - 验收:= 键高亮突出。

- [ ] **25. `style: 功能键与高级键区分色`**
  - 任务:% CE C ⌫ 与 ¹⁄ₓ x² √x ± 用 `#F9F9F9` 系、hover `#F0F0F0`、pressed `#E6E6E6`、字号 ~16px。
  - 涉及文件:`Button.vue` `<style>`(function variant)。
  - 验收:功能键与数字键区分明显。

- [ ] **26. `style: hover / active 交互态`**
  - 任务:按色板补全各 variant 的 hover/active,深色主题同步。
  - 涉及文件:`Button.vue`/`Calculator.vue` `<style>`。
  - 验收:鼠标交互反馈贴近 Win11。

- [ ] **27. `style: 圆角、边框、阴影、内存按钮行收尾细节`**
  - 任务:窗口阴影/边框、内存按钮行小字浅灰(禁用态)、标题栏对齐、整体间距留白微调、深色主题切换可点击生效(主题切换按钮连通逻辑)。
  - 涉及文件:`Calculator.vue`、`ButtonPad.vue`、`Button.vue` `<style>`(及标题栏/内存行)。
  - 验收:整体与 Win11 标准计算器难辨高下;浅/深主题可切换。

### 收尾(2 步)

- [ ] **28. `docs: 归档各阶段完整 AI 对话记录`**
  - 任务:把全部步骤的对话(指令 + AI 响应摘要 + 改动文件 + commit hash)整理写入 `docs/ai-chat/`。
  - 涉及文件:`docs/ai-chat/00-init.md`、`01-layout-01..08.md`、`02-logic-01..09.md`、`03-style-01..08.md`、`04-finalize.md`、`index.md`。
  - 验收:可逐 commit 反查对话。

- [ ] **29. `docs: README 说明(运行方式 + 阶段对照)`**
  - 任务:根 `README.md` 写清项目说明、`npm install && npm run dev`、三阶段提交清单(对应 commit hash)、还原说明。
  - 涉及文件:`README.md`。
  - 验收:README 完整可读。

---

## 五、对话归档文件清单(步 28 产出)

```
docs/ai-chat/
├── index.md                  # 步骤号 → commit hash → 文件名 总索引
├── 00-init.md                # 步 1–2
├── 01-layout-01.md … 01-layout-08.md   # 步 3–10
├── 02-logic-01.md … 02-logic-09.md     # 步 11–19
├── 03-style-01.md … 03-style-08.md     # 步 20–27
└── 04-finalize.md            # 步 28–29
```
每段字段:给 AI 的指令(逐字)、AI 响应摘要、本次改动文件清单、commit hash 与 message。

---

## 六、完工自检清单

- [ ] 29 个提交,commit message 与本清单逐字一致;
- [ ] 阶段 1 不含任何 `@click` 与 `<style>`;
- [ ] 阶段 2 仍是毛坯无 CSS,但功能完整可用;
- [ ] 阶段 3 后视觉高精度贴近 Win11;
- [ ] 浅/深色主题可切换;
- [ ] `docs/ai-chat/` 覆盖全部 29 步;
- [ ] README 可指导他人运行并理解阶段;
- [ ] `npm install && npm run dev` 在干净环境一次跑通。

---

## 七、审查请求

请审查以下要点,确认后我将从**步 1** 开始逐步执行:

1. 29 步的拆分颗粒度是否满足"尽可能小"的考核要求?是否需要再拆分某些步骤?
2. 每步 commit message 是否可直接采用?
3. 阶段隔离边界是否清晰(尤其 步5 内联 grid、步27 主题切换连逻辑这两处"灰色地带")?
4. 目录结构、归档文件命名是否符合预期?

> 审查通过后,我将在每个提交后回填本清单对应复选框,并在 `docs/ai-chat/` 同步归档。
