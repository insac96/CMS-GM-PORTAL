import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const online : Ref<number> = ref(0)

  function updateOnline (data : number) {
    online.value = data
  }

  return { online, updateOnline }
})