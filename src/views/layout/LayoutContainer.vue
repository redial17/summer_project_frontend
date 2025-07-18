<script setup lang="ts">
import {
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Message,
  MessageBox,
  Back,
  House,
  LocationInformation,
  Warning,
  CopyDocument,
  Operation,
  Search
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { ref, watch, computed } from 'vue'
import { useAssetStore, useUserStore } from '@/stores/index.ts'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const assetStore = useAssetStore()
const router = useRouter()
const route = useRoute()

const logout = () => {
  userStore.reset()
  assetStore.reset()
  router.push('/login')
}
const handleCommand = (command: string) => {
  if (command === 'logout') {
    logout()
  } else if (command === 'profile') {
    router.push('/user/profile')
  }
}

const handleMailClick = () => {
  if (userStore.user?.admin) router.push('/admin/message')
  else router.push('/message')
}

const activeIndex = ref(route.path)

const mobileMenuVisible = ref(false)

const searchDialogVisible = ref(false)

const showUserSideBar = computed(() => {
  if (!userStore.user?.admin) {
    return true
  } else if (
    userStore.user.admin &&
    (route.path === '/admin/warnings' || route.path.startsWith('/warning'))
  ) {
    return false
  } else if (userStore.user.admin && !route.path.includes('admin')) {
    return true
  }
  return false
})
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
  }
)
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <router-link to="/">
        <img src="@/assets/uob-logo.svg" class="el-aside__logo" alt="logo" />
      </router-link>

      <!-- user interface -->
      <el-menu
        :default-active="activeIndex"
        active-text-color="#ffd04b"
        background-color="#528add"
        text-color="#fff"
        router
        v-model="activeIndex"
        v-if="showUserSideBar"
      >
        <el-menu-item index="/user/profile">
          <el-icon><User /></el-icon>
          <span>My Profile</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><LocationInformation /></el-icon>
            <span>Asset</span>
          </template>
          <el-menu-item index="/myassets/manage">
            <span>My assets</span>
          </el-menu-item>
          <el-menu-item
            v-if="
              activeIndex.startsWith('/asset') && activeIndex !== '/asset/add'
            "
            :index="activeIndex"
          >
            <span>Asset detail</span>
          </el-menu-item>
          <el-menu-item index="/asset/add">
            <span>Add asset</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/message">
          <el-icon><MessageBox /></el-icon>
          <span>Message</span>
        </el-menu-item>

        <el-menu-item v-if="userStore.user?.admin" index="/">
          <el-icon><Back /></el-icon>
          <span>Back to admin</span>
        </el-menu-item>
      </el-menu>

      <!-- admin interface -->
      <el-menu
        active-text-color="#ffd04b"
        background-color="#528add"
        :default-active="$route.path"
        text-color="#fff"
        router
        v-else
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><House /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon>
            <span>User</span>
          </template>
          <el-menu-item index="/admin/users">
            <span>All Users</span>
          </el-menu-item>
          <el-menu-item index="/admin/user/add">
            <span>Add User</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><LocationInformation /></el-icon>
            <span>Asset</span>
          </template>
          <el-menu-item index="/admin/assets">
            <span>All Assets</span>
          </el-menu-item>
          <el-menu-item index="/admin/asset/add">
            <span>Add Asset</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><Warning /></el-icon>
            <span>Warning</span>
          </template>
          <el-menu-item index="/admin/warnings">
            <span>All Warning</span>
          </el-menu-item>
          <el-menu-item
            v-if="activeIndex.startsWith('/warning')"
            :index="activeIndex"
          >
            <span>Current Warning</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/message/template">
          <el-icon><CopyDocument /></el-icon>
          <span>Message Template</span>
        </el-menu-item>

        <el-menu-item index="/admin/message">
          <el-icon><MessageBox /></el-icon>
          <span>Message</span>
        </el-menu-item>
      </el-menu>

      <div class="signout-container">
        <el-button
          text
          type="danger"
          size="large"
          @click="logout"
          class="signout-button"
          >Sign out</el-button
        >
      </div>
    </el-aside>

    <el-container>
      <el-header style="display: flex; justify-content: space-between">
        <div class="header-left">
          <el-button
            class="mobile-menu"
            @click="mobileMenuVisible = true"
            plain
          >
            <el-icon><Operation /></el-icon>
          </el-button>
          <el-button @click="searchDialogVisible = true">
            <el-icon><Search /></el-icon>
          </el-button>
        </div>
        <MobileMenu
          v-if="mobileMenuVisible"
          v-model:visible="mobileMenuVisible"
        ></MobileMenu>
        <!-- <el-page-header
          v-if="userStore.user.admin && !route.path.includes('admin')"
          @back="router.go(-1)"
        >
        </el-page-header> -->
        <div class="header-right">
          <el-badge is-dot class="icon-badge">
            <el-icon @click="handleMailClick" class="bell">
              <Message />
            </el-icon>
          </el-badge>

          <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
              <el-avatar :src="avatar" />
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">
                  My profile
                </el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop">
                  Change avatar
                </el-dropdown-item>
                <el-dropdown-item command="password" :icon="EditPen">
                  Reset Password
                </el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">
                  Log out
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view></router-view>
        <CustomerService v-if="!userStore.user?.admin"></CustomerService>
        <SearchDialog v-model:visible="searchDialogVisible"></SearchDialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #528add;

    &__logo {
      box-sizing: border-box;
      width: 100%;
      padding: 20px;
    }
    .el-menu {
      border-right: none;
    }
    .el-menu-item.is-active {
      font-weight: bold;
    }

    .signout-container {
      margin-top: auto;
      padding: 20px;
      display: flex;
      justify-content: center;

      .signout-button {
        background-color: transparent;
      }
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;

      .bell {
        font-size: 24px;
        color: #999;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: #409eff;
          transform: scale(1.2);
        }
      }
    }
    .el-dropdown__box {
      display: flex;
      align-items: center;
      outline: none;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}

@media (min-width: 768px) {
  .tabbar-disply {
    display: none;
  }
  .mobile-menu {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .el-aside {
    display: none !important;
  }
}

@media (max-width: 480px) {
}
</style>
