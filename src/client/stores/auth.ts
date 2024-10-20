import { defineStore } from 'pinia'
import type { IDBUserStore } from '~~/types'

export const useAuthStore = defineStore('auth', () => {
  const modal = ref(false)
  const isLogin = ref(false)
  const profile : Ref<IDBUserStore | undefined> = ref(undefined)

  function setModal (data : boolean) {
    modal.value = data
  }

  async function setAuth () {
    const auth = await useAPI('auth/public/get') 
    isLogin.value = true
    profile.value = auth 
  }

  async function removeAuth () {
    await useAPI('auth/public/sign/out')
    isLogin.value = false
    profile.value = undefined
  }

  async function isAdmin () {
    if(!isLogin.value) return false
    if(!profile.value) return false
    if(!profile.value.type) return false
    return profile.value.type == 100
  }

  async function isGMod () {
    if(!isLogin.value) return false
    if(!profile.value) return false
    if(!profile.value.type) return false
    return profile.value.type == 1
  }

  
  async function isFMod () {
    if(!isLogin.value) return false
    if(!profile.value) return false
    if(!profile.value.type) return false
    return profile.value.type == 2
  }

  return { 
    modal, 
    isLogin, 
    profile, 
    isAdmin, 
    isGMod, 
    isFMod, 
    setModal, 
    setAuth, 
    removeAuth
  }
})