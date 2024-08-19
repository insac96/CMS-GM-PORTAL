<template>
  <div>
    <UButton :block="block" :icon="config.game.mobile ? 'i-bx-download' : 'i-bx-play'" :size="size || 'md'" :loading="loading" @click="start">
      {{ text || (config.game.mobile ? 'Tải Trò Chơi' : 'Chơi Ngay') }}
    </UButton>

    <UModal v-model="modal" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UiFlex justify="center" class="gap-6 py-8" wrap>
        <UiFlex type="col" justify="center" class="cursor-pointer" @click="download(config.download.apk)">
          <UAvatar class="Android" icon="i-bxl-android" size="2xl" />
          <UiText class="mt-2">Android</UiText>
        </UiFlex>
        <UiFlex type="col" justify="center" class="cursor-pointer" @click="download(config.download.ios)">
          <UAvatar class="Iphone" icon="i-bxl-apple" size="2xl" />
          <UiText class="mt-2">IOS</UiText>
        </UiFlex>
      </UiFlex>
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const props = defineProps(['block', 'text', 'size'])

const loading = ref(false)
const modal = ref(false)

const authStore = useAuthStore()
const configStore = useConfigStore()
const config = computed(() => configStore.config)

const download = (link) => {
  if(!link) return useNotify().error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  window.open(link, '_blank'); 
}

const start = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    if(!config.value.game.mobile){
      loading.value = true
      await useAPI('game/start')
      if(!!runtimeConfig.public.dev) navigateTo('/play')
      else location.href = `http://game.${runtimeConfig.public.domain}/play`
      loading.value = false
    }

    if(!!config.value.game.mobile){
      modal.value = true
    }
  }
  catch (e) {
    loading.value = false
  }
}
</script>