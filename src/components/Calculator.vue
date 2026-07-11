<script setup>
import { useCalculator } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'

const { current, expression, activeOp, inputDigit, inputDot, chooseOp, equals, clearAll, clearEntry, backspace, negate, percent, reciprocal, square, sqrt } = useCalculator()

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
  <div class="calculator">
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
</style>
