export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig()

  // Ads From Cookie
  const adsFromCookie = useCookie('ads-from', runtimeConfig.public.cookieConfig)
  const codeFrom = from.query.f
  if(!!codeFrom){
    adsFromCookie.value = codeFrom as string
    await useAPI('ads/public/from/view', { code: adsFromCookie.value })
  }
  else adsFromCookie.value = null

  // Ads Collab Cookie
  const collabCookie = useCookie('collab', runtimeConfig.public.cookieConfig)
  const codeCollab = useCollab().getCode()
  if(!!codeCollab) {
    collabCookie.value = codeCollab as string
    await useAPI('collab/public/view', { code: collabCookie.value })
  }
  else collabCookie.value = null

  // Theme Cookie
  const mode = useColorMode()
  // const appConfig = useAppConfig()
  // const primaryCookie = useCookie('theme-primary', runtimeConfig.public.cookieConfig)
  // const grayCookie = useCookie('theme-gray', runtimeConfig.public.cookieConfig)
  // if(primaryCookie.value) appConfig.ui.primary = primaryCookie.value
  // if(grayCookie.value) appConfig.ui.gray = grayCookie.value
  mode.preference = 'dark'
})