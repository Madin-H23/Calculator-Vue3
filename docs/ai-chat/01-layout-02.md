# 阶段 1 布局 · 步 4

## `feat(layout): 显示区组件(表达式行 + 结果行占位)`

- **指令(逐字):** 新建 `Display.vue`,两行:上行表达式(占位空字符串)、下行结果(占位 `0`)。放入 `Calculator.vue`。验收:显示区出现两行文字。
- **AI 响应摘要:** 创建 `Display.vue`(props `expression`/`current`;两行 `{{ expression }}`/`{{ current }}`),`Calculator.vue` 放入 `<Display expression="" current="0" />`。
- **改动文件:** `src/components/Display.vue`(新增)、`src/components/Calculator.vue`
- **Commit:** `29fa2ab` `feat(layout): 显示区组件(表达式行 + 结果行占位)`
