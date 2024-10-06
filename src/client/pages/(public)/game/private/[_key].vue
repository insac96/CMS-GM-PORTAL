<template>
  <LoadingGamePrivateKey v-if="!!loading.page"/> 

  <div v-else>
    <!-- Info -->
    <div class="grid grid-cols-12 gap-2 md:gap-4 mb-4">
      <div class="md:col-span-8 col-span-12">
        <DataGameReview :review="game.image.review" :banner="game.image.banner" />
      </div>

      <UiContent 
        class="md:col-span-4 col-span-12" 
        :title="`[${game.code}] ${game.name}`" 
        :sub="game.description"
        no-dot
      >
        <!-- Tab -->
        <UiFlex wrap class="gap-1">
          <NuxtLink to="/game/private">
            <UBadge color="gray" variant="soft">Game Private</UBadge>
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
          <UiFlex type="col" class="grow">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.view) }}</UiText>
            <UiText color="gray" size="xs">Lượt xem</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow border-l border-r">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.play) }}</UiText>
            <UiText color="gray" size="xs">Lượt chơi</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.user) }}</UiText>
            <UiText color="gray" size="xs">Người chơi</UiText>
          </UiFlex>
        </UiFlex>

        <!-- Mini Info -->
        <div class="my-4">
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Ra mắt</UiText>
            <UiText weight="semibold" size="sm">{{ useDayJs().fromTime(game.createdAt) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Khuyến mãi nạp</UiText>
            <UiText weight="semibold" size="sm">+{{ useRate().data(game.rate.payment).number }}%</UiText>
          </UiFlex>
          
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Giảm giá cửa hàng</UiText>
            <UiText weight="semibold" size="sm">-{{ useRate().data(game.rate.shop).number }}%</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-3" v-if="!!game.user">
            <UiText weight="semibold" color="gray" size="sm">GCoin của bạn</UiText>
            <UiText weight="semibold" size="sm">{{ toMoney(game.user.currency.gcoin) }}</UiText>
          </UiFlex>
        </div>

        <!-- Button -->
        <UButton icon="i-bx-play" block size="lg" class="mb-1" @click="regGame" :loading="loading.reg" v-if="!game.user">Đăng Ký Chơi</UButton>
        <div v-else>
          <UButton icon="i-bx-play" block size="lg" class="mb-1" @click="action('play')">Chơi Ngay</UButton>
          <UiFlex class="gap-1">
            <UButton icon="i-bx-credit-card" class="grow justify-center" size="lg" @click="action('payment')" color="rose">GCoin</UButton>
            <UButton icon="i-bx-barcode" class="grow justify-center" size="lg" @click="action('giftcode')" color="black">Giftcode</UButton>
          </UiFlex>
        </div>
      </UiContent>
    </div>

    <!--Content-->
    <div class="grid grid-cols-12">
      <div class="xl:col-span-8 col-span-12">
        <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block"></UTabs>

        <div class="py-4">
          <NuxtPage :game="game" />
        </div>
      </div>
    </div>

    <!--Payment-->
    <UModal v-model="modal.payment" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <DataGamePrivatePayment 
        :game="game" 
        @close="modal.payment = false" 
        @done="donePayment"
        class="p-4"
      /> 
    </UModal>

    <!--Giftcode-->
    <UModal v-model="modal.giftcode" prevent-close>
      <DataGamePrivateGiftcode
        :game="game" 
        @close="modal.giftcode = false" 
        class="p-4"
      /> 
    </UModal>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close>
      <UiContent no-dot title="Hệ Điều Hành" sub="Chọn hệ điều hành muốn chơi" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" square :disabled="loading.play" @click="modal.play = false"></UButton>
        </template>

        <UAlert 
          v-if="!game.play.web && !game.play.android && !game.play.ios && !game.play.windows"
          color="green" 
          variant="soft" 
          icon="i-bx-bell" 
          title="Thông Báo"
          description="Trò chơi đang bảo trì, vui lòng quay lại sau"
        ></UAlert>

        <UiFlex class="gap-1" justify="center" wrap v-else>
          <UButton v-if="game.play.web" icon="i-bxs-window-alt" :disabled="loading.play" color="white" size="xl" @click="playUrl('web')">Web</UButton>
          <UButton v-if="game.play.android" icon="i-bxl-android" :disabled="loading.play" color="green" size="xl" @click="playUrl('android')">Android</UButton>
          <UButton v-if="game.play.ios" icon="i-bxl-apple" :disabled="loading.play" color="black" size="xl" @click="playUrl('ios')">Iphone</UButton>
          <UButton v-if="game.play.windows" icon="i-bxl-windows" :disabled="loading.play" color="blue" size="xl" @click="playUrl('windows')">Windows</UButton>
        </UiFlex>
      </UiContent> 
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const { miniMoney, toMoney } = useMoney()
const { openNewTab } = useTo()
const { img } = useMakeLink()
const authStore = useAuthStore()
const route = useRoute()
const game = ref({
  name: '',
  description: '',
  image: {
    banner: null
  }
})

useSeoMeta({
  title: () => `${game.value.name} - Game Private - ${configStore.config.name}`,
  ogTitle: () => `${game.value.name} - Game Private - ${configStore.config.name}`,
  description: () => game.value.description,
  ogDescription: () => game.value.description,
  ogImage: () => img(game.value.image.banner), 
  ogImageAlt: () => game.value.name,
})

watch(() => authStore.isLogin, (val) => getGame())

const loading = ref({
  page: true,
  reg: false,
  play: false,
  payment: false,
  giftcode: false
})

const modal = ref({
  play: false,
  payment: false,
  giftcode: false
})

const tabRouter = {
  'game-private-_key': 0,
  'game-private-_key-shop': 1,
  'game-private-_key-event': 2
}
const tab = ref(tabRouter[route.name])
const tabs = [{
  label: 'Tin tức',
  icon: 'i-bx-news',
  to: ''
},{
  label: 'Cửa hàng',
  icon: 'i-bx-store',
  to: 'shop'
},{
  label: 'Sự kiện',
  icon: 'i-bx-calendar',
  to: 'event'
}]

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/private/${route.params._key}/${tabSelect.to}`)
}

const action = (key) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value[key] = true
}

const donePayment = async () => {
  await authStore.setAuth()
  await getUser()
}

const playUrl = async (type) => {
  try {
    loading.value.play = true

    const data = await useAPI('game/private/public/project/play/start', { 
      game: game.value.code,
      type: type
    })

    loading.value.play = false
    modal.value.play = false

    // Play In Web
    if(!!data.token){
      const path = `/game/private/play?token=${data.token}&game=${game.value.code}`
      const link = `http://run.${runtimeConfig.public.domain}${path}`
      return openNewTab(!!runtimeConfig.public.dev ? path : link)
    }

    // Download
    if(!!data.download){
      return openNewTab(data.download)
    }
  }
  catch(e){
    loading.value.play = false
  }
}

const regGame = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    loading.value.reg = true
    const data = await useAPI('game/private/public/project/reg', {
      game: game.value.code
    })

    game.value.user = data
    loading.value.reg = false
  }
  catch(e){
    loading.value.reg = false
  }
}

const getUser = async () => {
  try {
    const data = await useAPI('game/private/public/user/get', {
      game: game.value.code
    })

    game.value.user = data
  }
  catch(e){
    return false
  }
}

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/private/public/project/key', {
      key: route.params._key
    })

    game.value = data
    loading.value.page = false
  }
  catch(e){
    return false
  }
}
getGame()
</script>