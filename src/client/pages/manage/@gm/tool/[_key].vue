<template>
  <div v-if="!!game">
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="md:col-span-5 col-span-12">
        <DataGameReview :review="game.image.review" :banner="game.image.banner" />
      </div>

      <div class="md:col-span-7 col-span-12">
        <UiContent :title="`[${game.code}] ${game.name}`" :sub="game.description" no-dot>
          <template #more>
            <UiFlex class="gap-1 ml-auto">
              <UDropdown :items="actions(game)">
                <UButton color="gray" icon="i-bx-cog" />
              </UDropdown>

              <UDropdown :items="menus(game)">
                <UButton color="gray" icon="i-bx-menu-alt-right"/>
              </UDropdown>
            </UiFlex>
          </template>

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

          <div class="my-4">
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">Doanh thu</UiText>
              <UiText weight="semibold" size="sm">{{ toMoney(game.statistic.revenue) }}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3" v-if="!!authStore.isAdmin">
              <UiText weight="semibold" color="gray" size="sm">IP Game</UiText>
              <UiText weight="semibold" size="sm">{{ game.ip || '...' }}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">Cập nhật cuối</UiText>
              <UiText weight="semibold" size="sm">{{ useDayJs().fromTime(game.updatedAt) }}</UiText>
            </UiFlex>
          </div>
        </UiContent>
      </div>
    </div>

    <div>
      <NuxtPage :game="game" />
    </div>

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="p-4">
        <UFormGroup label="Mô tả ngắn">
          <UInput v-model="stateEditInfo.description" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEditInfo.display" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <SelectPin v-model="stateEditInfo.pin" class="mr-auto" :disabled="!authStore.isAdmin" />
          
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editInfo = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Image -->
    <UModal v-model="modal.editImage" preventClose>
      <UForm :state="stateEditImage" @submit="editImageAction" class="p-4">
        <UFormGroup label="Banner (16:9)">
          <UiUploadImage v-model="stateEditImage.banner">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEditImage.banner" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup label="Logo (1:1)">
          <UiUploadImage v-model="stateEditImage.logo">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEditImage.logo" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup label="Icon (1:1)">
          <UiUploadImage v-model="stateEditImage.icon">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEditImage.icon" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup label="Reviews">
          <UiUploadImages v-model="stateEditImage.review"></UiUploadImages>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editImage = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit API -->
    <UModal v-model="modal.editAPI" preventClose>
      <UForm :state="stateEditAPI" @submit="editAPIAction" class="p-4">
        <UFormGroup label="Địa chỉ IP">
          <UInput v-model="stateEditAPI.ip" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Port API">
          <UInput v-model="stateEditAPI.port" type="number" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Mã ủy quyền">
          <UInput v-model="stateEditAPI.secret" :disabled="!authStore.isAdmin"/>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UiFlex class="mr-auto">
            <UToggle v-model="stateEditAPI.paygame" :disabled="!authStore.isAdmin" class="mr-2" />
            <UiText size="sm" weight="semibold" color="gray" text="Nạp trong game" />
          </UiFlex>
          
          <UButton type="submit" :loading="loading.edit" :disabled="!authStore.isAdmin">Sửa</UButton>
          <UButton color="gray" @click="modal.editAPI = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Play -->
    <UModal v-model="modal.editPlay" preventClose>
      <UForm :state="stateEditPlay" @submit="editPlayAction" class="p-4">
        <UFormGroup label="Link chơi Web">
          <UInput v-model="stateEditPlay.web" />
        </UFormGroup>

        <UFormGroup label="Linh Tải Android">
          <UInput v-model="stateEditPlay.android" />
        </UFormGroup>

        <UFormGroup label="Linh Tải IOS">
          <UInput v-model="stateEditPlay.ios" />
        </UFormGroup>

        <UFormGroup label="Linh Tải Windows">
          <UInput v-model="stateEditPlay.windows" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editPlay = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Price -->
    <UModal v-model="modal.editPrice" preventClose>
      <UForm :state="stateEditPrice" @submit="editPriceAction" class="p-4">
        <UFormGroup label="Giá Tool nạp">
          <UInput v-model="stateEditPrice.recharge" type="number" />
        </UFormGroup>

        <UFormGroup label="Giá Tool gửi thư">
          <UInput v-model="stateEditPrice.mail" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editPrice = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Content -->
    <UModal v-model="modal.editContent" preventClose :ui="{width: 'sm:max-w-[calc(90%)] md:max-w-[calc(80%)] lg:max-w-4xl'}">
      <UForm :state="stateEditContent" @submit="editContentAction" class="p-4">
        <UiEditor v-model="stateEditContent.content"></UiEditor>
        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Lưu</UButton>
          <UButton color="gray" @click="modal.editContent = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'gm-tool',
  middleware: 'gm'
})

const authStore = useAuthStore()
const route = useRoute()
const { miniMoney, toMoney } = useMoney()

// Game Data
const game = ref(undefined)

// Loading
const loading = ref({
  game: true,
  edit: false
})

