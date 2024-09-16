<template>
  <USelectMenu
    v-model="valueSelect"
    :multiple="multiple"
    :options="options"
    size="lg"
    by="_id"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini v-if="!multiple">{{ select ? select.label : 'Chọn danh mục' }}</UiText>
      <UiText mini v-if="!!multiple && select && select.length > 0">{{ select.map(i => i.label).join(', ') }}</UiText>
      <UiText mini v-if="!!multiple && select && select.length == 0">Chọn danh mục</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: [ String, Array ],
  multiple: Boolean,
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const valueSelect = ref(props.modelValue)
const options = ref([])
const select = ref(null)
const loading = ref(true)

watch(valueSelect, val => {
  select.value = val
  if(!!props.multiple){
    const list = val.map(i => i._id)
    emit('update:modelValue', list)
  }
  else {
    if(!!val) return emit('update:modelValue', val._id)
    emit('update:modelValue', undefined)
  }
})

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('news/public/category/select')
    
    options.value = options.value.concat(list.map(i => ({ _id: i._id, label: i.name })))

    if(!props.multiple && !!valueSelect.value){
      select.value = options.value.find(i => i._id === valueSelect.value)
    }
    if(!!props.multiple && !!valueSelect.value){
      select.value = valueSelect.value
    }
    
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>