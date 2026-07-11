import { ref, computed } from 'vue'

export function useCalculator() {
  const current = ref('0')
  const expression = ref('')
  const prevValue = ref(null)
  const pendingOp = ref(null)
  const resetNext = ref(false)
  const error = ref(false)
  const activeOp = computed(() => (error.value ? null : pendingOp.value))

  function clearAll() {
    current.value = '0'
    expression.value = ''
    prevValue.value = null
    pendingOp.value = null
    resetNext.value = false
    error.value = false
  }

  function inputDigit(d) {
    if (error.value) { clearAll(); current.value = d; return }
    if (resetNext.value) { current.value = d; resetNext.value = false; return }
    current.value = current.value === '0' ? d : current.value + d
  }

  function inputDot() {
    if (error.value) { clearAll(); current.value = '0.'; return }
    if (resetNext.value) { current.value = '0.'; resetNext.value = false; return }
    if (!current.value.includes('.')) current.value += '.'
  }

  return { current, expression, activeOp, inputDigit, inputDot }
}
