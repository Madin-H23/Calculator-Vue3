# 交付后扩展 · 内存功能(步 30–31)

> 原始 29 步清单未含内存功能(PROMPT §四"逻辑阶段可先做禁用占位,不强求完整内存功能",spec §1 原列为非目标)。交付后按用户需求("状态栏中 mc,mr 等按钮没有实现对应功能")追加 2 个提交,实现 MC/MR/M+/M-/MS 单寄存器内存。

## 步 30 · `feat(memory): MC/MR/M+/M-/MS 内存寄存器与运算`

- **指令(用户):** "状态栏中 mc,mr 等按钮没有实现对应功能"。
- **AI 响应摘要:** `useCalculator` 加 `memory`/`hasMemory` ref 与 `memoryStore`/`memoryClear`/`memoryRecall`/`memoryAdd`/`memorySubtract`(error 态守卫;MR 清 error 并 `resetNext=true`);`ButtonPad` memoryButtons 改为对象数组、加 `hasMemory` prop,`MC`/`MR` 在 `!hasMemory` 禁用、`M▾` 始终禁用、`M+`/`M-`/`MS` 启用并透传 `press`;`Calculator` 解构内存 action、dispatch 加 `mc`/`mr`/`mplus`/`mminus`/`ms`、传 `:has-memory`。**验证**:初始 MC/MR/M▾ 禁用;`5 MS`→MC/MR 启用、`MR` 显示 5;`M+3` `M-2` `MR`→6;`MC`→MC/MR 复禁用。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `68c53c8` `feat(memory): MC/MR/M+/M-/MS 内存寄存器与运算`

## 步 31 · `feat(memory): M 内存指示徽标`

- **指令:** 内存功能配套视觉反馈(Win11 在内存已设置时显示 M 指示)。
- **AI 响应摘要:** `Calculator` 标题栏加 `<span v-if="hasMemory" class="mem-badge">M</span>` 与样式(`--accent` 蓝、13px/600)。**验证**:初始无 M;`5 MS`→M 出现;`MC`→M 消失。
- **改动文件:** `src/components/Calculator.vue`
- **Commit:** `3b4c450` `feat(memory): M 内存指示徽标`

## 步 32 · `fix(memory): 内存键启用态保持禁用样式(仅文字变明显)`

- **指令(用户):** "M+,M-,MS,MC,MR 在触发时变亮了变成按钮,要求…和未触发时一样的样式,只是文字变明显"。
- **AI 响应摘要:** 内存键改用独立 `variant="memory"`(不再共用 `function`),新增 `.btn.memory`(始终透明底、13px;启用 `--btn-fg` 明显,禁用 `--memory-fg` 浅灰);移除变为死代码的 `.btn.function:disabled`。
- **改动文件:** `src/components/ButtonPad.vue`、`src/components/Button.vue`
- **Commit:** `269ff9b` `fix(memory): 内存键启用态保持禁用样式(仅文字变明显)`

## 步 33 · `fix(memory): 内存键 hover/active 背景反馈(与数字键一致)`

- **指令(用户):** "在选中时要像选中数字时一样,背景变色"。
- **AI 响应摘要:** `.btn.memory:not(:disabled)` 加 `:hover`(`--num-hover`)/`:active`(`--num-pressed`)背景;静止仍扁平(透明)。
- **改动文件:** `src/components/Button.vue`
- **Commit:** `a4fd9fb` `fix(memory): 内存键 hover/active 背景反馈(与数字键一致)`

## 步 34 · `feat(memory): 内存改为栈模型(MS 压栈/栈顶运算/逐项操作)`

- **指令(用户):** "补 M▾ 浮窗"(前置:为支持内存栈浮窗,先把单寄存器改为栈)。
- **AI 响应摘要:** `memory` 由 `ref(0)` 改为 `ref([])`(栈,`[0]` 为栈顶);`hasMemory` 改 `computed(length>0)`;MS 压栈 / MR 取栈顶 / MC 清栈 / M+·M- 作用于栈顶(空则压入);新增 `memoryClearAt/AddAt/SubtractAt(i)` 逐项操作;并修正 MS/M+/M- 此前漏设 `resetNext=true`(`5 MS 3` 原会拼成 `53`)。
- **改动文件:** `src/composables/useCalculator.js`
- **Commit:** `c486a8b` `feat(memory): 内存改为栈模型(MS 压栈/栈顶运算/逐项操作)`

## 步 35 · `feat(memory): M▾ 浮窗(栈列表 + 逐项 MC/M+/M- + 空态 + 点击外部关闭)`

- **指令(用户):** "补 M▾ 浮窗"。
- **AI 响应摘要:** 新建 `MemoryPanel.vue`(空态 + 栈列表 newest-first + 逐项 MC/M+/M-);`Calculator` 加 `showMemory` ref、`memoryView`(format + `-`→`−`)、dispatch 加 `mtoggle`、半透明 backdrop 点击外部关闭;`ButtonPad` `M▾` 启用且 `type:'mtoggle'`;`useCalculator` 导出 `format`。**验证**:空态文案、`5 MS 3 MS`→`["3","5"]`、逐项 M+/MC、backdrop 关闭均通过。
- **改动文件:** `src/components/MemoryPanel.vue`(新增)、`src/components/Calculator.vue`、`src/components/ButtonPad.vue`、`src/composables/useCalculator.js`
- **Commit:** `de8cb74` `feat(memory): M▾ 浮窗(栈列表 + 逐项 MC/M+/M- + 空态 + 点击外部关闭)`
