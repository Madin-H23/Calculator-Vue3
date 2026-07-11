<script setup>
import { ref, computed } from 'vue'
import { useCalculator, format } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'
import MemoryPanel from './MemoryPanel.vue'

const {
  current, expression, activeOp, hasMemory, memory,
  inputDigit, inputDot, chooseOp, equals,
  clearAll, clearEntry, backspace, negate, percent,
  reciprocal, square, sqrt,
  memoryStore, memoryClear, memoryRecall, memoryAdd, memorySubtract,
  memoryClearAt, memoryAddAt, memorySubtractAt,
} = useCalculator()

const theme = ref('light')
function toggleTheme() { theme.value = theme.value === 'light' ? 'dark' : 'light' }

const showMemory = ref(false)
const memoryView = computed(() => memory.value.map((n) => format(n).replaceAll('-', '−')))

function dispatch(p) {
  if (p.type === 'mtoggle') { showMemory.value = !showMemory.value; return }
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
  else if (p.type === 'mc') memoryClear()
  else if (p.type === 'mr') memoryRecall()
  else if (p.type === 'mplus') memoryAdd()
  else if (p.type === 'mminus') memorySubtract()
  else if (p.type === 'ms') memoryStore()
}
</script>

<template>
  <div class="calculator" :class="{ dark: theme === 'dark' }">
    <div v-if="showMemory" class="memory-backdrop" @click="showMemory = false"></div>
    <div class="title-bar">
      <span class="menu">≡</span>
      <span class="mode">标准</span>
      <span class="caret">▾</span>
      <span v-if="hasMemory" class="mem-badge">M</span>
      <button class="theme-toggle" @click="toggleTheme">{{ theme === 'light' ? '🌙' : '☀' }}</button>
    </div>
    <Display :expression="expression" :current="current" />
    <div class="pad-area">
      <ButtonPad :active-op="activeOp" :has-memory="hasMemory" @press="dispatch" />
      <MemoryPanel
        v-if="showMemory"
        :items="memoryView"
        @clear="memoryClearAt"
        @add="memoryAddAt"
        @subtract="memorySubtractAt"
      />
    </div>
  </div>
</template>

<style scoped>
.calculator {
  position: relative;
  width: 360px;
  margin: 40px auto;
  background: var(--bg);
  border-radius: var(--radius-window);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  font-family: var(--font);
}
.memory-backdrop { position: absolute; inset: 0; z-index: 50; }
.pad-area { position: relative; }
.title-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px 4px; font-size: 14px; color: var(--display-expr);
}
.title-bar .menu { font-size: 18px; }
.title-bar .caret { font-size: 12px; }
.title-bar .mem-badge { font-size: 13px; font-weight: 600; color: var(--accent); }
.title-bar .theme-toggle {
  margin-left: auto; border: none; background: transparent; cursor: pointer;
  font-size: 16px; color: var(--display-expr); border-radius: var(--radius-btn); padding: 2px 6px;
}
.title-bar .theme-toggle:hover { background: var(--fn-hover); }
</style>
