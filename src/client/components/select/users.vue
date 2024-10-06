<template>
  <UCard :ui="{ 
    header: { padding: 'p-4 sm:p-4 py-2 sm:py-2' },
    body: { padding: 'p-4 sm:p-4' },
  }">
    <template #header>
      <UiFlex justify="between">
        <UiText weight="semibold" size="sm">Tài Khoản</UiText>
        <UButton color="gray" @click="modal.add = true" size="xs">Thêm</UButton>
      </UiFlex>
    </template>

    <UiFlex justify="center" v-if="list.length == 0">
      <UiText align="center" color="gray" size="xs" weight="semibold">Không có dữ liệu</UiText>
    </UiFlex>

    <UiFlex wrap class="gap-1" v-else>
      <UBadge size="md" class="cursor-pointer" color="gray" v-for="(i, index) in list" :key="i" @click="delAction(index)">
        <UiText>{{ i.username }}</UiText>
        <UiIcon name="i-bx-x" class="ml-0.5
        " size="4"/>
      </UBadge>
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="p-4">
        <UFormGroup label="Tài khoản" name="user">
          <SelectUser v-model:user-data="stateAdd" :type="props.type" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const toast = useToast()
const props = defineProps({
  modelValue: Array,
  type: Number
})
const emit = defineEmits(['update:modelValue'])

const list = ref(props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : [])

const stateAdd = ref(undefined)

const modal = ref({
  add: false,
  user: false
})

watch(() => modal.value.add, (val) => {
  if(!val){
    stateAdd.value = undefined
  }
})


const showError = (text) => {
  toast.add({
    title: 'Lỗi',
    description: text,
    icon: 'i-bx-error',
    color: 'red'
  })
}

const addAction = () => {
  try {
    if(!stateAdd.value) throw 'Vui lòng chọn đầy đủ'

    const data = JSON.parse(JSON.stringify(stateAdd.value))
    const user = data._id

    const check = list.value.find(i => (i._id === user))
    if(!!check) throw 'Tài khoản đã tồn tại'

    list.value.push(data)

    emit('update:modelValue', list.value)
    modal.value.add = false
  }
  catch (e) {
    showError(e.toString())
  }
}

const delAction = (index) => {
  try {
    if(!list.value[index]) throw 'Chỉ mục tài khoản sai'
    list.value.splice(index, 1)

    emit('update:modelValue', list.value)
  }
  catch (e) {
    showError(e.toString())
  }
}
</script>