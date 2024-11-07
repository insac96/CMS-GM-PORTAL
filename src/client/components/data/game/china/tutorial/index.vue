<template>
  <UiContent title="Hướng Dẫn" sub="Tổng hợp hướng dẫn chơi game game China" class="p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="emits('close')"></UButton>
    </template>

    <UiFlex class="mb-2">
      <UTabs v-model="tab" :items="items" />
    </UiFlex>

    <div class="max-h-[70vh] overflow-y-auto mb-4">
      <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !content"></DataEmpty>
      <UiEditorContent :content="content" v-else />
    </div>

    <UiFlex justify="end" class="gap-2">
      <UToggle v-model="selected" />
      <UiText color="gray" size="sm">Không hiển thị lại</UiText>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const disabledAutoShowTutorialChina = useCookie('disabled-auto-show-tutorial-china', runtimeConfig.public.cookieConfig)

const emits = defineEmits(['close'])
const loading = ref(true)
const content = ref(undefined)
const selected = ref(disabledAutoShowTutorialChina.value || false)
const tab = ref(0)
const items = [
  { label: 'Thêm căn cước', type: 'passportchina' },
  { label: 'Nạp tiền nền tảng', type: 'paymentchina' },
]

watch(() => tab.value, () => get())
watch(() => selected.value, (val) => disabledAutoShowTutorialChina.value = val)

const get = async () => {
  try {
    loading.value = true

    const type = items[tab.value]['type']
    loading.value = true
    const get = await useAPI('config/public/article/get', { type: type })

    content.value = get
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => {
  setTimeout(get, 1)
})
</script>