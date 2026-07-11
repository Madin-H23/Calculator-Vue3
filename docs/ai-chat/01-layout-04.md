# 阶段 1 布局 · 步 6

## `feat(layout): 通用按钮组件 Button.vue`

- **指令(逐字):** 新建可复用 `Button.vue`,props `label`、`variant`(`number|operator|function|equals`)。模板渲染一个 button,**不绑事件**(本阶段只渲染)。`ButtonPad.vue` 中用它铺出数字按钮 0-9(可先不全排,只放 7 8 9 等)。验收:页面上能看到数字按钮。
- **AI 响应摘要:** 创建 `Button.vue`(props label/variant/disabled/active,纯渲染无 `@click`);ButtonPad 用其铺出 `7 8 9`。
- **改动文件:** `src/components/Button.vue`(新增)、`src/components/ButtonPad.vue`
- **Commit:** `4e89eac` `feat(layout): 通用按钮组件 Button.vue`
