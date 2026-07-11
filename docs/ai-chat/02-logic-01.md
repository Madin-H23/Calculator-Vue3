# 阶段 2 逻辑 · 步 11

## `feat(logic): 数字 0-9 输入与显示更新`

- **指令(逐字):** 给数字按钮绑事件:点击数字 → 更新 `current`(处理前导零:`current==='0'` 时替换而非拼接);`expression` 暂不联动或仅显示当前输入。验收:点击数字能正确输入与显示。
- **AI 响应摘要:** 创建 `useCalculator.js`(状态 `current/expression/prevValue/pendingOp/resetNext/error` + `activeOp` computed + `clearAll` + `inputDigit`,前导零替换);`Button.vue` 加 `@click="$emit('press')"`;`ButtonPad.vue` 数字键加 `type/value`、`defineEmits`、透传 `@press`;`Calculator.vue` **解构** composable + `dispatch` + 绑定 Display(props 自动解包)。**验证**:点击 7 8 9 正确显示与拼接。
- **改动文件:** `src/composables/useCalculator.js`(新增)、`src/components/Button.vue`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `71d853f` `feat(logic): 数字 0-9 输入与显示更新`
