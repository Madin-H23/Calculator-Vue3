import { ref, computed } from 'vue'

const OP_SYMBOL = { '+': '+', '-': '−', '×': '×', '÷': '÷' }

function compute(a, b, op) {
  if (op === '÷' && b === 0) return '不能除以零'
  let r
  if (op === '+') r = a + b
  else if (op === '-') r = a - b
  else if (op === '×') r = a * b
  else r = a / b
  if (!isFinite(r)) return '无效输入'
  return r
}

function format(n) {
  if (!isFinite(n)) return '无效输入'
  return Number(n.toPrecision(15)).toString()
}

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

  function setError(msg) { current.value = msg; error.value = true }

  function chooseOp(op) {
    if (error.value) return
    let val = parseFloat(current.value)
    if (pendingOp.value && !resetNext.value && prevValue.value != null) {
      const r = compute(prevValue.value, val, pendingOp.value)
      if (typeof r === 'string') { setError(r); return }
      val = r
      current.value = format(val)
    }
    prevValue.value = val
    pendingOp.value = op
    expression.value = `${format(val)} ${OP_SYMBOL[op]}`
    resetNext.value = true
  }

  function equals() {
    if (error.value || pendingOp.value == null || prevValue.value == null) return
    const val = parseFloat(current.value)
    const r = compute(prevValue.value, val, pendingOp.value)
    expression.value = `${format(prevValue.value)} ${OP_SYMBOL[pendingOp.value]} ${format(val)} =`
    if (typeof r === 'string') { setError(r); pendingOp.value = null; resetNext.value = true; return }
    current.value = format(r)
    pendingOp.value = null
    prevValue.value = null
    resetNext.value = true
  }

  function clearEntry() { current.value = '0'; resetNext.value = false; error.value = false }

  function backspace() {
    if (error.value || resetNext.value) return
    current.value = current.value.length > 1 ? current.value.slice(0, -1) : '0'
    if (current.value === '-') current.value = '0'
  }

  function negate() {
    if (error.value || current.value === '0') return
    current.value = current.value.startsWith('-') ? current.value.slice(1) : '-' + current.value
  }

  return { current, expression, activeOp, inputDigit, inputDot, chooseOp, equals, clearAll, clearEntry, backspace, negate }
}
