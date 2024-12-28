<template>
  <div>
    <UDropdown :items="actions(props.game)">
      <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
    </UDropdown>

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="p-4">
        <UFormGroup label="Nền tảng">
          <SelectGamePlatform v-model="stateEditInfo.platform" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectGameCategory v-model="stateEditInfo.category" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateEditInfo.name" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateEditInfo.code" :disabled="!authStore.isAdmin" />
        </UFormGroup>

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

    <!-- Modal Edit Manager -->
    <UModal v-model="modal.editManager" preventClose>
      <UForm :state="stateEditManager" @submit="editManagerAction" class="p-4">
        <UFormGroup>
          <SelectUsers v-model="stateEditManager.manager" :type="1" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editManager = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Open Server -->
    <UModal v-model="modal.editOpenServer" preventClose :ui="{width: 'sm:max-w-[800px]' }">
      <UiContent title="Lịch mở máy chủ" sub="Chỉnh sửa lịch khai mở máy chủ" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.editOpenServer = false"></UButton>
        </template>

        <ManageGamePrivateOpenServer :game="stateEditOpenServer._id" />
      </UiContent>
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
          <UiFlex class="mr-auto gap-1" type="col" items="start">
            <UiFlex>
              <UToggle v-model="stateEditAPI.paygame" :disabled="!authStore.isAdmin" />
              <UiText size="sm" weight="semibold" color="gray" text="Nạp trong game" class="ml-2" />
            </UiFlex>

            <UiFlex>
              <UToggle v-model="stateEditAPI.open" :disabled="!authStore.isAdmin" />
              <UiText size="sm" weight="semibold" color="gray" text="Khai mở" class="ml-2" />
            </UiFlex>
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

    <!-- Modal Edit Rate -->
    <UModal v-model="modal.editRate" preventClose>
      <UForm :state="stateEditRate" @submit="editRateAction" class="p-4">
        <UFormGroup label="Giảm giá cửa hàng mặc định">
          <UInput v-model="stateEditRate.shop.default" type="number" placeholder="Tỷ lệ (%)" />
        </UFormGroup>

        <UFormGroup label="Giảm giá cửa hàng có thời hạn">
          <UiFlex class="gap-1">
            <UInput v-model="stateEditRate.shop.limit.number" type="number" class="grow" placeholder="Tỷ lệ (%)" />
            <SelectDate v-model="stateEditRate.shop.limit.expired" time class="grow" />
          </UiFlex>
        </UFormGroup>

        <UFormGroup label="Giảm giá VIP tháng">
          <UInput v-model="stateEditRate.shop.vip.month" type="number" placeholder="Tỷ lệ (%)" />
        </UFormGroup>

        <UFormGroup label="Giảm giá VIP trọn đời">
          <UInput v-model="stateEditRate.shop.vip.forever" type="number" placeholder="Tỷ lệ (%)" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editRate = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
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

    <!-- Modal Edit Collab -->
    <UModal v-model="modal.editCollab" preventClose>
      <UForm :state="stateEditCollab" @submit="editCollabAction" class="p-4">
        <UFormGroup label="Tỷ lệ hoa hồng">
          <UInput v-model="stateEditCollab.collab.commission" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editCollab = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!--Modal Reset-->
    <UModal v-model="modal.reset" preventClose>
      <UiContent title="Reset trò chơi" class="p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="orange" variant="soft">
          <template #description>
            Bạn chắc chắn muốn reset trò chơi này ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="resetAction" :loading="loading.reset" color="orange">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.reset = false" :disabled="loading.reset" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <!--Modal Del-->
    <UModal v-model="modal.del" preventClose>
      <UiContent title="Xóa trò chơi" class="p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="red" variant="soft">
          <template #description>
            Bạn chắc chắn muốn xóa trò chơi <b>[{{ stateDel.code }}] {{ stateDel.name }}</b> khỏi hệ thống ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="delAction" :loading="loading.del" color="red">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.del = false" :disabled="loading.del" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game'])
const emits = defineEmits(['update'])
const route = useRoute()

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
  secret: null,
  open: null
})
const stateEditPlay = ref({
  _id: null,
  web: null,
  windows: null,
  android: null,
  ios: null,
})
const stateEditContent = ref({
  _id: null,
  content: null
})
const stateEditRate = ref({
  _id: null,
  shop: {
    default: 0,
    limit: {
      number: 0,
      expired: null
    },
    vip: {
      month: 0,
      forever: 0
    }
  }
})
const stateEditManager = ref({
  _id: null,
  manager: null
})
const stateEditOpenServer = ref({
  _id: null,
})
const stateEditCollab = ref({
  _id: null,
  collab: {
    commission: null
  }
})
const stateDel = ref({
  _id: null,
  name: null,
  code: null
})
const stateReset = ref({
  _id: null
})

