import { join } from 'path'

export default defineNuxtConfig({
  devtools: { enabled: false },

  srcDir: join(__dirname, './src/client'),

  serverDir: join(__dirname, './src/server'),

  nitro: {
    output: { 
      dir: './dist/server',
      serverDir: './dist/server/core', 
      publicDir: './dist/server/public' 
    }
  },

  runtimeConfig: {
    dev: process.env.NODE_ENV === 'production' ? false : true,
    mongoURI: process.env.MONGO_URI,
    mongoDB: process.env.MONGO_DB,
    apiSecret: process.env.SECRET,
    
    public: {
      dev: process.env.NODE_ENV === 'production' ? false : true,
      clientURL: process.env.CLIENT_URL,
      domain: process.env.DOMAIN,
      cookieConfig: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
      version: process.env.VERSION
    }
  },

  modules: [
    '@pinia/nuxt', 
    '@nuxt/image', 
    '@nuxt/ui', 
    '@nuxt/icon', 
    ['@nuxtjs/google-fonts', {
      display: 'swap',
      download: true,
      families: {
        Montserrat: [400,500,600,700]
      }
    }],
    ['@nuxtjs/robots', {
      rules: [
        { UserAgent: '*' },
        { Disallow: '/manage/*' },
        { Disallow: '/.nuxt/*' },
        { BlankLine: true },
        { Sitemap: `${process.env.CLIENT_URL}/sitemap.xml` }
      ]
    }], 
    'nuxt-rate-limit', 
    '@nuxtjs/device'
  ],

  nuxtRateLimit: {
    routes: {
      '/api/*': {
        maxRequests: 10,
        intervalSeconds: 1,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    //pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '@/app.sass'
  ],

  colorMode: {
    preference: 'light'
  },

  icon: {
    serverBundle: 'remote',
  },

  image: {
    domains: [
      process.env.DOMAIN as string
    ]
  },

  compatibilityDate: '2024-08-19'
})