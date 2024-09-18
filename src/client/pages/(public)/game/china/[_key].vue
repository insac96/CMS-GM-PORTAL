<template>
  <div v-if="!!game">
    <!-- Info -->
    <div class="grid grid-cols-12 gap-2 md:gap-4 mb-4">
      <div class="md:col-span-8 col-span-12">
        <DataGameReview />
      </div>

      <UiContent 
        class="md:col-span-4 col-span-12" 
        :title="`[${game.code}] ${game.name}`" 
        :sub="game.description"
        no-dot
      >
        <!-- Tab -->
        <UiFlex wrap class="gap-1">
          <NuxtLink to="/game/china">
            <UBadge color="gray" variant="soft">Game China</UBadge>
          </NuxtLink>
          
          <NuxtLink :to="`/game/platform/${game.platform.key}`">
            <UBadge color="gray" variant="soft">{{ game.platform.name }}</UBadge>
          </NuxtLink>
          
          <NuxtLink :to="`/game/category/${game.category.key}`">
            <UBadge color="gray" variant="soft">{{ game.category.name }}</UBadge>
          </NuxtLink>
        </UiFlex>

        <!-- Statistic -->
        <UiFlex class="my-4" justify="center">
          <UiFlex type="col" class="grow border-r">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.view) }}</UiText>
            <UiText color="gray" size="xs">Lượt xem</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow border-l">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.play) }}</UiText>
            <UiText color="gray" size="xs">Lượt chơi</UiText>
          </UiFlex>
        </UiFlex>

        <!-- Button -->
        <UButton icon="i-bx-play" class="grow justify-center" size="lg" block @click="action('play')">Chơi Ngay</UButton>
      </UiContent>
    </div>

    <!--Content-->
    <div class="grid grid-cols-12">
      <div class="xl:col-span-8 col-span-12">
        <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-1"></UTabs>

        <div class="py-4">
          <NuxtPage :game="game" />
        </div>
      </div>
    </div>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close :ui="{ width: 'max-w-[280px] sm:max-w-[280px]' }">
      <UiContent no-dot title="Hệ Điều Hành" sub="Chọn hệ điều hành muốn chơi" class="p-4">
        <UiFlex class="gap-1 mb-4" justify="center" wrap>
          <UButton icon="i-bxs-window-alt" :disabled="loading.play" square color="gray" size="xl" :ui="{square: { xl: 'p-7' }, icon: { size: { xl: 'h-8 w-8' }}}" @click="playUrl('web')" />
          <UButton icon="i-bxl-android" :disabled="loading.play" square color="green" size="xl" :ui="{square: { xl: 'p-7' }, icon: { size: { xl: 'h-8 w-8' }}}" @click="playUrl('android')" />
          <UButton icon="i-bxl-apple" :disabled="loading.play" square color="black" size="xl" :ui="{square: { xl: 'p-7' }, icon: { size: { xl: 'h-8 w-8' }}}" @click="playUrl('ios')" />
          <UButton icon="i-bxl-windows" :disabled="loading.play" square color="blue" size="xl" :ui="{square: { xl: 'p-7' }, icon: { size: { xl: 'h-8 w-8' }}}" @click="playUrl('windows')" />
        </UiFlex>

        <UiFlex justify="end">
          <UButton color="gray" :disabled="loading.play" @click="modal.play = false">Đóng</UButton>
        </UiFlex>
      </UiContent> 
    </UModal>
  </div>
</template>

<script setup>
const { miniMoney } = useMoney()
const authStore = useAuthStore()
const route = useRoute()
const game = ref(undefined)

const loading = ref({
  page: true,
  play: false
})
const modal = ref({
  play: false,
})

const tabRouter = {
  'game-china-_key': 0,
  'game-china-_key-payment': 1
}
const tab = ref(tabRouter[route.name])
const tabs = [{
  label: 'Tin tức',
  icon: 'i-bx-news',
  to: ''
},{
  label: 'Nạp game',
  icon: 'i-bx-shopping-bag',
  disabled: false,
  to: 'payment'
}]

watch(() => authStore.isLogin, () => getGame())

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/china/${route.params._key}/${tabSelect.to}`)
}

const action = (key) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value[key] = true
}
 
const playUrl = async (type) => {
  try {
    loading.value.play = true

    const data = await useAPI('game/china/public/project/play', { 
      game: game.value.code,
      type: type
    })
    loading.value.play = false
    modal.value.play = false

    useTo().openNewTab(data.url)
  }
  catch(e){
    loading.value.play = false
  }
}

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/china/public/project/key', {
      key: route.params._key
    })

    game.value = data
    loading.value.page = false
  }
  catch(e){
    loading.value.page = false
  }
}
getGame()
</script>