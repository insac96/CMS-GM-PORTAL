export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw 'Vui lòng đăng nhập trước'
    if(!to.params._code) throw 'Mã cộng tác viên không hợp lệ'

    const check = await useAPI('ads/manage/collab/code/check', { code: to.params._code })
    if(!check) throw 'Bạn không có quyền truy cập'
  }
  catch (e:any) {
    return navigateTo('/')
  }
})