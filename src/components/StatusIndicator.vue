<template>
  <div class="indicator" :class="statusClass"></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'off' // possible value：success, warning, error, off
  }
})

const statusClass = computed(() => {
  return `indicator--${props.status}`
})
</script>

<style scoped>
.indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.indicator--success {
  background-color: #4caf50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.4);
  border-color: #c8e6c9;
}

.indicator--warning {
  background-color: #ff9800;
  box-shadow: 0 0 4px rgba(255, 152, 0, 0.4);
  border-color: #ffe0b2;
}

.indicator--error {
  background-color: #f44336;
  box-shadow: 0 0 4px rgba(244, 67, 54, 0.4);
  border-color: #ffcdd2;
}

.indicator--off {
  background-color: #bdbdbd;
  box-shadow: none;
  border-color: #e0e0e0;
}
</style>
