import { defineStore } from 'pinia'
import { ref } from 'vue'
// token setToken
export const useUserStore = defineStore(
  'rain-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    return { token, setToken }
  },
  {
    persist: true
  }
)