// State
const stateEditInfo = ref({
  _id: null,
  platform: null,
  category: null,
  name: null,
  code: null,
  description: null,
  pin: null,
  display: null,
})
const stateEditImage = ref({
  _id: null,
  banner: null,
  logo: null,
  icon: null,
  review: null,
})
const stateEditAPI = ref({
  _id: null,
  ip: null,
  port: null,
  mobile: null,
  paygame: null,
  secret: null
})
const stateEditPlay = ref({
  _id: null,
  web: null,
  windows: null,
  android: null,
  ios: null,
})
const stateEditPrice = ref({
  _id: null,
  recharge: null,
  mail: null
})
const stateEditContent = ref({
  _id: null,
  content: null
})
  
// Modal
const modal = ref({
  editInfo: false,
  editImage: false,
  editAPI: false,
  editPlay: false,
  editPrice: false,
  editContent: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditInfo.value).forEach(key => stateEditInfo.value[key] = row[key])
      stateEditInfo.value.category = row.category._id
      stateEditInfo.value.platform = row.platform._id
      modal.value.editInfo = true
    }
  },{
    label: 'Sửa hình ảnh',
    icon: 'i-bx-image-add',
    click: () => {
      Object.keys(stateEditImage.value).forEach(key => stateEditImage.value[key] = row.image[key])
      stateEditImage.value._id = row._id
      modal.value.editImage = true
    }
  },{
    label: 'Sửa tin tức',
    icon: 'i-bxs-book-content',
    click: async () => {
      try {
        const content = await useAPI('game/tool/manage/project/get/content', { _id: row._id })
        stateEditContent.value._id = row._id
        stateEditContent.value.content = content
        modal.value.editContent = true
      }
      catch (e) {
        return
      }
    }
  },{
    label: 'Sửa API Game',
    icon: 'i-bx-planet',
    click: () => {
      Object.keys(stateEditAPI.value).forEach(key => stateEditAPI.value[key] = row[key])
      modal.value.editAPI = true
    }
  },{
    label: 'Sửa link chơi',
    icon: 'i-bx-link',
    click: () => {
      Object.keys(stateEditPlay.value).forEach(key => stateEditPlay.value[key] = row.play[key])
      stateEditPlay.value._id = row._id
      modal.value.editPlay = true
    }
  },{
    label: 'Sửa giá Tool',
    icon: 'i-bx-credit-card',
    click: () => {
      Object.keys(stateEditPrice.value).forEach(key => stateEditPrice.value[key] = row.price[key])
      stateEditPrice.value._id = row._id
      modal.value.editPrice = true
    }
  }]
]

// Menu
const menus = (row) => [
  [
    // {
    //   label: 'Thống kê',
    //   icon: 'i-bx-stats',
    //   click: () => navigateTo(`/manage/@gm/private/${row.key}`)
    // },
    {
      label: 'Người chơi',
      icon: 'i-bx-group',
      click: () => navigateTo(`/manage/@gm/tool/${row.key}`)
    },{
      label: 'Gói nạp',
      icon: 'i-bx-cylinder',
      click: () => navigateTo(`/manage/@gm/tool/${row.key}/recharge`)
    },{
      label: 'Vật phẩm',
      icon: 'i-bx-pyramid',
      click: () => navigateTo(`/manage/@gm/tool/${row.key}/item`)
    },
  ],[
    {
      label: 'Nhân vật',
      icon: 'i-bxs-user-account',
      click: () => navigateTo(`/manage/@gm/tool/${row.key}/game/roles`)
    },
    // {
    //   label: 'GM Thư',
    //   icon: 'i-bx-mail-send',
    //   click: () => navigateTo(`/manage/@gm/private/${row.key}/game/mail`)
    // }
  ]
]

const editInfoAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/project/edit/info', JSON.parse(JSON.stringify(stateEditInfo.value)))

    loading.value.edit = false
    modal.value.editInfo = false
    getGame()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editImageAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/project/edit/image', JSON.parse(JSON.stringify(stateEditImage.value)))

    loading.value.edit = false
    modal.value.editImage = false
    getGame()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editAPIAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/project/edit/api', JSON.parse(JSON.stringify(stateEditAPI.value)))

    loading.value.edit = false
    modal.value.editAPI = false
    getGame()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editPlayAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/project/edit/play', JSON.parse(JSON.stringify(stateEditPlay.value)))

    loading.value.edit = false
    modal.value.editPlay = false
    getGame()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editPriceAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/project/edit/price', JSON.parse(JSON.stringify(stateEditPrice.value)))

    loading.value.edit = false
    modal.value.editPrice = false
    getGame()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editContentAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/tool/manage/project/edit/content', JSON.parse(JSON.stringify(stateEditContent.value)))

    loading.value.edit = false
    modal.value.editContent = false
    getGame()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const getGame = async () => {
  try {
    loading.value.game = true
    const data = await useAPI('game/tool/manage/project/key', { key: route.params._key })

    game.value = data
    loading.value.game = false
  }
  catch(e){
    return false
  }
}

getGame()
</script>