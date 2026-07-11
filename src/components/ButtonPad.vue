<script setup>
import Button from './Button.vue'
defineEmits(['press'])
const props = defineProps({ activeOp: String, hasMemory: Boolean })
const memoryButtons = [
  { label: 'MC', type: 'mc', needsMemory: true },
  { label: 'MR', type: 'mr', needsMemory: true },
  { label: 'M+', type: 'mplus' },
  { label: 'M-', type: 'mminus' },
  { label: 'MS', type: 'ms' },
  { label: 'M▾', type: null },
]
const buttons = [
  { label: '%', variant: 'function', type: 'percent' }, { label: 'CE', variant: 'function', type: 'ce' }, { label: 'C', variant: 'function', type: 'clear' }, { label: '⌫', variant: 'function', type: 'back' },
  { label: '1/x', variant: 'function', type: 'reciprocal' }, { label: 'x²', variant: 'function', type: 'square' }, { label: '√x', variant: 'function', type: 'sqrt' }, { label: '÷', variant: 'operator', type: 'op', value: '÷' },
  { label: '7', variant: 'number', type: 'digit', value: '7' },
  { label: '8', variant: 'number', type: 'digit', value: '8' },
  { label: '9', variant: 'number', type: 'digit', value: '9' },
  { label: '×', variant: 'operator', type: 'op', value: '×' },
  { label: '4', variant: 'number', type: 'digit', value: '4' },
  { label: '5', variant: 'number', type: 'digit', value: '5' },
  { label: '6', variant: 'number', type: 'digit', value: '6' },
  { label: '−', variant: 'operator', type: 'op', value: '-' },
  { label: '1', variant: 'number', type: 'digit', value: '1' },
  { label: '2', variant: 'number', type: 'digit', value: '2' },
  { label: '3', variant: 'number', type: 'digit', value: '3' },
  { label: '+', variant: 'operator', type: 'op', value: '+' },
  { label: '±', variant: 'function', type: 'negate' },
  { label: '0', variant: 'number', type: 'digit', value: '0' },
  { label: '.', variant: 'number', type: 'dot' },
  { label: '=', variant: 'equals', type: 'equals' },
]
</script>

<template>
  <div>
    <div class="memory-row" style="display: flex;">
      <Button
        v-for="(m, i) in memoryButtons" :key="'m' + i"
        :label="m.label" variant="memory"
        :disabled="m.type === null || (m.needsMemory && !props.hasMemory)"
        @press="m.type && $emit('press', { type: m.type })"
      />
    </div>
    <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);">
      <Button
        v-for="(b, i) in buttons" :key="i" :label="b.label" :variant="b.variant"
        :active="b.type === 'op' && b.value === props.activeOp"
        @press="$emit('press', { type: b.type, value: b.value })"
      />
    </div>
  </div>
</template>

<style scoped>
.memory-row { gap: 2px; padding: 2px 4px; }
.memory-row :deep(.btn) { flex: 1 1 0; height: 32px; }
.button-pad { gap: 2px; padding: 2px 4px 4px; }
.button-pad :deep(.btn) { width: 100%; }
</style>
