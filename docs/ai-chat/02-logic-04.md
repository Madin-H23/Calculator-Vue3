# 阶段 2 逻辑 · 步 14

## `feat(logic): = 等于计算(基础四则)`

- **指令(逐字):** 点 =:根据 `pendingOp` 对前操作数与 `current` 执行四则,结果显示在 `current` 行,`expression` 显示完整算式。除零按 Win11 行为显示 `不能除以零`。验收:`8 + 9 =` 得 17,`9 ÷ 0 =` 提示除零。
- **AI 响应摘要:** `useCalculator` 加 `equals`(`expression` 补成 `8 + 9 =`;`compute` 返回错误串则 `setError` 并清运算符;否则出结果、`resetNext=true`);`ButtonPad` `=` 加 `type:'equals'`;`Calculator` dispatch 加 `equals`。**验证**:`8+9=17`、`9÷0=不能除以零`。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `985d235` `feat(logic): = 等于计算(基础四则)`
