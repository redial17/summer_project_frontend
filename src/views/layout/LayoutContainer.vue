<template>
  <div class="floating-input">
    <el-input
      v-model="email"
      id="email"
      placeholder=" "
      @focus="focused = true"
      @blur="focused = false"
    />
    <label :class="{ active: focused || email }" for="email">邮箱</label>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const focused = ref(false)
</script>

<style scoped>
.floating-input {
  position: relative;
  margin: 20px 0;
}

.floating-input label {
  position: absolute;
  top: 12px;
  left: 12px;
  color: #999;
  font-size: 14px;
  pointer-events: none;
  transition: 0.2s ease all;
}

.floating-input label.active {
  top: -6px;
  left: 8px;
  font-size: 12px;
  color: #409eff; /* Element Plus 默认主题色 */
}
</style>
