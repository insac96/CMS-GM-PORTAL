<template>
  <div v-if="list.length > 0">
    <UiFlex justify="between" class="mb-6">
      <UiText class="font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl text-lg">
        Game <span class="text-primary">China</span> Nổi Bật
      </UiText>

      <UButton size="xs" color="gray" @click="navigateTo('/game/china')">Xem Thêm</UButton>
    </UiFlex>
    
    <DataGameList :loading="loading" :list="list" os="china" max="4"/>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/china/public/list/latest')

    list.value = data
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>