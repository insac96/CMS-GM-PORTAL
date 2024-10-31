import { defineStore } from 'pinia'
import type { IDBUserStore } from '~~/types'

export const useAuthStore = defineStore('auth', () => {
  const modal = ref(false)
  const isLogin = ref(false)
  const isAdmin = ref(false)
  const isGMod = ref(false)
  const isFMod = ref(false)
  const vip : Ref<string | undefined>= ref(undefined)
  const profile : Ref<IDBUserStore | undefined> = ref(undefined)

  function setModal (data : boolean) {
    modal.value = data
  }

  async function setAuth () {
    const auth = await useAPI('auth/public/get')
    isAdmin.value = auth.type == 100
    isGMod.value = auth.type == 1
    isFMod.value = auth.type == 2
    isLogin.value = true
    
    if(!!auth.vip){
      if(!!auth.vip.forever.enable) vip.value = 'forever'
      else 
        if(!!auth.vip.month.enable) vip.value = 'month'
        else vip.value = undefined
    }

    profile.value = auth 
  }

  async function removeAuth () {
    await useAPI('auth/public/sign/out')
    isAdmin.value = false
    isGMod.value = false
    isFMod.value = false
    isLogin.value = false
    profile.value = undefined
  }

  return { 
    modal, 
    isLogin, 
    profile, 
    isAdmin, 
    isGMod, 
    isFMod,
    vip,
    setModal, 
    setAuth, 
    removeAuth
  }
})