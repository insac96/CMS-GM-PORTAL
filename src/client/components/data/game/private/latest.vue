<template>
  <div v-if="list.length > 0">
    <UiText align="center" class="font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl text-xl mb-6">
      Game <span class="text-primary">Private</span> Nổi Bật
    </UiText>
    
    <DataGameList :loading="loading" :list="list" os="private" max="4" />

    <UiFlex justify="center" class="mt-4">
      <UButton size="sm" color="gray" @click="navigateTo('/game/private')">Xem Thêm</UButton>
    </UiFlex>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/list/latest')

    list.value = data
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>