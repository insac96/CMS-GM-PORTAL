export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig()
  const appConfig = useAppConfig()
  const mode = useColorMode()

  // Ads From Cookie
  const adsFromCookie = useCookie('ads-from', runtimeConfig.public.cookieConfig)
  if(from.query.f){
    adsFromCookie.value = from.query.f as string
    await useAPI('ads/public/from/view', { code: adsFromCookie.value })
  }

  // Ads Collab Cookie
  const codeCollab = runtimeConfig.public.collab
  if(!!codeCollab) await useAPI('ads/public/collab/view', { code: codeCollab })

  // Theme Cookie
  // const primaryCookie = useCookie('theme-primary', runtimeConfig.public.cookieConfig)
  // const grayCookie = useCookie('theme-gray', runtimeConfig.public.cookieConfig)
  // if(primaryCookie.value) appConfig.ui.primary = primaryCookie.value
  // if(grayCookie.value) appConfig.ui.gray = grayCookie.value
  mode.preference = 'dark'
})