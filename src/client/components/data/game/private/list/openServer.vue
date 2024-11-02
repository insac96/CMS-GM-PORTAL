<template>
  <div>
    <DataEmpty :loading="loading" text="Chưa có thông tin máy chủ mời" class="min-h-[300px]" v-if="!!loading || list.length == 0" />

    <UiFlex type="col" class="divide-y divide-gray-100 dark:divide-gray-800" v-else>
      <UiFlex v-for="(item, index) in list" :key="index" class="w-full gap-4 py-2">
        <UAvatar :src="item.game.image?.icon" :alt="item.game.code" />

        <div class="grow">
          <NuxtLink :to="`/game/private/${item.game.key}`" @click="emits('to')">
            <UiText color="gray" weight="semibold" class="line-clamp-2 text-xs sm:text-sm hover:text-primary hover:dark:text-primary mb-0.5">
              {{ item.game.name }}
            </UiText>
          </NuxtLink>
          
          <UiFlex class="gap-1">
            <UBadge color="gray" size="xs" variant="soft" class="capitalize">{{ item.server_name }}</UBadge>

            <UBadge color="gray" size="xs" variant="soft">{{ useDayJs().displayFull(item.opentime) }}</UBadge>
          </UiFlex>
        </div>

        <NuxtLink :to="`/game/private/${item.game.key}`" @click="emits('to')" v-if="!noIcon">
          <UButton size="2xs" color="gray" icon="i-bx-play" square></UButton>
        </NuxtLink>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 9,
  current: 1,
  total: 0
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/list/openserver', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>