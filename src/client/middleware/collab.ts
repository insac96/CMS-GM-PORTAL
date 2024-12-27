export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw 'Vui lòng đăng nhập trước'
    
    const codeCollab = to.params._code
    if(!codeCollab) throw 'Mã cộng tác viên không hợp lệ'

    await useAPI('collab/manage/code/check', { code: codeCollab })
  }
  catch (e:any) {
    return navigateTo('/')
  }
})