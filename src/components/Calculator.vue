<script setup>
import { useCalculator } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'

const { current, expression, activeOp, inputDigit, inputDot, chooseOp, equals, clearAll, clearEntry, backspace } = useCalculator()

function dispatch(p) {
  if (p.type === 'digit') inputDigit(p.value)
  else if (p.type === 'dot') inputDot()
  else if (p.type === 'op') chooseOp(p.value)
  else if (p.type === 'equals') equals()
  else if (p.type === 'clear') clearAll()
  else if (p.type === 'ce') clearEntry()
  else if (p.type === 'back') backspace()
}
</script>

<template>
  <div class="calculator">
    <Display :expression="expression" :current="current" />
    <ButtonPad :active-op="activeOp" @press="dispatch" />
  </div>
</template>
