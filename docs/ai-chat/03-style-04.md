# 阶段 3 样式 · 步 23

## `style: 运算符列按钮样式`

- **指令(逐字):** ÷ × − + 底色与数字一致、字号相当;被选中待执行态用强调色描边/底色高亮(逻辑层已有标记,此处只做视觉)。验收:运算符视觉与高亮态正确。
- **AI 响应摘要:** `Button.vue` 追加 `.btn.operator`(底色/22px/600/hover/pressed)与 `.btn.operator.active`(`--accent` 蓝底白字高亮,对应逻辑层 `activeOp`)。
- **改动文件:** `src/components/Button.vue`
- **Commit:** `5f3a904` `style: 运算符列按钮样式`
