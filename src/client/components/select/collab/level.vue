<template>
  <USelectMenu
    v-model="level"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="number"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? `Cấp ${select.number}` : 'Chọn cấp độ' }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(true)

const level = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  } 
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === level.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('collab/manage/level/select')

    options.value = options.value.concat(list)
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>