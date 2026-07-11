# Windows 11 计算器(Vue 3 + Vite)— 设计规格

> 状态:已纳入用户复核反馈(v1),待用户确认。
> 日期:2026-07-11
> 上游规格:`PROMPT.md`(29 步执行清单,本文件为其设计细化);执行清单:`TODO.md`。
> 本文件经 `superpowers:brainstorming` 产出,后续由 `writing-plans` 转为实施计划。

---

## 1. 目标与非目标

**目标**
- 用 Vue 3(Composition API,`<script setup>`)+ Vite + JavaScript,从零做一个**可用**的网页计算器。
- 视觉/交互**高保真还原 Windows 11 标准计算器**。
- 产出一条**颗粒度极细、29 个提交**的 Git 历史,严格按"布局 → 逻辑 → 样式"三阶段推进,commit message 与 `PROMPT.md` 清单逐字一致。

**非目标(YAGNI)**
- 内存功能:**交付后追加实现**(原仅禁用占位)—— MC/MR/M+/M-/MS 单寄存器,见 §6.6;`M▾` 内存栈浮窗仍为占位。
- 不做科学/程序员/日期模式;仅标准模式。
- 不做键盘快捷键(仅鼠标点击)。
- 不引入 TypeScript、UI 库、状态管理库、图标库、测试框架。
- 不做历史记录侧栏、不做单位转换。
- 已知行为简化见 **6.5 节**(连续等号、`%` 二元上下文、一元表达式链)。

---

## 2. 技术栈与约束

| 项 | 选型 |
|---|---|
| 框架 | Vue 3 `<script setup>` + Composition API |
| 构建 | Vite(最新稳定版) |
| 语言 | JavaScript(ES2020+),无 TS |
| 状态 | 组件内 `reactive`/`ref` + 轻量 composable,无外部状态库 |
| 图标 | 文字/符号/内联 SVG,无图标库 |
| 验证 | `npm run build` 逐提交;阶段门浏览器冒烟;**无测试框架** |

硬性纪律(违反即失败,详见 `PROMPT.md` 第二节):单步单提交、阶段隔离、commit 规范、不越界、对话归档、自测。

---

## 3. 架构与状态归属

- `App.vue` 仅渲染 `<Calculator/>`。
- **`Calculator.vue` 是唯一计算状态持有者**:调用 `useCalculator()` 获得响应式状态与 actions,并下发给子组件。
- **单向数据流**:`props` 下发,`emit` 上抛。
- **主题**是视图关注点:`Calculator.vue` 持独立 `theme = ref('light')`,**不进** `useCalculator`。

```
App.vue
  └─ Calculator.vue            持有 useCalculator() + theme
       ├─ <TitleBar/> (内联于 Calculator:菜单占位 + "标准" + 主题切换按钮)
       ├─ <Display :expression :current />
       └─ <ButtonPad :active-op @press="dispatch" />
             └─ <Button v-for ... :label :variant :disabled :active @press />
```

按钮点击链路:`Button` `emit('press', payload)` → `ButtonPad` 透传 `emit('press', payload)` → `Calculator` `dispatch(payload)` → 调用 `useCalculator` 对应 action → 状态更新 → props 下传 → 重渲染。

---

## 4. 组件接口

| 组件 | props | emits | 职责 |
|---|---|---|---|
| `Display.vue` | `expression: string`、`current: string` | — | 两行右对齐显示;超长缩小(样式阶段处理);**结果行显示前将 ASCII `-` 转为 `−`(U+2212)** 以贴近 Win11(内部 `current` 仍用 ASCII `-` 便于 `parseFloat`) |
| `ButtonPad.vue` | `activeOp: string\|null` | `press(payload)` | 渲染内存行(独立 flex)+ 主区 4×6 网格;把 Button 的 `press` 透传 |
| `Button.vue` | `label: string`、`variant`、`disabled: boolean`、`active: boolean` | `press(payload)` | 通用按钮;按 `variant` 决定样式,`active` 控制运算符高亮 |

