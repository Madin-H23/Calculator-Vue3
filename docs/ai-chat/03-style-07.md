# 阶段 3 样式 · 步 26

## `style: hover / active 交互态`

- **指令(逐字):** 按色板补全各 variant 的 hover/active(深色主题同步)。验收:鼠标交互反馈贴近 Win11。
- **AI 响应摘要:** `Button.vue` `.btn` 加 `transition`(背景色/transform)与 `:not(:disabled):active { transform: scale(0.98) }`;`ButtonPad.vue` 加 `<style scoped>` —— 内存行/主区 `gap: 2px` + 内边距,`:deep(.btn)` 控制宽/高。深色由 `.dark` 变量自动同步。
- **改动文件:** `src/components/Button.vue`、`src/components/ButtonPad.vue`
- **Commit:** `0094d9a` `style: hover / active 交互态`
