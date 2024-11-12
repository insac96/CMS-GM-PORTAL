<template>
  <UiContent title="Thông Báo" sub="Các thông tin hoặc chương trình khuyến mãi mới" class="p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="emits('close')"></UButton>
    </template>

    <div class="max-h-[70vh] overflow-y-auto mb-4">
      <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !content"></DataEmpty>
      <UiEditorContent :content="content" v-else />
    </div>
  </UiContent>
</template>

<script setup>
const emits = defineEmits(['close'])
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

onMounted(() => {
  setTimeout(get, 1)
})
</script>