`variant ∈ 'number' | 'operator' | 'function' | 'equals'`。

**press payload** 统一形态:
```js
{ type: 'digit'|'dot'|'op'|'equals'|'clear'|'ce'|'back'|'negate'|'percent'|'reciprocal'|'square'|'sqrt', value?: string }
```

---

## 5. 按钮区布局(与 Win11 一致)

**ButtonPad 结构(两区分离):**
- **内存行**:独立 `display:flex` 容器,置于显示区与按键区之间,6 个按钮等宽、全部 `disabled`(MC MR M+ M- MS M▾)。
- **主按键区**:`display:grid`、**4 列 × 6 行**。内存行不占主网格列,避免 6 按钮 vs 4 列冲突。

主区按行优先渲染:
```
%       CE      C       ⌫
¹⁄ₓ     x²      √x      ÷
7       8       9       ×
4       5       6       −
1       2       3       +
±       0       .       =
```

每键的 `{label, variant, type, value}`:
- 行1:`%`(function, percent) `CE`(function, ce) `C`(function, clear) `⌫`(function, back)
- 行2:`1/x`(function, reciprocal) `x²`(function, square) `√x`(function, sqrt) `÷`(operator, op=`÷`)
- 行3:`7 8 9`(number, digit) `×`(operator, op=`×`)
- 行4:`4 5 6`(number, digit) `−`(operator, op=`-`,显示 `−`)
- 行5:`1 2 3`(number, digit) `+`(operator, op=`+`)
- 行6:`±`(function, negate) `0`(number, digit) `.`(number, dot) `=`(equals)

> `reciprocal` 按钮标签布局阶段用 `1/x`(PROMPT 允许"1/x 或符号");样式阶段可精修为 `⅟ₓ`。

---

## 6. 计算状态机(`src/composables/useCalculator.js`)

### 6.1 状态字段(全部 `ref`)

| 字段 | 类型 | 初值 | 含义 |
|---|---|---|---|
| `current` | string | `"0"` | 当前输入/结果(结果行) |
| `expression` | string | `""` | 表达式行 |
| `prevValue` | number\|null | `null` | 左操作数 |
| `pendingOp` | string\|null | `null` | 待执行运算符 `+ - × ÷` |
| `resetNext` | boolean | `false` | 下次数字输入是否替换 current |
| `error` | boolean | `false` | 是否处于错误态 |
| `activeOp` | computed | — | `= error ? null : pendingOp`,供运算符高亮 |

运算符显示符号:`OP_SYMBOL = { '+':'+', '-':'−', '×':'×', '÷':'÷' }`(`expression` 用此映射;`pendingOp` 内部仍存 ASCII `+ - × ÷`,不统一但不影响功能,已记)。

### 6.2 辅助函数

- **`compute(a, b, op)`**:执行 `+ - × ÷`。
  - `÷` 且 `b===0` → 返回错误串 `'不能除以零'`。
  - 结果非有限(`Infinity`/`NaN`,如大数连乘溢出)→ 返回错误串 `'无效输入'`。
  - 否则返回数值。
  - **约定**:返回值为 `string` 即错误(消息),为 `number` 即成功;调用方以 `typeof r === 'string'` 判错。
- **`format(n)`**:非有限 → `'无效输入'`;否则 `Number(n.toPrecision(15)).toString()` 抑制浮点噪声并去尾零。

### 6.3 各 action 精确语义

- **`inputDigit(d)`**
  - `error` → 先 `clearAll()`(等价全量重置:`current='0'`、`expression=''`、`prevValue=null`、`pendingOp=null`、`resetNext=false`、`error=false`)再 `current = d`。
  - `resetNext` → `current = d; resetNext = false`。
  - 否则:`current = (current === '0') ? d : current + d`(防前导零;`'0.' + d` 正常拼接)。

