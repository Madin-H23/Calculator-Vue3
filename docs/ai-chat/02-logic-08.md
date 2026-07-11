# 阶段 2 逻辑 · 步 18

## `feat(logic): % 百分比换算`

- **指令(逐字):** `%`:`current = current / 100`。验收:`50 % → 0.5`。
- **AI 响应摘要:** `useCalculator` 加 `percent`(`current=format(v/100)`;`resetNext=true` —— 与其他一元键一致,修正了 spec 复核指出的遗漏);`ButtonPad` % 加 `type:'percent'`;`Calculator` dispatch 加 `percent`。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `d6d2374` `feat(logic): % 百分比换算`
