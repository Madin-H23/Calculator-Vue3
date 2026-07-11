<script setup>
import Display from './Display.vue'
import ButtonPad from './ButtonPad.vue'
</script>

<template>
  <div class="calculator">
    <Display expression="" current="0" />
    <ButtonPad />
  </div>
</template>
