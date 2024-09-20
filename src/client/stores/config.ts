import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types'

export const useConfigStore = defineStore('config', () => {
  const config : IDBConfigStore = reactive({
    name: '...',
    short_name: '...',
    description: '...',
    og_image: '',
    logo_image: '',
    makeby: '',
    download: {
      windows: '',
      mac: '',
    },
    contact: {
      name: '',
      phone: '',
      email: '',
      address: '',
      prefix: ''
    },
    social: {
      facebook: '',
      messenger: '',
      zalo: '',
      telegram: '',
      tiktok: '',
    },
    facebook: {
      client_id: '',
      client_version: '',
      client_verify: '',
    },
    google: {
      client_id: '',
      client_verify: '',
    },
    tiktok: {
      client_id: '',
      client_verify: '',
    },
    zalo: {
      client_id: '',
      client_verify: '',
    }
  })

  const bootConfig = async () => {
    try {
      const cfg : IDBConfigStore = await useAPI('config/public/get')
      Object.assign(config, cfg)
    }
    catch(e){}
  }

  return { config, bootConfig }
})