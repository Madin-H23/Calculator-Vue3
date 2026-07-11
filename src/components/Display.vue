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

<style scoped>
.display { padding: 8px 16px 12px; text-align: right; }
.expression {
  min-height: 22px;
  font-size: 16px;
  color: var(--display-expr);
  word-break: break-all;
}
.current {
  font-size: 42px;
  font-weight: 400;
  color: var(--display-result);
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
