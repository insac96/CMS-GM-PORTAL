export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) return useTo().navigateToSSL('/')
    if(authStore.profile.type == undefined) return useTo().navigateToSSL('/')
    if(authStore.profile.type < 1) return useTo().navigateToSSL('/')

    await useAPI('ip/admin/check')
    return useTo().navigateToSSL('/manage/@eni')
  }
  catch (e:any) {
    //return false
  }
})