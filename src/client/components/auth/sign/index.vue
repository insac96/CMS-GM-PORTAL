<template>
  <UiFlex>
    <UButton aria-label="Sign" @click="modal = true">
      Tài Khoản
    </UButton>

    <UModal v-model="modal">
      <div class="p-5">
        <LazyAuthSignIn v-if="tabItem == 0" @up="tabItem = 1" @done="modal = false"></LazyAuthSignIn>
        <LazyAuthSignUp v-if="tabItem == 1" @in="tabItem = 0" @done="modal = false"></LazyAuthSignUp>
        <!-- <LazyAuthSignForgot v-if="tabItem == 2" @done="modal = false"></LazyAuthSignForgot> -->
      </div>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const modal = ref(false)
const tabItem = ref(0) 

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setModal(false))
</script>