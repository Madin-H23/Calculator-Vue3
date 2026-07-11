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

<style scoped>
.btn {
  border: none;
  border-radius: var(--radius-btn);
  font-family: var(--font);
  color: var(--btn-fg);
  cursor: pointer;
  user-select: none;
}
.btn:disabled { cursor: default; }
.btn.number {
  background: var(--num-bg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.number:hover { background: var(--num-hover); }
.btn.number:active { background: var(--num-pressed); }
.btn.operator {
  background: var(--op-bg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.operator:hover { background: var(--op-hover); }
.btn.operator:active { background: var(--op-pressed); }
.btn.operator.active {
  background: var(--accent);
  color: var(--eq-fg);
}
.btn.equals {
  background: var(--eq-bg);
  color: var(--eq-fg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.equals:hover { background: var(--eq-hover); }
.btn.equals:active { background: var(--eq-pressed); }
.btn.function {
  background: var(--fn-bg);
  font-size: 16px;
  font-weight: 600;
  padding: 14px 0;
}
.btn.function:hover { background: var(--fn-hover); }
.btn.function:active { background: var(--fn-pressed); }
.btn.function:disabled {
  color: var(--memory-fg);
  background: transparent;
  font-size: 13px;
}
</style>
