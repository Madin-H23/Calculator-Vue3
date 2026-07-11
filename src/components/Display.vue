<script setup>
import { computed } from 'vue'
const props = defineProps({ expression: String, current: String })
const exprView = computed(() => (props.expression || '').replaceAll('-', '−'))
const curView = computed(() => (props.current || '').replaceAll('-', '−'))
</script>

<template>
  <div class="display">
    <div class="expression">{{ exprView }}</div>
    <div class="current">{{ curView }}</div>
  </div>
</template>