- **`inputDot()`**
  - `error` → 先 `clearAll()` 再 `current = '0.'`。
  - `resetNext` → `current = '0.'; resetNext = false`。
  - 已含 `.` → 忽略。
  - 否则:`current += '.'`。

- **`chooseOp(op)`**
  - `error` → 忽略(须先 `C`)。
  - 若 `pendingOp && !resetNext && prevValue != null`:先算中间结果 `r = compute(prevValue, parseFloat(current), pendingOp)`;`typeof r === 'string'` → `setError(r)` 并返回;否则用 `r` 作为新左值并刷新 `current = format(r)`。
  - `prevValue = <当前值>`;`pendingOp = op`;`expression = format(prevValue) + ' ' + OP_SYMBOL[op]`;`resetNext = true`。

- **`equals()`**
  - `error` 或无 `pendingOp`/`prevValue` → 忽略。
  - `val = parseFloat(current)`;`r = compute(prevValue, val, pendingOp)`。
  - `expression = format(prevValue) + ' ' + OP_SYMBOL[pendingOp] + ' ' + format(val) + ' ='`。
  - `typeof r === 'string'` → `setError(r)`(消息来自 compute);`pendingOp = null; resetNext = true`;返回。
  - 否则:`current = format(r); pendingOp = null; prevValue = null; resetNext = true`。

- **`clearAll()`(C)**:全部回初值(`current='0'`、`expression=''`、`prevValue=null`、`pendingOp=null`、`resetNext=false`、`error=false`)。
- **`clearEntry()`(CE)**:`current='0'; resetNext=false; error=false`(保留 `expression`/`prevValue`/`pendingOp`)。
- **`backspace()`(⌫)**:`error` 或 `resetNext` → 忽略;否则 `current = current.length>1 ? current.slice(0,-1) : '0'`(结果为单 `'-'` 时归 `'0'`)。
- **`negate()`(±)**:`error` 或 `current==='0'` → 忽略;否则翻转前导 `-`;**有意不改 `resetNext`**(运算符后按 ± 只改当前显示,下次数字仍按 `resetNext` 替换 —— Win11 同此)。
- **`percent()`(%)**:`error` → 忽略;`current = format(parseFloat(current)/100)`;`resetNext = true`(与其他一元键一致,完成后下次数字另起新数)。
- **`reciprocal()`(1/x)**:`error` → 忽略;`v = parseFloat(current)`;`v===0` → `setError('不能除以零')`;否则 `r = 1/v`;`!isFinite(r)` → `setError('无效输入')`;否则 `expression='1/('+current+')'`、`current=format(r)`、`resetNext=true`。
- **`square()`(x²)**:`error` → 忽略;`v = parseFloat(current)`;`r = v*v`;`!isFinite(r)` → `setError('无效输入')`;否则 `expression='sqr('+current+')'`、`current=format(r)`、`resetNext=true`。
- **`sqrt()`(√x)**:`error` → 忽略;`v = parseFloat(current)`;`v<0` → `setError('无效输入')`;否则 `r = Math.sqrt(v)`;`!isFinite(r)` → `setError('无效输入')`;否则 `expression='√('+current+')'`、`current=format(r)`、`resetNext=true`。

`setError(msg)`:`current = msg; error = true`(保留 `expression` 以提供上下文,与 Win11 一致)。

### 6.4 dispatch 表(Calculator 内)

| payload.type | 调用 |
|---|---|
| `digit` | `inputDigit(payload.value)` |
| `dot` | `inputDot()` |
| `op` | `chooseOp(payload.value)` |
| `equals` | `equals()` |
| `clear` | `clearAll()` |
| `ce` | `clearEntry()` |
| `back` | `backspace()` |
| `negate` | `negate()` |
| `percent` | `percent()` |
| `reciprocal` | `reciprocal()` |
| `square` | `square()` |
| `sqrt` | `sqrt()` |

### 6.5 已知简化(已认可的范围边界,均不在 PROMPT 验收内)

