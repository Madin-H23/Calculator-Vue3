<script setup>
import { useCalculator } from '../composables/useCalculator.js'
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'

const { current, expression, activeOp, inputDigit, inputDot } = useCalculator()

function dispatch(p) {
  if (p.type === 'digit') inputDigit(p.value)
  else if (p.type === 'dot') inputDot()
}
</script>

<template>
  <div class="calculator">
    <Display :expression="expression" :current="current" />
    <ButtonPad :active-op="activeOp" @press="dispatch" />
  </div>
</template>
