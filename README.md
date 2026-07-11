# Calculator — Windows 11 标准计算器(Vue 3 + Vite)

高保真还原 Windows 11 标准计算器外观与交互。Vue 3 `<script setup>` + Vite,无 TS / 无 UI 库 / 无状态库 / 无图标库 / 无测试框架。

## 运行

```bash
npm install
npm run dev      # 开发预览(http://localhost:5173)
npm run build    # 生产构建 → dist/
npm run preview  # 预览构建产物
```

## 项目结构

- `src/components/`:`Calculator`(状态持有 + 装配 + 主题)、`Display`、`ButtonPad`、`Button`
- `src/composables/useCalculator.js`:计算状态机(全部 action 集中于此)
- `src/style.css`:全局 reset + 浅/深主题 CSS 变量
- `docs/superpowers/specs/`:设计规格;`docs/superpowers/plans/`:实施计划
- `docs/ai-chat/`:29 步 AI 对话归档(入口见 `docs/ai-chat/index.md`)

## 三阶段提交对照(共 29 个实现提交)

| 阶段 | 步 | 起 → 止 commit | 说明 |
|---|---|---|---|
| 初始化 | 1–2 | `67f5474` → `19439d7` | Vite 脚手架 + 清理 / 目录骨架 |
| 布局 | 3–10 | `5c2d056` → `d655881` | 组件骨架(无 `@click`、无 `<style>`) |
| 逻辑 | 11–19 | `71d853f` → `d698910` | `useCalculator` 状态机(毛坯无 CSS) |
| 样式 | 20–27 | `7f8d472` → `b425f82` | Win11 高保真视觉 + 浅/深主题 |
| 收尾 | 28–29 | `eb37d8e` → 本提交 | 对话归档 + README |

> 完整 29 步 commit hash 见 [`docs/ai-chat/index.md`](docs/ai-chat/index.md)。另有 2 个前置规划提交:`03d4181`(规格 + TODO)、`6daca01`(实施计划)。

## 还原说明

- **视觉基准**:`PROMPT.md` §4(色板 / 4×6 网格 / 字号 / 浅深主题)。
- **功能**:`8 + 9 = 17`、`9 ÷ 0 =` → `不能除以零`、`1/x`、`x²`、`√x`、负数开方 → `无效输入`、`%`、`±`、`⌫`、`C / CE`、小数点防重复;运算符选中高亮;🌙 / ☀ 浅 / 深主题切换。
- **已知简化**(详见 spec §6.5,均不在 PROMPT 验收内):连续 `=` 不重复运算;`%` 在二元上下文不感知左操作数;一元运算覆写 `expression`(非保留完整链)。
- **两处认可豁免**:步 5 ButtonPad 内联 `display:grid`(PROMPT 已明示豁免);步 27 主题切换逻辑(spec §8 认可 —— 样式阶段唯一逻辑例外)。
- **提交规范**:subject 与 `PROMPT.md` 清单逐字一致,body 加 `Co-Authored-By` 尾注;`git log --oneline` 干净。

## 工作流

`superpowers:brainstorming`(设计)→ `superpowers:writing-plans`(实施计划)→ `superpowers:executing-plans`(逐任务执行,阶段门步 2 / 10 / 19 / 27 复核)。
