# 阶段 2 逻辑 · 步 15

## `feat(logic): C 全清 / CE 清当前`

- **指令(逐字):** `C`:清空所有状态回到 `0`;`CE`:仅清当前 `current` 为 `0`,保留表达式。验收:两者行为区分正确。
- **AI 响应摘要:** `clearAll` 已存在(本步加入返回);新增 `clearEntry`(`current='0'`、清 `resetNext`/`error`,保留表达式/`prevValue`/`pendingOp`);`ButtonPad` C/CE 加 `type`;`Calculator` dispatch 加 `clear`/`ce`。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `4ae6f8e` `feat(logic): C 全清 / CE 清当前`
