<script setup>
defineProps({ expression: String, current: String })
</script>

<template>
  <div class="display">
    <div class="expression">{{ expression }}</div>
    <div class="current">{{ current }}</div>
  </div>
</template>
