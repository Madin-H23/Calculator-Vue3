# 阶段 2 逻辑 · 步 16

## `feat(logic): Backspace 退格删除`

- **指令(逐字):** `⌫`:删除 `current` 末位,删空归 `0`。验收:可逐位删除。
- **AI 响应摘要:** `useCalculator` 加 `backspace`(`error`/`resetNext` 时忽略;否则删末位,空或单 `-` 归 `0`);`ButtonPad` ⌫ 加 `type:'back'`;`Calculator` dispatch 加 `back`。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`
- **Commit:** `f2a4878` `feat(logic): Backspace 退格删除`
