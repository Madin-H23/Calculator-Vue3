<script setup>
import { ref } from 'vue'
import { useCalculator } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'

const { current, expression, activeOp, inputDigit, inputDot, chooseOp, equals, clearAll, clearEntry, backspace, negate, percent, reciprocal, square, sqrt } = useCalculator()

const theme = ref('light')
function toggleTheme() { theme.value = theme.value === 'light' ? 'dark' : 'light' }

function dispatch(p) {
  if (p.type === 'digit') inputDigit(p.value)
  else if (p.type === 'dot') inputDot()
  else if (p.type === 'op') chooseOp(p.value)
  else if (p.type === 'equals') equals()
  else if (p.type === 'clear') clearAll()
  else if (p.type === 'ce') clearEntry()
  else if (p.type === 'back') backspace()
  else if (p.type === 'negate') negate()
  else if (p.type === 'percent') percent()
  else if (p.type === 'reciprocal') reciprocal()
  else if (p.type === 'square') square()
  else if (p.type === 'sqrt') sqrt()
}
</script>

<template>
  <div class="calculator" :class="{ dark: theme === 'dark' }">
    <div class="title-bar">
      <span class="menu">≡</span>
      <span class="mode">标准</span>
      <span class="caret">▾</span>
      <button class="theme-toggle" @click="toggleTheme">{{ theme === 'light' ? '🌙' : '☀' }}</button>
    </div>
    <Display :expression="expression" :current="current" />
    <ButtonPad :active-op="activeOp" @press="dispatch" />
  </div>
</template>

<style scoped>
.calculator {
  width: 360px;
  margin: 40px auto;
  background: var(--bg);
  border-radius: var(--radius-window);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: var(--font);
}
.title-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px 4px; font-size: 14px; color: var(--display-expr);
}
.title-bar .menu { font-size: 18px; }
.title-bar .caret { font-size: 12px; }
.title-bar .theme-toggle {
  margin-left: auto; border: none; background: transparent; cursor: pointer;
  font-size: 16px; color: var(--display-expr); border-radius: var(--radius-btn); padding: 2px 6px;
}
.title-bar .theme-toggle:hover { background: var(--fn-hover); }
</style>
