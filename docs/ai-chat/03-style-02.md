# 阶段 3 样式 · 步 21

## `style: 显示区字号层级与右对齐`

- **指令(逐字):** 表达式小灰字、结果大字、右对齐、超长缩小。验收:显示区观感贴近 Win11。
- **AI 响应摘要:** `Display.vue` 加 `<style scoped>` —— `.display` 右对齐内边距;`.expression` 16px 灰(`--display-expr`);`.current` 42px(`--display-result`)、超长 `text-overflow: ellipsis`。
- **改动文件:** `src/components/Display.vue`
- **Commit:** `655cc14` `style: 显示区字号层级与右对齐`
