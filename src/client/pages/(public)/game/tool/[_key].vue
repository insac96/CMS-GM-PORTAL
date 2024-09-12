<template>
  <div v-if="!!game">
    <!-- Info -->
    <div class="grid grid-cols-12 gap-2 md:gap-4 mb-4">
      <div class="md:col-span-8 col-span-12">
        <DataGameReview />
      </div>

      <UiContent 
        class="md:col-span-4 col-span-12" 
        :title="`[${game.short_name}] ${game.name}`" 
        :sub="game.description"
        no-dot
      >
        <!-- Tab -->
        <UiFlex wrap class="gap-1">
          <NuxtLink to="/game/tool">
            <UBadge color="gray" variant="soft">Game Tool</UBadge>
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

        <!-- Mini Info -->
        <div class="my-4">
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Ra mắt</UiText>
            <UiText weight="semibold" size="sm">{{ useDayJs().fromTime(game.createdAt) }}</UiText>
          </UiFlex>
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Tool nạp</UiText>
            <UiText weight="semibold" size="sm" :color="!!game.tool.recharge ? 'green' : null">{{ !!game.tool.recharge ? 'Đã mua' : toMoney(game.price.recharge)+'đ' }}</UiText>
          </UiFlex>
          <UiFlex justify="between">
            <UiText weight="semibold" color="gray" size="sm">Tool thư</UiText>
            <UiText weight="semibold" size="sm" :color="!!game.tool.mail ? 'green' : null">{{ !!game.tool.mail ? 'Đã mua' : toMoney(game.price.mail)+'đ' }}</UiText>
          </UiFlex>
        </div>

        <!-- Alert -->
        <UAlert class="my-4" color="gray" variant="soft" description="Nếu không mua tool, bạn vẫn có thể chơi bình thường"/>

        <!-- Button -->
        <UiFlex class="gap-1">
          <UButton icon="i-bx-play" class="grow justify-center" size="lg" @click="action('play')">Chơi Ngay</UButton>
          <UButton icon="i-bx-cart" class="grow justify-center" size="lg" @click="action('buy')" color="gray" :disabled="!!game.tool.recharge && !!game.tool.mail">Mua Tool</UButton>
        </UiFlex>
      </UiContent>
    </div>

    <!--Content-->
    <div>
      <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-1"></UTabs>
      <NuxtPage :game="game" />
    </div>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close :ui="{ width: 'max-w-[280px] sm:max-w-[280px]' }">
      <UiContent no-dot title="Hệ Điều Hành" sub="Chọn hệ điều hành muốn chơi" class="p-4">
        <UiFlex class="gap-1 mb-4" justify="center" wrap>
          <UButton icon="i-bxs-window-alt" :loading="loading.play" square color="gray" size="xl" :ui="{square: { xl: 'p-8' }}" @click="playUrl(game.play.web, 'web')" />
          <UButton icon="i-bxl-android" square color="green" size="xl" :ui="{square: { xl: 'p-8' }}" @click="playUrl(game.play.android, 'download')" />
          <UButton icon="i-bxl-apple" square color="black" size="xl" :ui="{square: { xl: 'p-8' }}" @click="playUrl(game.play.ios, 'download')" />
          <UButton icon="i-bxl-windows" square color="blue" size="xl" :ui="{square: { xl: 'p-8' }}" @click="playUrl(game.play.windows, 'download')" />
        </UiFlex>

        <UiFlex justify="end">
          <UButton color="gray" :disabled="loading.play" @click="modal.play = false">Đóng</UButton>
        </UiFlex>
      </UiContent> 
    </UModal>

    <!--Buy-->
    <UModal v-model="modal.buy" prevent-close>
      <UiContent no-dot title="Mua Tool" sub="Lựa chọn loại tool muốn mua" class="p-4">
        <UiFlex class="mb-4">
          <UCheckbox v-model="stateBuy.recharge" :color="!!game.tool.recharge ? 'green' : 'primary'" :disabled="!!game.tool.recharge" label="Nạp tiền" class="mr-auto" />
          <UiText weight="semibold" size="sm" :color="!!game.tool.recharge ? 'green' : null">{{ !!game.tool.recharge ? 'Đã mua' : toMoney(game.price.recharge)+'đ' }}</UiText>
        </UiFlex>

        <UiFlex class="mb-4">
          <UCheckbox v-model="stateBuy.mail" :color="!!game.tool.mail ? 'green' : 'primary'" :disabled="!!game.tool.mail" label="Gửi thư" class="mr-auto" />
          <UiText weight="semibold" size="sm" :color="!!game.tool.mail ? 'green' : null">{{ !!game.tool.mail ? 'Đã mua' : toMoney(game.price.mail)+'đ' }}</UiText>
        </UiFlex>

        <UiFlex class="mb-4">
          <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Đơn giá</UiText>
          <UiText weight="semibold" size="sm">{{ toMoney(totalPrice) }}đ</UiText>
        </UiFlex>

        <UiFlex justify="end" class="gap-1">
          <UButton :loading="loading.buy" @click="buyTool">Mua</UButton>
          <UButton color="gray" :disabled="loading.buy" @click="modal.buy = false">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { miniMoney, toMoney } = useMoney()
const authStore = useAuthStore()
const route = useRoute()
const game = ref(undefined)
const loading = ref({
  page: true,
  play: false,
  buy: false
})
const modal = ref({
  play: false,
  buy: false
})

const tab = ref(0)
const tabs = [{
  label: 'Tin tức',
  icon: 'i-bx-news',
  to: ''
},{
  label: 'Nạp game',
  icon: 'i-bx-shopping-bag',
  disabled: false,
  to: 'recharge'
},{
  label: 'Gửi thư',
  icon: 'i-bx-envelope',
  disabled: false,
  to: 'mail'
}]

const stateBuy = ref({
  recharge: false,
  mail: false
})

const totalPrice = computed(() => {
  let total = 0
  if(!game.value) return 0
  if(!game.value.tool.recharge && !!stateBuy.value.recharge) total = total + game.value.price?.recharge
  if(!game.value.tool.mail && !!stateBuy.value.mail) total = total + game.value.price?.mail
  return total
})

watch(() => authStore.isLogin, () => getGame())

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/tool/${route.params._key}/${tabSelect.to}`)
}

const action = (key) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value[key] = true
}
 
const playUrl = async (url, type) => {
  try {
    if(!url) throw useNotify().error('Trò chơi không hỗ trợ chơi trên nền tảng này')
    if(type == 'download') return navigateTo(url, { external: true })
    if(type == 'web'){
      loading.value.play = true
      const playUrl = await useAPI('game/public/project/vps/start', {
        game: game.value._id
      })

      loading.value.play = false
      navigateTo(playUrl, { external: true })
    }
  }
  catch(e){
    loading.value.play = false
  }
}

const buyTool = async () => {
  try {
    loading.value.buy = true
    const send = JSON.parse(JSON.stringify(stateBuy.value))
    send.game = game.value._id
    const data = await useAPI('game/tool/public/user/buy', send)

    stateBuy.value.recharge = data.recharge
    stateBuy.value.mail = data.mail
    loading.value.buy = false
  }
  catch(e){
    loading.value.buy = false
  }
}

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/tool/public/project/key', {
      key: route.params._key
    })

    game.value = data
    stateBuy.value.recharge = data.tool.recharge
    stateBuy.value.mail = data.tool.mail
    loading.value.page = false
  }
  catch(e){
    loading.value.page = false
  }
}
getGame()
</script>