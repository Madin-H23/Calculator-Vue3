# 阶段 2 逻辑 · 步 17

## `feat(logic): ± 正负号切换`

- **指令(逐字):** `±`:`current` 在 `x` 与 `-x` 间切换。验收:`5 → ± → -5 → ± → 5`。
- **AI 响应摘要:** `useCalculator` 加 `negate`(翻转前导 `-`;**有意不改 `resetNext`** —— spec 标注);`ButtonPad` ± 加 `type:'negate'`;`Calculator` dispatch 加 `negate`。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `83999f4` `feat(logic): ± 正负号切换`
