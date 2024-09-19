<template>
  <UiContent title="Game China" sub="Quản lý các trò chơi China">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      
      <UButton color="gray" class="ml-auto" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #name-data="{ row }">
          <NuxtLink :to="`/game/china/${row.key}`" target="_blank" class="text-primary font-semibold">{{ row.name }}</NuxtLink>
        </template>

        <template #platform-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.platform.name }}</UBadge>
        </template>

        <template #category-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.category.name }}</UBadge>
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="!!row.pin ? 'green' : 'gray'" variant="soft">{{ !!row.pin ? 'Đã ghim' : 'Không' }}</UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="!!row.display ? 'green' : 'gray'" variant="soft">{{ !!row.display ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="p-4">
        <UFormGroup label="Nền tảng">
          <SelectGamePlatform v-model="stateAdd.platform" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectGameCategory v-model="stateAdd.category" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateAdd.code" />
        </UFormGroup>

        <UFormGroup label="Mô tả ngắn">
          <UInput v-model="stateAdd.description" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <SelectPin v-model="stateAdd.pin" class="mr-auto" />

          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="p-4">
        <UFormGroup label="Nền tảng">
          <SelectGamePlatform v-model="stateEditInfo.platform" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectGameCategory v-model="stateEditInfo.category" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateEditInfo.name" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateEditInfo.code" />
        </UFormGroup>

        <UFormGroup label="Mô tả ngắn">
          <UInput v-model="stateEditInfo.description" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEditInfo.display" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <SelectPin v-model="stateEditInfo.pin" class="mr-auto" />
          
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

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editImage = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
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

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editPlay = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
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

    <!-- Modal Payment -->
    <UModal v-model="modal.payment" :ui="{width: 'sm:max-w-[1200px]'}">
      <UiContent title="Payment" sub="Quản lý giao dịch nạp vào trò chơi" class="p-4">
        <ManageGameChinaPayment :game="statePayment._id" />
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
  // List
  const list = ref([])
  
  // Columns
  const columns = [
    {
      key: 'name',
      label: 'Tên',
    },{
      key: 'platform',
      label: 'Nền tảng',
    },{
      key: 'category',
      label: 'Thể loại'
    },{
      key: 'pin',
      label: 'Ghim',
      sortable: true
    },{
      key: 'display',
      label: 'Hiển thị',
      sortable: true
    },{
      key: 'updatedAt',
      label: 'Cập nhật',
      sortable: true
    },{
      key: 'actions',
      label: 'Chức năng',
    }
  ]
  const selectedColumns = ref([...columns])
  
  // Page
  const page = ref({
    size: 12,
    current: 1,
    sort: {
      column: 'updatedAt',
      direction: 'desc'
    },
    search: {
      key: null,
    },
    total: 0
  })
  watch(() => page.value.size, () => getList())
  watch(() => page.value.current, () => getList())
  watch(() => page.value.sort.column, () => getList())
  watch(() => page.value.sort.direction, () => getList())
  watch(() => page.value.search.key, (val) => !val && getList())
  
  // State
  const stateAdd = ref({
    platform: null,
    category: null,
    name: null,
    code: null,
    description: null,
    pin: false,
    display: true,
  })
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
  const statePayment = ref({
    _id: null
  })
  
  // Modal
  const modal = ref({
    add: false,
    editInfo: false,
    editImage: false,
    editAPI: false,
    editPlay: false,
    editContent: false,
    payment: false
  })
  
  watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
    platform: null,
    category: null,
    name: null,
    code: null,
    description: null,
    pin: false,
    display: true,
  }))
  
  // Loading
  const loading = ref({
    load: true,
    add: false,
    edit: false,
    del: false
  })
  
  // Actions
  const actions = (row) => [
    [{
      label: 'Duyệt nạp',
      icon: 'i-bx-credit-card',
      click: () => {
        statePayment.value._id = row._id
        modal.value.payment = true
      }
    }],[{
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
          const content = await useAPI('game/china/manage/project/get/content', { _id: row._id })
          stateEditContent.value._id = row._id
          stateEditContent.value.content = content
          modal.value.editContent = true
        }
        catch (e) {
          return
        }
      }
    }],[{
      label: 'Sửa link chơi',
      icon: 'i-bx-credit-card',
      click: () => {
        Object.keys(stateEditPlay.value).forEach(key => stateEditPlay.value[key] = row.play[key])
        stateEditPlay.value._id = row._id
        modal.value.editPlay = true
      }
    }],[{
      label: 'Xóa trò chơi',
      icon: 'i-bx-trash',
      click: () => delAction(row._id)
    }]
  ]
   
  // Fetch
  const getList = async () => {
    try {
      loading.value.load = true
      const data = await useAPI('game/china/manage/project/list', JSON.parse(JSON.stringify(page.value)))
  
      loading.value.load = false
      list.value = data.list
      page.value.total = data.total
    }
    catch (e) {
      loading.value.load = false
    } 
  }
  
  const addAction = async () => {
    try {
      loading.value.add = true
      await useAPI('game/china/manage/project/add', JSON.parse(JSON.stringify(stateAdd.value)))
  
      loading.value.add = false
      modal.value.add = false
      getList()
    }
    catch (e) {
      loading.value.add = false
    }
  }
  
  const editInfoAction = async () => {
    try {
      loading.value.edit = true
      await useAPI('game/china/manage/project/edit/info', JSON.parse(JSON.stringify(stateEditInfo.value)))
  
      loading.value.edit = false
      modal.value.editInfo = false
      getList()
    }
    catch (e) {
      loading.value.edit = false
    }
  }

  const editImageAction = async () => {
    try {
      loading.value.edit = true
      await useAPI('game/china/manage/project/edit/image', JSON.parse(JSON.stringify(stateEditImage.value)))
  
      loading.value.edit = false
      modal.value.editImage = false
      getList()
    }
    catch (e) {
      loading.value.edit = false
    }
  }

  const editPlayAction = async () => {
    try {
      loading.value.edit = true
      await useAPI('game/china/manage/project/edit/play', JSON.parse(JSON.stringify(stateEditPlay.value)))
  
      loading.value.edit = false
      modal.value.editPlay = false
      getList()
    }
    catch (e) {
      loading.value.edit = false
    }
  }

  const editContentAction = async () => {
    try {
      loading.value.edit = true
      await useAPI('game/china/manage/project/edit/content', JSON.parse(JSON.stringify(stateEditContent.value)))
  
      loading.value.edit = false
      modal.value.editContent = false
      getList()
    }
    catch (e) {
      loading.value.edit = false
    }
  }
  
  const delAction = async (_id) => {
    try {
      loading.value.del = true
      await useAPI('game/china/manage/project/del', { _id })
  
      loading.value.del = false
      getList()
    }
    catch (e) {
      loading.value.del = false
    }
  }
  
  getList()
  </script>
  