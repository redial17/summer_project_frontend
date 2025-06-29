import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminGetAssetsService, adminGetWarningsService } from '@/api/admin'
export const useAdminStore = defineStore(
  'rain-admin',
  () => {
    const proxyId = ref('')

    const setProxyId = (id) => {
      console.log(id)
      proxyId.value = id
    }

    const reset = () => {
      proxyId.value = ''
    }

    const allAssets = ref([])
    const allWarnings = ref([])
    const getAllAssets = async () => {
      const res = await adminGetAssetsService()
      allAssets.value = res.data.data
    }

    const getAllWarnings = async () => {
      const res = await adminGetWarningsService()
      allWarnings.value = res.data.data
    }
    return {
      proxyId,
      setProxyId,
      reset,
      allAssets,
      getAllAssets,
      getAllWarnings,
      allWarnings
    }
  },
  {
    persist: true
  }
)
