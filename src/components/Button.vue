<script setup>
defineProps({
  label: String,
  variant: String, // 'number' | 'operator' | 'function' | 'equals'
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})
defineEmits(['press'])
</script>

<template>
  <button :class="['btn', variant, { active }]" :disabled="disabled" @click="$emit('press')">{{ label }}</button>
</template>
