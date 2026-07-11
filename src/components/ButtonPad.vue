<script setup>
import Button from './Button.vue'
const buttons = [
  { label: '7', variant: 'number' },
  { label: '8', variant: 'number' },
  { label: '9', variant: 'number' },
]
</script>

<template>
  <div class="button-pad" style="display: grid; grid-template-columns: repeat(4, 1fr);">
    <Button v-for="(b, i) in buttons" :key="i" :label="b.label" :variant="b.variant" />
  </div>
</template>
