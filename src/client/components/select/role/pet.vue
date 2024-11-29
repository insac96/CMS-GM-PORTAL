<template>
  <USelectMenu
    v-model="item"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="name"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.name : 'Chọn thú cưng' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  item: Object,
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:item'])

const loading = ref(true)

const item = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('update:item', options.value.find(i => i._id === value))
  } 
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === item.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('role/public/pet/select')

    options.value = options.value.concat(list)
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>