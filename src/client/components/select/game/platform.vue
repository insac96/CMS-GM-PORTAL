<template>
  <USelectMenu
    v-model="platform"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="label"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : 'Chọn nền tảng' }}</UiText>
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

const platform = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === platform.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('game/public/platform/select')
    
    options.value = options.value.concat(list.map(i => ({ _id: i._id, label: i.name })))
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
fetch()
</script>