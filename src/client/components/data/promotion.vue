<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
    <UiContent title="Thông Báo" sub="Các thông tin hoặc chương trình khuyến mãi mới" class="p-4" no-dot>
      <template #more>
        <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal = false"></UButton>
      </template>

      <div class="max-h-[70vh] overflow-y-auto mb-4">
        <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !content || content == '<p></p>'"></DataEmpty>
        <UiEditorContent :content="content" v-else />
      </div>
    </UiContent>
  </UModal>
</template>

<script setup>
const { dayjs } = useDayJs()
const runtimeConfig = useRuntimeConfig()
const modal = ref(false)
const loading = ref(true)
const content = ref(undefined)

const get = async () => {
  try {
    loading.value = true
    const get = await useAPI('config/public/article/get', { type: 'promotion' })

    content.value = get
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

watch(() => modal.value, (val) => !!val && get())

onMounted(() => {
  const timeAutoShowPromotion = useCookie('time-auto-show-promotion', runtimeConfig.public.cookieConfig)

  if(!timeAutoShowPromotion.value) {
    modal.value = true
    timeAutoShowPromotion.value = new Date()
  }
  else {
    const now = dayjs(new Date()).get('hour')
    const time = dayjs(timeAutoShowPromotion.value).get('hour')
    if(now != time) {
      modal.value = true
      timeAutoShowPromotion.value = new Date()
    }
  }
})
</script>