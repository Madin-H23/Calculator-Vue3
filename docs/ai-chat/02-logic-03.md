# 阶段 2 逻辑 · 步 13

## `feat(logic): 四则运算选择与表达式拼接`

- **指令(逐字):** 点 ÷ × − +:把当前数与运算符拼入 `expression`(如 `8 +`),记录 `pendingOp`,置 `resetNext=true`。验收:连续 `8 + 9` 能正确显示表达式。
- **AI 响应摘要:** 模块顶层加 `OP_SYMBOL`/`compute`(除零→错误串、非有限→`无效输入`)/`format`;composable 内加 `setError`、`chooseOp`(链式运算先算中间结果、`resetNext=true`、`expression` 拼运算符);`ButtonPad` 四运算符加 `type:'op'`+`value`;`Calculator` dispatch 加 `op` 分支。**验证**:`8 + 9` → 表达式 `8 +`、当前 `9`。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `326b20d` `feat(logic): 四则运算选择与表达式拼接`