// Modal
const modal = ref({
  editInfo: false,
  editImage: false,
  editAPI: false,
  editPlay: false,
  editRate: false,
  editContent: false,
  editManager: false,
  editOpenServer: false,
  editCollab: false,
  del: false,
  reset: false
})

// Loading
const loading = ref({
  edit: false,
  reset: false,
  del: false
})

// Action Menu
const actions = (row) => [
  [{
    label: 'Quản lý chi tiết',
    icon: 'i-bx-windows',
    disabled: !!route.params._id,
    click: () => useTo().openNewTab(`/manage/@gm/private/${row._id}`)
  }],
  [{
    label: 'Người quản lý',
    icon: 'i-bx-group',
    disabled: !!route.params._id,
    click: () => {
      Object.keys(stateEditManager.value).forEach(key => stateEditManager.value[key] = row[key])
      modal.value.editManager = true
    }
  },{
    label: 'Lịch mở máy chủ',
    icon: 'i-bx-server',
    click: () => {
      Object.keys(stateEditOpenServer.value).forEach(key => stateEditOpenServer.value[key] = row[key])
      modal.value.editOpenServer = true
    }
  }],
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
        const content = await useAPI('game/private/manage/project/get/content', { _id: row._id })
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
    label: 'Sửa tỷ lệ',
    icon: 'i-bx-shape-circle',
    click: () => {
      stateEditRate.value._id = row._id
      stateEditRate.value.shop.default = row.rate?.shop?.default
      stateEditRate.value.shop.limit.number = row.rate?.shop?.limit?.number
      stateEditRate.value.shop.limit.expired = row.rate?.shop?.limit?.expired
      stateEditRate.value.shop.vip.month = row.rate?.shop?.vip?.month
      stateEditRate.value.shop.vip.forever = row.rate?.shop?.vip?.forever
      modal.value.editRate = true
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
    label: 'Sửa thông tin CTV',
    icon: 'i-bxs-user-badge',
    click: () => {
      stateEditCollab.value._id = row._id
      stateEditCollab.value.collab.commission = row.collab.commission
      modal.value.editCollab = true
    }
  }],[{
    label: 'Reset trò chơi',
    icon: 'i-bx-reset',
    click: () => {
      Object.keys(stateDel.value).forEach(key => stateReset.value[key] = row[key])
      stateReset.value._id = row._id
      modal.value.reset = true
    }
  },{
    label: 'Xóa trò chơi',
    icon: 'i-bx-trash',
    disabled: !!route.params._id,
    click: () => {
      Object.keys(stateDel.value).forEach(key => stateDel.value[key] = row[key])
      stateDel.value._id = row._id
      modal.value.del = true
    }
  }]
]

// Action
const editInfoAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/info', JSON.parse(JSON.stringify(stateEditInfo.value)))

    loading.value.edit = false
    modal.value.editInfo = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editImageAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/image', JSON.parse(JSON.stringify(stateEditImage.value)))

    loading.value.edit = false
    modal.value.editImage = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editAPIAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/api', JSON.parse(JSON.stringify(stateEditAPI.value)))

    loading.value.edit = false
    modal.value.editAPI = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editPlayAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/play', JSON.parse(JSON.stringify(stateEditPlay.value)))

    loading.value.edit = false
    modal.value.editPlay = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editRateAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/rate', JSON.parse(JSON.stringify(stateEditRate.value)))

    loading.value.edit = false
    modal.value.editRate = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editContentAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/content', JSON.parse(JSON.stringify(stateEditContent.value)))

    loading.value.edit = false
    modal.value.editContent = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editManagerAction = async () => {
  try {
    loading.value.edit = true

    const clone = JSON.parse(JSON.stringify(stateEditManager.value))
    clone.manager = clone.manager.map(i => i._id)
    await useAPI('game/private/manage/project/edit/manager', clone)

    loading.value.edit = false
    modal.value.editManager = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editCollabAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/private/manage/project/edit/collab', JSON.parse(JSON.stringify(stateEditCollab.value)))

    loading.value.edit = false
    modal.value.editCollab = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const resetAction = async (_id) => {
  try {
    loading.value.reset = true
    await useAPI('game/private/manage/project/reset', JSON.parse(JSON.stringify(stateReset.value)))

    loading.value.reset = false
    modal.value.reset = false
    emits('update')
  }
  catch (e) {
    loading.value.reset = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('game/private/manage/project/del', JSON.parse(JSON.stringify(stateDel.value)))

    loading.value.del = false
    modal.value.del = false
    emits('update')
  }
  catch (e) {
    loading.value.del = false
  }
}
</script>