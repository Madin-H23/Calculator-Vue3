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
