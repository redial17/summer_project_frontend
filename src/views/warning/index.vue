<script setup>
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores'

const route = useRoute()
const adminStore = useAdminStore()
const setWarningLevelStyle = (level) => {
  let style = { weight: 2, fillOpacity: 0.4 }
  if (level) {
    if (level.toLowerCase().includes('yellow')) {
      style.color = '#cc9900'
      style.fillColor = '#ffff00'
    }
    if (level.toLowerCase().includes('amber')) {
      style.color = '#cc6600'
      style.fillColor = '#ffcc00'
    }
    if (level.toLowerCase().includes('red')) {
      style.color = '#800000'
      style.fillColor = '#ff0000'
    }
  }
  return style
}
const mapId = 'map-' + route.params.id
const warning = adminStore.allWarnings.find(
  (item) => item.id === Number(route.params.id)
)
const affectedAreasFormatted = warning.affectedAreas.replace(/\\n/g, '\n')
const furtherDetails = warning.warningFurtherDetails.replace(/\\n/g, '\n')
warning.polygon.style = setWarningLevelStyle(warning.warningLevel)
</script>

<template>
  <div class="map-container">
    <MapCard :map-id="mapId" :drain-area="[warning.polygon]"></MapCard>
  </div>
  <el-descriptions title="Warning Detail" :column="1" direction="vertical">
    <el-descriptions-item label="Warning ID">{{
      warning.id
    }}</el-descriptions-item>
    <el-descriptions-item label="Weather Type">{{
      warning.weatherType
    }}</el-descriptions-item>
    <el-descriptions-item label="Warning Level	">{{
      warning.warningLevel
    }}</el-descriptions-item>
    <el-descriptions-item label="Warning HeadLine">{{
      warning.WarningHeadLine
    }}</el-descriptions-item>
    <el-descriptions-item label="Valid From">{{
      warning.validFrom
    }}</el-descriptions-item>
    <el-descriptions-item label="Valid To">{{
      warning.validTo
    }}</el-descriptions-item>
    <el-descriptions-item label="Warning Impact">{{
      warning.warningImpact
    }}</el-descriptions-item>
    <el-descriptions-item label="Warning Likelihood">{{
      warning.warningLikelihood
    }}</el-descriptions-item>
    <el-descriptions-item label="Affected Areas">
      <span class="affected-text">{{ affectedAreasFormatted }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="Further Details">
      <span class="affected-text">{{ furtherDetails }}</span>
    </el-descriptions-item>
    <el-descriptions-item label="Update Description">{{
      warning.warningUpdateDescription
    }}</el-descriptions-item>
  </el-descriptions>
</template>

<style>
.map-container {
  height: 500px;
  padding: 16px 0;
  display: flex;
  justify-content: center;
}

.affected-text {
  white-space: pre-wrap;
}
</style>
