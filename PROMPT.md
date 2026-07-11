# Vue 3 计算器项目 — 执行型 Prompt

> 投喂给 AI 的总指令。AI 需严格按本文档的 29 步清单逐步执行,每步独立提交。

## 一、角色与目标

你是一名前端工程师。请使用 **Vue 3 (Composition API) + Vite + JavaScript** 从零搭建一个**高精度还原 Windows 11 标准计算器外观**的网页计算器。参考 Microsoft/calculator 仓库(仅作视觉与互动参考,其为 C++/C# 工程,代码不可直接复用)。

最终交付物:
1. 可运行的 Vue 3 计算器(`npm install && npm run dev` 即用);
2. 一条颗粒度极细、约 29 个提交的 Git 历史,严格按"布局 → 逻辑 → 样式"三阶段推进;
3. `docs/ai-chat/` 下完整归档本项目的全部 AI 对话记录;
4. README 说明运行方式与阶段对照。

## 二、硬性纪律(违反即失败)

1. **单步单提交**:每一步只做清单中规定的一件事,完成 → 自测 → `git add` → `git commit` → 进入下一步。严禁合并多步、严禁跳步。
2. **阶段隔离**:
   - 布局阶段只写结构(组件 + 模板),**不绑定事件、不写 CSS**;
   - 逻辑阶段只写行为(事件 + 计算状态机),**不写 CSS,样式保持毛坯**;
   - 样式阶段只写 CSS/视觉,**不改组件结构、不改计算逻辑**。
3. **Commit 规范**:使用 Conventional Commits,信息必须与清单完全一致(英文 type + 中文简述)。例:`feat(layout): 数字按钮 0-9`。
4. **不越界**:每个提交只触碰该步涉及的文件;不顺手重构无关代码、不改格式化配置。
5. **对话归档**:每完成一步,把"你的指令 + AI 响应摘要 + 本次改动 + commit hash"追加到 `docs/ai-chat/` 对应文件。最后一步统一收尾归档。
6. **自测**:每步提交前必须用 `npm run dev` 在浏览器验证该步的预期表现,确认无误再提交。

## 三、技术栈与目录约定

- 框架:Vue 3 `<script setup>` + Composition API
- 构建:Vite(最新稳定版)
- 语言:JavaScript(ES2020+),不引入 TypeScript、不引入 UI 库、不引入状态管理库(状态用 `reactive`/`ref` 在组件内或轻量 composable 管理)
- 图标:运算符与功能键(⌫、√、¹⁄ₓ、x² 等)使用文字/符号或内联 SVG,**不引入图标库**
- 目录结构:
  ```
  calculator/
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ├── src/
  │   ├── main.js
  │   ├── App.vue
  │   ├── components/
  │   │   ├── Calculator.vue       # 外框容器
  │   │   ├── Display.vue          # 显示区
  │   │   ├── ButtonPad.vue        # 按钮区网格容器
  │   │   └── Button.vue           # 通用按钮(可复用,带 variant 属性)
  │   └── composables/
  │       └── useCalculator.js     # 计算状态机(逻辑阶段集中于此)
  └── docs/
      ├── ai-chat/                 # 对话归档
      └── README.md(项目 README 放根目录,docs 下放补充说明)
  ```

## 四、Windows 11 标准计算器视觉规格(高精度还原基准)

按此规格实现,允许微调以匹配真实观感。

**窗口整体**
- 圆角 8px,带细边框与极轻阴影;固定宽高比,宽度约 360px(可设 min-width)。
- 浅色主题背景:`#F3F3F3`。
- 字体:`'Segoe UI Variable Display','Segoe UI',system-ui,-apple-system,sans-serif`。
- 支持浅色/深色主题切换按钮(右上角或标题栏右侧),深色背景 `#202020`,深色按钮 `#2B2B2B`。

**标题栏**
- 左侧:`≡` 菜单图标占位 + "标准"标签 + `▾` 下拉箭头占位。
- 右侧:主题切换(🌙/☀)占位按钮。
- 这一行用 flex,标签字号偏小、灰色。

**显示区**
- 上行(表达式):右对齐,字号约 16px,颜色 `#616161`(灰);当无表达式时为空。
- 下行(结果/当前输入):右对齐,字号约 42px,字重正常,颜色 `#201F1F`(近黑);默认显示 `0`。
- 数字超长时自动缩小字号或省略,不可撑破容器。
- 显示区与按钮区之间留间距。

**按钮区(4 列 × 6 行 CSS Grid,等宽列、等高行,间隙约 2px)**
顺序(行优先):
```
%       CE      C       ⌫
¹⁄ₓ     x²      √x      ÷
7       8       9       ×
4       5       6       −
1       2       3       +
±       0       .       =
```

**按钮视觉(浅色主题)**
- 功能键行(% CE C ⌫)与高级键(¹⁄ₓ x² √x ±):底色 `#F9F9F9`,hover `#F0F0F0`,pressed `#E6E6E6`,字号约 16px,字重偏大。
- 数字键(0-9 .):底色 `#FBFBFB`,hover `#F3F3F3`,pressed `#EBEBEB`,字号约 22px,字重 600。
- 运算符(÷ × − +):底色 `#FBFBFB`(与数字同),字号约 22px;hover 同数字但反馈更明显;当某运算符被"选中等待中"(用户按了 + 还没按下一个数)时,该按钮高亮(主题强调色描边或底色)。
- `=` 等号:底色为系统强调色(默认蓝 `#0078D4`,hover `#1A86D9`,pressed `#0067C0`),文字白色 `#FFFFFF`。
- 按钮无边框、圆角约 4px、无文字阴影;点击有轻微缩放或底色反馈即可,不做夸张动画。
- 内存按钮行(MC MR M+ M- MS M▾):显示在数字键盘上方、显示区下方一行,**高精度还原时保留此行**(初始禁用态),用小一号字号、浅灰文字、不可点击态。逻辑阶段可先做禁用占位,不强求完整内存功能。

## 五、29 步执行清单

> 每步格式:【步骤号 · commit message】本步唯一要完成的事 + 验收标准。

### 阶段 0 — 初始化(2 步)

1.【`chore: Vite 初始化 Vue 3 项目`】
用 `npm create vite@latest . -- --template vue` 在当前目录初始化(空目录)。确认 `package.json`、`vite.config.js`、`index.html`、`src/main.js`、`src/App.vue` 存在。`npm install` 可装好依赖。验收:`npm run dev` 能看到 Vite 默认页。

2.【`chore: 清理默认模板并建立目录结构与 docs/ai-chat 归档目录`】
清空 `App.vue` 默认样式与无关内容,只留 `<template><div id="app"></div></template>` 与最小 `<script setup>`;删除默认 logo、HelloWorld 等;按"三、目录结构"建空目录占位(可用 `.gitkeep`);建 `docs/ai-chat/`;在根目录建 `README.md` 占位。验收:`npm run dev` 显示空白页无报错。

### 阶段 1 — 布局阶段(8 步,只结构,不事件不样式)

> 本阶段所有按钮无 `@click`,显示区只放静态占位文本,所有组件不写 `<style>`(可用少量内联或保持裸样式仅保证不崩,但**不追求美观**)。

3.【`feat(layout): 计算器外框容器组件`】
新建 `Calculator.vue`,渲染一个根 div(带 class),内部暂为空。在 `App.vue` 引入并挂载。验收:页面出现一个空容器 div,无报错。

4.【`feat(layout): 显示区组件(表达式行 + 结果行占位)`】
新建 `Display.vue`,两行:上行表达式(占位空字符串)、下行结果(占位 `0`)。放入 `Calculator.vue`。验收:显示区出现两行文字。

5.【`feat(layout): 按钮区网格容器`】
新建 `ButtonPad.vue`,根元素为 4 列网格容器(可用 inline style 写 `display:grid` 仅保证排布,但不算"样式阶段"的视觉还原;此处仅保证网格结构存在)。内部暂空。验收:容器存在,无报错。

6.【`feat(layout): 通用按钮组件 Button.vue`】
新建可复用 `Button.vue`,props:`label`(显示文字)、`variant`(`'number'|'operator'|'function'|'equals'`)。模板渲染一个 button,**不绑事件**(本阶段只渲染)。`ButtonPad.vue` 中用它铺出**数字按钮 0-9`(可先不全排,只放 7 8 9 等)。验收:页面上能看到数字按钮。

7.【`feat(layout): 四则运算符按钮 ÷ × − +`】
在 `ButtonPad.vue` 用 `Button` 铺出 ÷ × − +(`variant=operator`)。验收:四个运算符按钮出现在网格。

8.【`feat(layout): 等号与清零按钮 = C CE ⌫`】
铺出 =(`equals`)、C、CE、⌫(`function`)。验收:这些按钮可见。

9.【`feat(layout): 高级功能按钮 % 1/x x² √x ±`】
铺出 %、¹⁄ₓ(显示为 `1/x` 或符号)、x²、√x(`√`)、±。`variant=function`。验收:全部按钮就位。

10.【`feat(layout): 组装各组件到主页面并补齐完整 4×6 网格顺序`】
按"四"中的网格顺序,把所有按钮以正确行列顺序放入 4×6 网格;补齐内存按钮行(MC MR M+ M- MS M▾)作为禁用占位(可用 `disabled` 属性)。验收:页面呈现完整布局骨架(虽无样式),顺序与 Win11 一致。

### 阶段 2 — 逻辑阶段(9 步,只行为不样式)

> 从本阶段起新建 `src/composables/useCalculator.js` 承载状态机,`Calculator.vue` 持有状态并下发给 `Display`/`ButtonPad`。按钮此时仍无 CSS。状态字段建议:`expression`(表达式串)、`current`(当前输入/结果)、`pendingOp`(待执行运算符)、`resetNext`(下次输入是否清当前)。

11.【`feat(logic): 数字 0-9 输入与显示更新`】
给数字按钮绑事件:点击数字 → 更新 `current`(处理前导零:`current==='0'` 时替换而非拼接);`expression` 暂不联动或仅显示当前输入。验收:点击数字能正确输入与显示。

12.【`feat(logic): 小数点输入(防重复)`】
点 `.`:`current` 已含小数点则忽略;否则追加。处理 `5.` 这类合法中间态。验收:不会出现 `5.5.5`。

13.【`feat(logic): 四则运算选择与表达式拼接`】
点 ÷ × − +:把当前数与运算符拼入 `expression`(如 `8 +`),记录 `pendingOp`,置 `resetNext=true`(下次数字输入另起新数)。验收:连续 `8 + 9` 能正确显示表达式,运算符按钮可选高亮(逻辑层标记即可,视觉在样式阶段做)。

14.【`feat(logic): = 等于计算(基础四则)`】
点 =:根据 `pendingOp` 对 `expression` 中的前操作数与 `current` 执行四则,结果显示在 `current` 行,`expression` 显示完整算式。除零按 Win11 行为显示 `不能除以零`。验收:`8 + 9 =` 得 17,`9 ÷ 0 =` 提示除零。

15.【`feat(logic): C 全清 / CE 清当前`】
`C`:清空所有状态回到 `0`;`CE`:仅清当前 `current` 为 `0`,保留表达式。验收:两者行为区分正确。

16.【`feat(logic): Backspace 退格删除`】
`⌫`:删除 `current` 末位,删空归 `0`。验收:可逐位删除。

17.【`feat(logic): ± 正负号切换`】
`±`:`current` 在 `x` 与 `-x` 间切换。验收:`5 → ± → -5 → ± → 5`。

18.【`feat(logic): % 百分比换算`】
%:`current = current / 100`。验收:`50 % → 0.5`。

19.【`feat(logic): 1/x、x²、√x 科学功能键`】
`1/x`:取倒数;`x²`:平方;`√x`:开方。负数开方等非法情形按 Win11 显示 `无效输入`。`expression` 应反映操作(如 `sqr(9)` 或 `9^(2)`,可参考 Win11 表达式风格)。验收:三个键功能正确。

### 阶段 3 — 样式阶段(8 步,只视觉)

> 从本阶段起新增/补全各组件 `<style scoped>`,严禁改组件结构或逻辑。

20.【`style: 整体配色、窗口尺寸、字体基准`】
按"四"设置窗口圆角、背景、字体、尺寸、主题变量(CSS 变量定义浅/深色色板,默认浅色)。验收:整体出现 Win11 窗口观感。

21.【`style: 显示区字号层级与右对齐`】
表达式小灰字、结果大字、右对齐、超长缩小。验收:显示区观感贴近 Win11。

22.【`style: 数字按钮底色与尺寸`】
数字键底色 `#FBFBFB`、字号 ~22px、字重 600、圆角 4px。验收:数字键贴合。

23.【`style: 运算符列按钮样式`】
÷ × − + 底色与数字一致、字号相当;被选中待执行态用强调色描边/底色高亮(逻辑层已有标记,此处只做视觉)。验收:运算符视觉与高亮态正确。

24.【`style: = 等号强调色`】
= 底色强调蓝 `#0078D4`、文字白、hover/pressed 反馈。验收:= 键高亮突出。

25.【`style: 功能键与高级键区分色`】
% CE C ⌫ 与 ¹⁄ₓ x² √x ± 用 `#F9F9F9` 系、字号 ~16px。验收:功能键与数字键区分明显。

26.【`style: hover / active 交互态`】
按色板补全各 variant 的 hover/active(深色主题同步)。验收:鼠标交互反馈贴近 Win11。

27.【`style: 圆角、边框、阴影、内存按钮行收尾细节`】
窗口阴影、边框、内存按钮行小字浅灰(禁用态)、标题栏对齐、整体间距与留白微调。深色主题切换可点击生效。验收:整体与 Win11 标准计算器难辨高下。

### 收尾(2 步)

28.【`docs: 归档各阶段完整 AI 对话记录`】
把全部步骤的对话(指令 + AI 响应摘要 + 改动文件 + commit hash)整理写入 `docs/ai-chat/00-init.md ~ 03-style.md` 与 `index.md`。验收:可逐 commit 反查对话。

29.【`docs: README 说明(运行方式 + 阶段对照)`】
根 `README.md` 写清:项目说明、`npm install && npm run dev`、三阶段提交清单(对应 commit hash)、还原说明。验收:README 完整可读。

## 六、对话归档格式(每步追加)

每个步骤归档文件内容形如:

- **文件名**:`00-init.md`、`01-layout-01.md` ... `01-layout-08.md`、`02-logic-01.md` ... `02-logic-09.md`、`03-style-01.md` ... `03-style-08.md`、`04-finalize.md`,外加 `index.md` 总索引(步骤号 → commit hash → 文件名)。
- **每段内容字段**:给 AI 的指令(逐字)、AI 响应摘要、本次改动文件清单、对应 commit hash 与 message。

## 七、自检清单(全部完成后核对)

- 29 个提交,commit message 与清单逐字一致;
- 阶段 1 不含任何 `@click` 与 `<style>`;
- 阶段 2 仍是毛坯无 CSS,但功能完整可用;
- 阶段 3 后视觉高精度贴近 Win11;
- 浅/深色主题可切换;
- `docs/ai-chat/` 覆盖全部 29 步;
- README 可指导他人运行并理解阶段;
- `npm install && npm run dev` 在干净环境一次跑通。

## 八、给 AI 的总指令(可直接复用)

> 请严格按本文档《五、29 步执行清单》逐步实施。遵守《二、硬性纪律》:单步单提交、阶段隔离、不越界、对话归档。每完成一步:自测 → `git add` → 用清单中**完全一致**的 commit message 提交 → 把对话追加到 `docs/ai-chat/` 对应文件。不得跳步,不得一次提交多步。完成后给出最终提交历史(`git log --oneline`)与运行方式。
