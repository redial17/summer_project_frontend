<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { useUserStore, useAssetStore } from '@/stores/index.ts'
import type { AssetWithWarnings } from '@/types'
const assetStore = useAssetStore()
const userStore = useUserStore()
const router = useRouter()

// filter value
const assetName = ref('')
const assetWarningLevel = ref('')
const assetType = ref('')

// filtered assets
const currentAssets = ref<AssetWithWarnings[] | []>([])

// select value
const warningLevelOptions = [
  {
    value: 'No',
    label: 'No Warning'
  },
  {
    value: 'YELLOW',
    label: 'Yellow Warning'
  },
  {
    value: 'AMBER',
    label: 'Amber Warning'
  },
  {
    value: 'RED',
    label: 'Red Warning'
  }
]

const assetTypeOptions = [
  { value: 'type_001', label: 'Water Tank' },
  { value: 'type_002', label: 'Soakaway' },
  { value: 'type_003', label: 'Green Roof' },
  { value: 'type_004', label: 'Permeable Pavement' },
  { value: 'type_005', label: 'Swale' },
  { value: 'type_006', label: 'Retention Pond' },
  { value: 'type_007', label: 'Rain Garden' }
]
// page change
const currentPage = ref(1)
const pageSize = 8
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const addAssetVisible = ref(false)
const currentPageAssets = computed(() => {
  if (!currentAssets.value || currentAssets.value.length === 0) return
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  const arr = currentAssets.value.slice(start, end)

  // set indicator color
  arr.forEach((item) => {
    if (item.warnings[0]?.warningLevel.toLowerCase().includes('red')) {
      item.status = 'red'
    } else if (item.warnings[0]?.warningLevel.toLowerCase().includes('amber')) {
      item.status = 'amber'
    } else if (
      item.warnings[0]?.warningLevel.toLowerCase().includes('yellow')
    ) {
      item.status = 'yellow'
    } else {
      item.status = 'success'
    }
  })

  return arr
})

onMounted(async () => {
  currentAssets.value = []
  let id
  if (!userStore.user?.admin) {
    id = userStore.user?.assetHolderId
  } else {
    id = userStore.proxyId
  }
  if (userStore.user && id) {
    await assetStore.getUserAssets(userStore.user.admin, id)
  }
  if (assetStore.userAssets) {
    currentAssets.value = assetStore.userAssets
  }
})

// watch filter condition
watch(
  [assetName, assetWarningLevel, assetType],
  async () => {
    if (!assetStore.userAssets || assetStore.userAssets.length === 0) return
    currentAssets.value = assetStore.userAssets.filter((item) => {
      let matchLevel = false
      if (
        assetWarningLevel.value &&
        item.warnings[0] &&
        item.warnings[0].warningLevel &&
        item.warnings[0].warningLevel === assetWarningLevel.value
      ) {
        matchLevel = true
      } else if (
        assetWarningLevel.value &&
        assetWarningLevel.value.includes('No') &&
        !item.warnings[0]
      ) {
        matchLevel = true
      } else if (!assetWarningLevel.value) {
        matchLevel = true
      }
      const matchName = assetName.value
        ? item.asset.name?.toLowerCase().includes(assetName.value.toLowerCase())
        : true
      const matchType = assetType.value
        ? item.asset.typeId === assetType.value
        : true
      return matchName && matchLevel && matchType
    })
    currentPage.value = 1
  },
  {
    immediate: true
  }
)
</script>

<template>
  <!-- assets filter -->
  <div class="search-bar">
    <el-input
      v-model="assetName"
      class="select-style"
      placeholder="Search your assets"
    ></el-input>
    <el-select
      v-model="assetWarningLevel"
      placeholder="Select warning level"
      size="large"
      clearable
      class="select-style"
    >
      <el-option
        v-for="item in warningLevelOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>

    <el-select
      v-model="assetType"
      placeholder="Select Asset Type"
      size="large"
      clearable
      class="select-style"
    >
      <el-option
        v-for="item in assetTypeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>

  <!-- cards for assets -->
  <div class="assets-container">
    <h3 v-if="assetStore.userAssets?.length === 0">You don't have any asset</h3>
    <div class="card-grid">
      <el-card
        v-for="(item, index) in currentPageAssets"
        :key="item.asset.id"
        class="asset-card"
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <h3
              class="asset-title"
              :class="{
                'warning-low': !item.warnings[0],
                'warning-medium': item.warnings[0]?.warningLevel === 'YELLOW',
                'warning-high': item.warnings[0]?.warningLevel === 'AMBER',
                'warning-severe': item.warnings[0]?.warningLevel === 'RED'
              }"
            >
              {{ item.asset.name || 'Asset Name' }}
            </h3>
            <StatusIndicator :status="item.status" />
          </div>
        </template>

        <div class="map-container">
          <MapCard
            :map-id="'map-' + index"
            :locations="[item.asset.location]"
          />
        </div>

        <template #footer>
          <div class="card-footer">
            <el-button
              type="primary"
              @click="router.push(`/asset/${item.asset.id}`)"
              class="view-details-btn"
            >
              Show Detail
            </el-button>
          </div>
        </template>
      </el-card>
    </div>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="currentAssets.length"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      style="
        display: flex;
        justify-content: center;
        text-align: center;
        margin-top: 20px;
        position: relative;
        z-index: 2000;
      "
    />
    <AddAsset v-model:visible="addAssetVisible"></AddAsset>
  </div>
</template>

<style scoped>
.search-bar {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  padding: 10px 0;
  z-index: 1100;
}
.assets-container {
  padding: 16px;
  min-height: 100vh;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  max-width: calc(300px * 4 + 20px * 3);
  margin-left: auto;
  margin-right: auto;

  justify-content: flex-start;
}

.asset-card {
  width: 300px;
  height: 310px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.asset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  column-gap: 8px;
}

.asset-title {
  /* hide overflow text*/
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.2;
  height: 1.2em;
}

.map-container {
  padding: 16px 0;
  display: flex;
  justify-content: center;
  height: 180px;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-footer {
  display: flex;
  justify-content: center;
  padding: 0;
}

.view-details-btn {
  width: 80%;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.select-style {
  width: 240px;
}

.warning-low {
  color: green;
}
.warning-medium {
  color: yellow;
}
.warning-high {
  color: orange;
}
.warning-severe {
  color: red;
}

@media (max-width: 768px) {
  .assets-container {
    padding: 12px;
  }

  .card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    justify-content: center !important;
  }
}

@media (max-width: 480px) {
  .card-grid {
    justify-content: flex-start;
  }
  .select-style {
    width: 100px;
  }
}

/* change defalut style */
:deep(.el-card__header) {
  padding: 12px 16px;
  height: 45px;
}

:deep(.el-card__body) {
  padding: 0px 16px 0px 16px;
}

:deep(.el-card__footer) {
  padding: 10px 16px;
  border-top: 1px solid #ebeef5;
}
</style>
