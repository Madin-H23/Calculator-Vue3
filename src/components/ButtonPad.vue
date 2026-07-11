<script setup>
import Button from './Button.vue'
const memoryButtons = ['MC', 'MR', 'M+', 'M-', 'MS', 'M▾']
const buttons = [
  { label: '%', variant: 'function' }, { label: 'CE', variant: 'function' }, { label: 'C', variant: 'function' }, { label: '⌫', variant: 'function' },
  { label: '1/x', variant: 'function' }, { label: 'x²', variant: 'function' }, { label: '√x', variant: 'function' }, { label: '÷', variant: 'operator' },
  { label: '7', variant: 'number' }, { label: '8', variant: 'number' }, { label: '9', variant: 'number' }, { label: '×', variant: 'operator' },
  { label: '4', variant: 'number' }, { label: '5', variant: 'number' }, { label: '6', variant: 'number' }, { label: '−', variant: 'operator' },
  { label: '1', variant: 'number' }, { label: '2', variant: 'number' }, { label: '3', variant: 'number' }, { label: '+', variant: 'operator' },
  { label: '±', variant: 'function' }, { label: '0', variant: 'number' }, { label: '.', variant: 'number' }, { label: '=', variant: 'equals' },
]
</script>

<template>
  <div>
    <div class="memory-row" style="display: flex;">
      <Button v-for="(m, i) in memoryButtons" :key="'m' + i" :label="m" variant="function" disabled />
    </div>
    <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);">
      <Button v-for="(b, i) in buttons" :key="i" :label="b.label" :variant="b.variant" />
    </div>
  </div>
</template>
