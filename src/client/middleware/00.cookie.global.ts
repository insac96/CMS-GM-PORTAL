export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig()
  const appConfig = useAppConfig()

  // Theme Cookie
  const primaryCookie = useCookie('theme-primary', runtimeConfig.public.cookieConfig)
  const grayCookie = useCookie('theme-gray', runtimeConfig.public.cookieConfig)
  // if(primaryCookie.value) appConfig.ui.primary = primaryCookie.value
  // if(grayCookie.value) appConfig.ui.gray = grayCookie.value
})