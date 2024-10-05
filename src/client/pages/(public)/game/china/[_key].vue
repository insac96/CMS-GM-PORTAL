<template>
  <LoadingGameChinaKey v-if="!!loading.page"/>

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
        <UButton icon="i-bx-play" size="lg" block :loading="loading.china" @click="checkChinaAccount()">Chơi Ngay</UButton>
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

    <!--Play-->
    <UModal v-model="modal.play" prevent-close>
      <UiContent no-dot title="Hệ Điều Hành" sub="Chọn hệ điều hành muốn chơi" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" square :disabled="loading.play" @click="modal.play = false"></UButton>
        </template>

        <UiFlex class="gap-1" justify="center" wrap>
          <UButton v-if="game.play.web" icon="i-bxs-window-alt" :disabled="loading.play" color="white" size="xl" @click="playUrl('web')">Web</UButton>
          <UButton v-if="game.play.android" icon="i-bxl-android" :disabled="loading.play" color="green" size="xl" @click="playUrl('android')">Android</UButton>
          <UButton v-if="game.play.ios" icon="i-bxl-apple" :disabled="loading.play" color="black" size="xl" @click="playUrl('ios')">Iphone</UButton>
          <UButton v-if="game.play.windows" icon="i-bxl-windows" :disabled="loading.play" color="blue" size="xl" @click="playUrl('windows')">Windows</UButton>
        </UiFlex>
      </UiContent> 
    </UModal>

    <!--Play-->
    <UModal v-model="modal.china" prevent-close>
      <UiContent no-dot title="China Account" sub="Xác nhận tài khoản game trung" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" square :disabled="loading.china" @click="modal.china = false"></UButton>
        </template>

        <UForm :state="stateChina" @submit="signChinaAccount">
          <UFormGroup label="Mật khẩu tài khoản">
            <UInput icon="i-bxs-lock" v-model="stateChina.password" type="password"/>
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" :loading="loading.china">Xác Nhận</UButton>
          </UiFlex>
        </UForm>
      </UiContent> 
    </UModal>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const { miniMoney } = useMoney()
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
  title: () => `${game.value.name} - Game China - ${configStore.config.name}`,
  ogTitle: () => `${game.value.name} - Game China - ${configStore.config.name}`,
  description: () => game.value.description,
  ogDescription: () => game.value.description,
  ogImage: () => img(game.value.image.banner), 
  ogImageAlt: () => game.value.name,
})

const loading = ref({
  page: true,
  play: false,
  china: false
})
const modal = ref({
  play: false,
  china: false
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

const stateChina = ref({
  password: null
})

watch(() => authStore.isLogin, () => getGame())

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/china/${route.params._key}/${tabSelect.to}`)
}

const checkChinaAccount = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    loading.value.china = true

    const data = await useAPI('game/china/public/sign/check')
    loading.value.china = false

    if(!!data) return modal.value.play = true
    else return modal.value.china = true
  }
  catch(e){
    loading.value.china = false
  }
}

const signChinaAccount = async () => {
  try {
    loading.value.china = true
    await useAPI('game/china/public/sign/youxi', JSON.parse(JSON.stringify(stateChina.value)))

    loading.value.china = false
    modal.value.china = false
    modal.value.play = true
    stateChina.value.password = null
  }
  catch(e){
    loading.value.china = false
  }
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
    return false
  }
}
getGame()
</script>