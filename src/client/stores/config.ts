import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types'

export const useConfigStore = defineStore('config', () => {
  // @ts-expect-error
  const config : IDBConfigStore = reactive({
    name: '...',
    short_name: '...',
    description: '...',
    og_image: '',
    logo_image: '',
    makeby: '',
    yuan: 0,
    vip: {
      month: 0,
      forever: 0,
    },
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
      game: {
        china: '',
        private: '',
        tool: '',
      }
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