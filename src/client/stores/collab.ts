import { defineStore } from 'pinia'
import type { IDBCollabStore } from '~~/types'

export const useCollabStore = defineStore('collab', () => {
  // @ts-expect-error
  const collab : IDBCollabStore = reactive({
    code: '',
    user: ''
  })

  const hasCollab : Ref<boolean> = ref(false)

  const bootCollab = async () => {
    try {
      const code = useCollab().getCode()
      if(!code) throw true

      const data : IDBCollabStore = await useAPI('collab/public/get', { code })
      Object.assign(collab, data)
      hasCollab.value = true
    }
    catch(e){
      hasCollab.value = false
    }
  }

  return { collab, hasCollab, bootCollab }
})