| 项 | Win11 行为 | 本实现 | 备注 |
|---|---|---|---|
| 连续 `=` | `5 + 3 = = =` → 8,11,14(重复 +3) | 第二次 `=` 被忽略(不存 `lastOp`/`lastOperand`) | 需额外状态;验收未覆盖 |
| `%` 二元上下文 | `200 + 10 % =` → 220(`%`=左值×右值/100) | `%` 恒为 `current/100`,故得 200.1 | 规则随运算符变化,复杂;验收仅测独立 `50 % → 0.5` |
| 一元覆写 `expression` | `5 + 1/x =` 保留链 `5 + 1/(5) =` | `expression` 被一元覆写为 `1/(5)` | 结果正确;验收仅要求"expression 反映操作",已满足 |

> 以上三项为**纯保真增强**,非 bug;为控范围与逻辑阶段风险,列为已知简化。robustness 类问题(溢出/除零/负数开方 → error 态)已在 6.2/6.3 修齐。

### 6.6 内存功能(交付后扩展)

> 原 §1 列为非目标(禁用占位);交付后按用户需求分阶段追加(归档 `docs/ai-chat/05-memory.md`):① 单寄存器内存 → ② 内存键样式(扁平 + hover)→ ③ **栈模型 + M▾ 浮窗**(对齐 Win11 内存栈)。

**状态**:`memory = ref([])`(栈,`memory[0]` 为栈顶/最新);`hasMemory = computed(memory.length > 0)`;`showMemory = ref(false)`(浮窗开关,Calculator 持有)。

| action | 行为 |
|---|---|
| `memoryStore`(MS) | `error` 忽略;`memory = [current, ...memory]`(压栈,最新在前);`resetNext=true` |
| `memoryClear`(MC) | `memory = []` |
| `memoryRecall`(MR) | 栈空忽略;`error=false`;`current = format(memory[0])`;`resetNext=true` |
| `memoryAdd`(M+) | `error` 忽略;栈空压入 current,否则 `memory[0] += current`;`resetNext=true` |
| `memorySubtract`(M-) | `error` 忽略;栈空压入 `-current`,否则 `memory[0] -= current`;`resetNext=true` |
| `memoryClearAt(i)` | 删除第 i 项 |
| `memoryAddAt(i)` | `memory[i] += current` |
| `memorySubtractAt(i)` | `memory[i] -= current` |

**键启用态**:`MC`/`MR` 在 `!hasMemory` 时禁用;`M+`/`M-`/`MS`/`M▾` 始终启用。`hasMemory` 时标题栏显示 `M` 徽标(`--accent`)。内存键视觉(`variant=memory`)与禁用态一致(透明底、13px),仅文字明暗区分 + hover/active 背景反馈。

**M▾ 浮窗**(`MemoryPanel.vue`):点击 `M▾` 切换 `showMemory`。栈空显示"内存中暂无内容";否则列出栈项(最新在前),每项含 `MC`/`M+`/`M-`(逐项操作,带索引)。半透明 backdrop 覆盖计算器,点击外部关闭;`memoryView` 经 `format` + `-`→`−` 转换。

---

## 7. 错误处理(对齐 Win11)

| 情形 | 结果行 | `error` |
|---|---|---|
| `÷ 0`(等于时) | `不能除以零` | true |
| `1/x` 于 0 | `不能除以零` | true |
| `√x` 于负数 | `无效输入` | true |
| 结果溢出/非有限(`×` 连乘、`x²` 等) | `无效输入` | true |

错误态下:数字键/`.` → `clearAll()` 后开始新输入;运算符/`=`/科学键 → 忽略;`C` → 全清;`CE` → 清当前并清错;`⌫` → 忽略。

---

## 8. 主题切换(已认可的样式阶段例外)

