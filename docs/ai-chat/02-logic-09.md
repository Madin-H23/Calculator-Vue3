# 阶段 2 逻辑 · 步 19

## `feat(logic): 1/x、x²、√x 科学功能键`

- **指令(逐字):** `1/x`:取倒数;`x²`:平方;`√x`:开方。负数开方等非法情形按 Win11 显示 `无效输入`。`expression` 应反映操作(如 `sqr(9)`)。验收:三个键功能正确。
- **AI 响应摘要:** `useCalculator` 加 `reciprocal`/`square`/`sqrt`(均声明 `v`、守卫非有限→`无效输入`、`resetNext=true`;`expression` 反映 `1/(..)`/`sqr(..)`/`√(..)`);`ButtonPad` 三键加 `type`;`Calculator` dispatch 加三键;`Display.vue` 加 `-`→`−`(U+2212)转换。**验证**:11 项回归全过(见 spec §10)。
- **改动文件:** `src/composables/useCalculator.js`、`src/components/ButtonPad.vue`、`src/components/Calculator.vue`、`src/components/Display.vue`
- **Commit:** `d698910` `feat(logic): 1/x、x²、√x 科学功能键`
