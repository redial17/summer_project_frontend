<script setup>
// import { useAssetsStore } from '@/stores/modules/assets'
// import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

// const route = useRoute()
// const assetsStore = useAssetsStore()

const isEdit = false
const contactOptions = [
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Discord', label: 'Discord' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Telegram', label: 'Telegram' }
]
const contact = ref('Email')
onMounted(() => {
  // const id = Number(route.params.id)
  // const asset = assetsStore.assets.find((item) => item.id === id)
  // const map = L.map('map').setView([0, 0], 13)
  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; OpenStreetMap contributors'
  // }).addTo(map)
  // const geoLayer = L.geoJSON(asset.drainArea).addTo(map)
  // map.fitBounds(geoLayer.getBounds())
})
</script>

<template>
  <el-row>
    <el-col :span="12">
      <el-card style="max-width: 480px">
        <template #header>
          <div class="card-header">
            <span>Map</span>
          </div>
        </template>
        <div id="map" style="height: 400px"></div>
        <template #footer>Footer content</template>
      </el-card>
    </el-col>

    <el-col :span="12">
      <!-- info form -->
      <el-form>
        <el-form-item>
          <el-select
            v-model="contact"
            placeholder="Select warning level"
            size="large"
            style="width: 240px"
            @click="isEdit = true"
          >
            <el-option
              v-for="item in contactOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @click="isEdit = true"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="input"
            style="width: 240px"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="input"
            style="width: 240px"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="isEdit">Save</el-button>
        </el-form-item>
        <el-form-item>
          <el-button>Subscribe</el-button>
        </el-form-item>
      </el-form>
      <el-button type="danger">Rest All</el-button>
    </el-col>
  </el-row>

  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="WarningID" label="Warning ID" width="180" />
      <el-table-column prop="name" label="Warning Type" width="180" />
      <el-table-column prop="address" label="Warning Impact" width="180" />
      <el-table-column prop="name" label="Warning Likelihood" width="180" />
      <el-table-column prop="name" label="Valid From" width="180" />
      <el-table-column prop="name" label="Valid To" width="180" />
    </el-table>
  </div>
</template>
