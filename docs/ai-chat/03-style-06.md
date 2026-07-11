# 阶段 3 样式 · 步 25

## `style: 功能键与高级键区分色`

- **指令(逐字):** % CE C ⌫ 与 ¹⁄ₓ x² √x ± 用 `#F9F9F9` 系、字号 ~16px。验收:功能键与数字键区分明显。
- **AI 响应摘要:** `Button.vue` 追加 `.btn.function`(`--fn-bg` `#F9F9F9`、16px、600、hover/pressed)与 `.btn.function:disabled`(内存行:浅灰 `--memory-fg`、透明底、13px)。
- **改动文件:** `src/components/Button.vue`
- **Commit:** `eaa6f14` `style: 功能键与高级键区分色`
