export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) return navigateTo('/')
    if(authStore.profile.type == undefined) return navigateTo('/')
    if(!authStore.isAdmin()) return navigateTo('/')

    await useAPI('ip/admin/check')
    return navigateTo('/manage/@eni')
  }
  catch (e:any) {
    // return false
  }
})