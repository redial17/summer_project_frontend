<script setup lang="ts"></script>

<template>
  <div class="login-page">
    <div class="card-wrapper">
      <el-card class="glass-effect" style="width: 90%; max-width: 400px">
        <router-view></router-view>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  background: url('@/assets/login_bg.png') no-repeat center / cover;
}

.card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.glass-effect {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}
</style>
