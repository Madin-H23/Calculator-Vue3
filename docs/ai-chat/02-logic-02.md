# 阶段 2 逻辑 · 步 12

## `feat(logic): 小数点输入(防重复)`

- **指令(逐字):** 点 `.`:`current` 已含小数点则忽略;否则追加。处理 `5.` 这类合法中间态。验收:不会出现 `5.5.5`。
- **AI 响应摘要:** `useCalculator` 加 `inputDot`(error/resetNext 时成 `0.`;已含 `.` 则忽略);`ButtonPad` `.` 加 `type:'dot'`;`Calculator` dispatch 加 `dot` 分支。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `e9c6235` `feat(logic): 小数点输入(防重复)`
