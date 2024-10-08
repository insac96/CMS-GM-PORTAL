<template>
  <LoadingGameToolKey v-if="!!loading.page"/> 

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
            <UiText weight="semibold" color="gray" size="sm">Tool nạp</UiText>
            <UiText weight="semibold" size="sm" v-if="!game.tool.recharge">{{ toMoney(game.price.recharge)+'đ' }}</UiText>
            <UiFlex class="gap-1" v-else>
              <UiIcon name="i-bxs-check-circle" size="4" color="green" />
              <UiText weight="semibold" size="sm" color="green">Đã mua</UiText>
            </UiFlex>
            
          </UiFlex>
          <UiFlex justify="between">
            <UiText weight="semibold" color="gray" size="sm">Tool thư</UiText>
            <UiText weight="semibold" size="sm" v-if="!game.tool.mail">{{ toMoney(game.price.mail)+'đ' }}</UiText>
            <UiFlex class="gap-1" v-else>
              <UiIcon name="i-bxs-check-circle" size="4" color="green" />
              <UiText weight="semibold" size="sm" color="green">Đã mua</UiText>
            </UiFlex>
          </UiFlex>
        </div>

        <!-- Alert -->
        <!-- <UAlert class="my-4" icon="i-bx-game" title="Bạn vẫn có thể chơi trò chơi mà không cần phải mua tool" :ui="{
          color: { white: { solid: 'bg-gray-100' }}
        }"/> -->

        <!-- Button -->
        <UiFlex class="gap-1">
          <UButton icon="i-bx-play" class="grow justify-center" size="lg" @click="action('play')">Chơi Ngay</UButton>
          <UButton icon="i-bx-cart" class="grow justify-center" size="lg" @click="action('buy')" color="gray" :disabled="!!game.tool.recharge && !!game.tool.mail">Mua Tool</UButton>
        </UiFlex>
      </UiContent>
    </div>

    <!--Content-->
    <div class="grid grid-cols-12 gap-4">
      <div class="xl:col-span-8 md:col-span-12 col-span-12">
        <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-4"></UTabs>
        
        <NuxtPage :game="game" />
      </div>

      <div class="xl:col-span-4 md:col-span-12 col-span-12">
        <DataGameRelated :platform="[game.platform._id]" :category="[game.category._id]" :skip="game._id" os="tool"/>
      </div>
    </div>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close>
      <UiContent no-dot title="Hệ Điều Hành" sub="Chọn hệ điều hành muốn chơi" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="loading.play" @click="modal.play = false"></UButton>
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

    <!--Buy Tool-->
    <UModal v-model="modal.buy" prevent-close>
      <DataGameToolBuy :game="game" @close="modal.buy = false" @done="doneBuyTool"></DataGameToolBuy>
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
  title: () => `${game.value.name} - Game Tool - ${configStore.config.name}`,
  ogTitle: () => `${game.value.name} - Game Tool - ${configStore.config.name}`,
  description: () => game.value.description,
  ogDescription: () => game.value.description,
  ogImage: () => img(game.value.image.banner), 
  ogImageAlt: () => game.value.name,
})

const loading = ref({
  page: true,
  play: false
})

const modal = ref({
  buy: false,
  play: false,
})

const tabRouter = {
  'game-tool-_key': 0,
  'game-tool-_key-recharge': 1,
  'game-tool-_key-mail': 2
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
  to: 'recharge'
},{
  label: 'Gửi thư',
  icon: 'i-bx-envelope',
  disabled: false,
  to: 'mail'
}]

watch(() => authStore.isLogin, (val) => getGame())

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/tool/${route.params._key}/${tabSelect.to}`)
}

const action = (key) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value[key] = true
}

const doneBuyTool = (state) => {
  game.value.tool.recharge = state.recharge
  game.value.tool.mail = state.mail
  modal.value.buy = false
}
 
const playUrl = async (type) => {
  try {
    loading.value.play = true

    const data = await useAPI('game/tool/public/project/play/start', { 
      game: game.value.code,
      type: type
    })

    loading.value.play = false
    modal.value.play = false

    // Play In Web
    if(!!data.token){
      const path = `/game/tool/play?token=${data.token}&game=${game.value.code}`
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

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/tool/public/project/key', {
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