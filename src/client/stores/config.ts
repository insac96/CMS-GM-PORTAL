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
    const cfg : IDBConfigStore = await useAPI('config/public/get')
    Object.assign(config, cfg)
  }

  return { config, bootConfig }
})