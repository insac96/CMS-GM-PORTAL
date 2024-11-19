<template>
  <LoadingGameChinaKey v-if="!!loading.page"/>

  <div v-else>
    <!-- Info -->
    <div class="grid grid-cols-12 gap-2 md:gap-4 mb-4">
      <div class="2xl:col-span-8 col-span-12">
        <DataGameReview :review="game.image.review" :banner="game.image.banner" />
      </div>

      <UiContent 
        class="2xl:col-span-4 col-span-12" 
        :title="`[${game.code}] ${game.name}`" 
        :sub="game.description"
        no-dot
      >
        <template #more>
          <UButton 
            class="ml-auto"
            icon="i-bx-shield-quarter" 
            square size="xs"
            color="gray"
            @click="navigateTo(`/manage/@gm/china/${game._id}`)"
            v-if="!!authStore.isLogin && (!!authStore.isAdmin || (!!game.manager && !!game.manager.includes(authStore.profile._id)))"
          ></UButton>
        </template>

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
          <UiFlex type="col" class="grow">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.view) }}</UiText>
            <UiText color="gray" size="xs">Lượt xem</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow border-l border-r dark:border-gray-800">
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
            <UiText weight="semibold" color="gray" size="sm">Tỷ lệ nạp</UiText>
            <UiText weight="semibold" size="sm">1 : {{ game.rate.pay }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Quy đổi tệ</UiText>
            <UiText weight="semibold" size="sm">1 tệ = {{ configStore.config.yuan }} Xu</UiText>
          </UiFlex>
        </div>

        <!-- Button -->
        <UButton icon="i-bx-play" size="lg" block :loading="loading.account" @click="checkChinaAccount()" class="mb-1">Chơi Ngay</UButton>
        <UButton icon="i-bx-credit-card" size="lg" block @click="openPayment" color="rose" class="mb-1">Nạp Tiền Nền Tảng</UButton>
      </UiContent>
    </div>

    <!--Content-->
    <div class="grid grid-cols-12 gap-4">
      <div class="2xl:col-span-8 col-span-12">
        <UiFlex type="col" class="gap-1 mb-4">
          <UAlert title="Hỗ trợ" icon="i-bx-support" color="green" variant="soft" v-if="configStore.config.social.game.china">
            <template #description>
              Tham gia <b class="cursor-pointer text-primary underline decoration-1" @click="useTo().openNewTab(configStore.config.social.game.china)">nhóm Zalo Game China</b> để được hỗ trợ kịp thời
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>

          <UAlert title="Chú ý" icon="i-bxs-info-circle" color="primary" variant="soft">
            <template #description>
              Vui lòng đọc kỹ <b class="cursor-pointer underline decoration-1" @click="modal.tutorial = true">hướng dẫn</b> trước khi chơi và nạp tiền nền tảng để đảm bảo trải nghiệm trò chơi tốt nhất.
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>
        </UiFlex>

        <DataEmpty class="h-[300px]" text="Chưa có tin tức mới" v-if="!game.content || game.content == '<p></p>'" />
        <UiEditorContent :content="game.content" v-else />
      </div>

      <div class="2xl:col-span-4 col-span-12">
        <DataGameComment :game="game" os="china" class="mb-4"/>
        <DataGameRelated :platform="[game.platform._id]" :category="[game.category._id]" :skip="game._id" os="china"/>
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

    <!--Account-->
    <UModal v-model="modal.account" prevent-close>
      <UiContent no-dot title="China Account" sub="Xác nhận tài khoản game trung" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="loading.account" @click="modal.account = false"></UButton>
        </template>

        <UForm :state="stateChina" @submit="signChinaAccount">
          <UFormGroup label="Mật khẩu tài khoản">
            <UInput icon="i-bxs-lock" v-model="stateChina.password" type="password"/>
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" :loading="loading.account">Xác Nhận</UButton>
          </UiFlex>
        </UForm>
      </UiContent> 
    </UModal>

    <!--Payment-->
    <UModal v-model="modal.payment" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <DataGameChinaPayment
        :game="game" 
        @close="modal.payment = false" 
        class="p-4"
      /> 
    </UModal>

    <!--Tutorial-->
    <UModal v-model="modal.tutorial" :ui="{width: 'sm:max-w-[900px]'}">
      <DataGameChinaTutorial @close="modal.tutorial = false"/> 
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
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
  account: false
})
const modal = ref({
  tutorial: false,
  play: false,
  account: false,
  payment: false
})

const stateChina = ref({
  password: null
})

watch(() => authStore.isLogin, () => getGame())

const openPayment = async () => {
  if(!authStore.isLogin) return authStore.setModal(true)
  if(!game.value.user) return useNotify().error('Vui lòng chơi game trước khi nạp')
  modal.value.payment = true
}

const checkChinaAccount = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    loading.value.account = true

    const data = await useAPI('game/china/public/sign/check')
    loading.value.account = false

    if(!!data) return modal.value.play = true
    else return modal.value.account = true
  }
  catch(e){
    loading.value.account = false
  }
}

const signChinaAccount = async () => {
  try {
    loading.value.account = true
    await useAPI('game/china/public/sign/youxi', JSON.parse(JSON.stringify(stateChina.value)))

    loading.value.account = false
    modal.value.account = false
    modal.value.play = true
    stateChina.value.password = null
  }
  catch(e){
    loading.value.account = false
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

    getGame()
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

onMounted(() => {
  const disabledAutoShowTutorialChina = useCookie('disabled-auto-show-tutorial-china', runtimeConfig.public.cookieConfig)
  if(!disabledAutoShowTutorialChina.value) modal.value.tutorial = true
})
</script>