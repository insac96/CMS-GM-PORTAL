<template>
  <div>
    <UiFlex justify="between" class="mb-6">
      <UiText class="font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl text-lg">
        Game <span class="text-primary">China</span> Mới Nhất
      </UiText>

      <UButton size="xs" color="gray" @click="navigateTo('/game/china')">Xem Thêm</UButton>
    </UiFlex>

    <DataGameList :loading="loading" :list="list" os="china" :max="6"/>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const page = ref({
  current: 1,
  total: 0
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/china/public/list/latest', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>