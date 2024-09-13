export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw true

    const { game, token } = to.query
    const check = await useAPI('game/tool/public/project/play/verify', { game, token })
    if(!check) throw true
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})