<script setup>
defineProps({ items: { type: Array, default: () => [] } })
defineEmits(['clear', 'add', 'subtract'])
</script>

<template>
  <div class="memory-panel">
    <div class="memory-header">内存</div>
    <div v-if="!items.length" class="memory-empty">内存中暂无内容</div>
    <div v-else class="memory-list">
      <div v-for="(val, i) in items" :key="i" class="memory-item">
        <span class="memory-item-value">{{ val }}</span>
        <div class="memory-item-actions">
          <button class="mem-op" @click="$emit('clear', i)">MC</button>
          <button class="mem-op" @click="$emit('add', i)">M+</button>
          <button class="mem-op" @click="$emit('subtract', i)">M-</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memory-panel {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(128, 128, 128, 0.2);
}
.memory-header {
  padding: 8px 12px;
  font-size: 14px;
  color: var(--display-expr);
}
.memory-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--memory-fg);
}
.memory-list {
  flex: 1;
  overflow-y: auto;
}
.memory-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid rgba(128, 128, 128, 0.15);
}
.memory-item-value {
  font-size: 20px;
  color: var(--display-result);
}
.memory-item-actions {
  display: flex;
  gap: 4px;
}
.mem-op {
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-btn);
  font-size: 13px;
  font-weight: 600;
  color: var(--btn-fg);
  padding: 4px 8px;
  font-family: var(--font);
}
.mem-op:hover {
  background: var(--fn-hover);
}
</style>