- `Calculator.vue`:`theme = ref('light')`;标题栏右侧切换按钮 toggle `'light' | 'dark'`。
- 根容器 `:class="{ dark: theme === 'dark' }"`;`:root`/容器级 CSS 变量在浅/深色下取不同色板。
- **此为"样式阶段不写逻辑"纪律的唯一明示例外**,在步27 实现。不进 `useCalculator`。

---

## 9. 视觉规格(基准)

唯一基准为 `PROMPT.md` 第四节(色板、网格、字号、按钮 variant 视觉、浅/深主题)。本设计不再重复色值,实现时以该节为准。样式阶段(步20–27)逐 variant 落地。

---

## 10. 验证策略

- **逐提交**:`npm run build`(非交互、可靠)确认编译通过;`npm run dev` 仅在阶段门使用。
- **阶段门浏览器冒烟**:布局末、逻辑末、样式末各跑 `npm run dev`。
- **逻辑末回归**(对照 `PROMPT.md` 验收):
  - `8 + 9 = 17`;`9 ÷ 0 =` → `不能除以零`;
  - `5 → ± → -5 → ± → 5`;`50 % → 0.5`;
  - `9 → 1/x → 0.111…`;`3 → x² → 9`;`9 → √x → 3`;负数 `√x` → `无效输入`;
  - `C` 全清、`CE` 仅清当前、`⌫` 逐位删除;`5.` 合法;不会 `5.5.5`;
  - 溢出守卫:大数连乘多次后进入 `无效输入` error 态(非崩溃)。
- **不引入测试框架**(会破坏"29 步 message 逐字一致"自检)。

---

## 11. 阶段 → 提交映射

严格按 `PROMPT.md`/`TODO.md` 的 29 步,1 步 1 提交,message **subject** 逐字一致;每个提交 body 末尾加尾注 `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`(已确认:`--oneline`/`%s` 比对不受影响)。两处**已认可的纪律豁免**:
1. **步5**:内联 `display:grid` 保证网格结构(`PROMPT.md` 已明示豁免)。
2. **步27**:主题切换逻辑就地加入(本次头脑风暴认可,见第 8 节)。

对话归档:每步把"指令 + AI 响应摘要 + 改动文件 + commit hash"写入 `docs/ai-chat/`(步28 统一收尾 + `index.md`)。

---

## 12. 决策记录(ADR 摘要)

| 决策 | 选择 | 理由 |
|---|---|---|
| 状态/事件架构 | Calculator 持有 + props 下发 + emit 上抛 | 单向数据流,边界清晰,符合 `PROMPT.md` 建议 |
| 主题切换位置 | 步27 就地加(认可例外) | 贴合 29 步划分,不破坏 message 逐字一致 |
| 测试 | 不引入框架 | 严守 29 步范围;手动浏览器回归即可 |
| 减号符号 | 内部 ASCII `-`,显示 `−`(U+2212) | `parseFloat` 友好 + 贴近 Win11 观感;转换在 `Display.vue` |
| 溢出/非有限 → error | 实现(compute + 一元键守卫) | correctness:防 `parseFloat('无效输入')=NaN` 崩溃;与除零同走 `setError` |
| 连续 `=` / `%` 上下文 / 一元表达式链 | 已知简化(见 6.5) | 验收未覆盖;纯保真增强,控范围与风险 |
| 内存行布局 | 独立 flex 行 + 主区 4 列 Grid | 避免 6 按钮 vs 4 列冲突;两区职责清晰 |
| 提交尾注 | 加 `Co-Authored-By`,subject 逐字 | 已与用户确认 |

---

## 13. 目录结构(目标)

```
calculator/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── PROMPT.md
├── TODO.md
├── docs/
│   ├── superpowers/specs/2026-07-11-calculator-design.md   ← 本文件
│   ├── ai-chat/                                            ← 步28 归档
│   └── README.md
└── src/
    ├── main.js
    ├── App.vue
    ├── components/{Calculator,Display,ButtonPad,Button}.vue
    └── composables/useCalculator.js
```
