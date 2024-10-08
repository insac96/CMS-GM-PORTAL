<template>
  <UCard :ui="{ 
    body: { padding: 'p-0 sm:p-0' },
    header: { padding: 'p-2 sm:p-2' },
  }">
    <template #header>
      <UiFlex justify="end">
        <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
      </UiFlex>
    </template>

    <UTable :columns="columns" :rows="list">
      <template #amount-data="{ row }">
        <UiText weight="semibold">{{ useMoney().toMoney(row.amount) }}</UiText>
      </template>

      <template #actions-data="{ row, index }">
        <UButton icon="i-bx-edit-alt" color="gray" class="mr-1" @click="openEdit(row, index)" />
        <UButton icon="i-bx-trash" color="red" @click="delAction(index)" />
      </template>
    </UTable>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="p-4">
        <UFormGroup label="Vật phẩm">
          <SelectGameToolItem v-model="stateAdd.item" :game="game" />
        </UFormGroup>

        <UFormGroup label="Số lượng">
          <UInput v-model="stateAdd.amount" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm @submit="editAction" class="p-4">
        <UFormGroup label="Vật phẩm">
          <UInput v-model="stateEdit.name" readonly />
        </UFormGroup>

        <UFormGroup label="Số lượng">
          <UInput v-model="stateEdit.amount" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const props = defineProps(['modelValue', 'game'])
const emit = defineEmits(['update:modelValue'])
const list = ref(props.modelValue || [])

const columns = [
  {
    key: 'name',
    label: 'Vật phẩm',
  },{
    key: 'amount',
    label: 'Số lượng'
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]

const stateAdd = ref({
  item: null,
  amount: 1
})

const stateEdit = ref({
  index: null,
  name: null,
  amount: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  item: null,
  amount: 1
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.name = row.name
  stateEdit.value.amount = row.amount
  modal.value.edit = true
}

const addAction = () => {
  try {
    if(!stateAdd.value.item || !stateAdd.value.amount) throw 'Vui lòng nhập đầy đủ'
    if(stateAdd.value.amount < 1) throw 'Số lượng phải lớn hơn 0'

    const data = JSON.parse(JSON.stringify(stateAdd.value))
    const check = list.value.find(i => i.id === data.item.id)
    if(!!check) throw 'Vật phẩm đã tồn tại'

    list.value.push({
      amount: data.amount,
      ...data.item
    })

    emit('update:modelValue', list.value)
    modal.value.add = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const editAction = () => {
  try {
    if(stateEdit.value.amount < 1) throw 'Số lượng phải lớn hơn 0'
    if(!list.value[stateEdit.value.index]) throw 'Chỉ mục vật phẩm sai'

    list.value[stateEdit.value.index].amount = stateEdit.value.amount

    emit('update:modelValue', list.value)
    modal.value.edit = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const delAction = (index) => {
  try {
    if(!list.value[index]) throw 'Chỉ mục vật phẩm sai'
    list.value.splice(index, 1)

    emit('update:modelValue', list.value)
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}
</script>