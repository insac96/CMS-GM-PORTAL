<template>
  <USelectMenu size="lg" v-model="selected" :options="options" :loading="loading" multiple>
    <template #label>
      <span v-if="selected.length" class="truncate">{{ selected.map(i=>i.label).join(' | ') }}</span>
      <span v-else>Chọn máy chủ</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])
const selected = ref([])
const loading = ref(true)
const options = ref([])

const stateChange = computed(() => {
  const model = selected.value.map(i=>i.value)
  return model
})

watch(() => stateChange.value, (value) => emit('update:modelValue', value))
watch(() => options.value, (value) => {
  props.modelValue.forEach(item => {
    const filter = value.filter(i => i.value == item)
    if(filter.length == 1) selected.value.push(filter[0])
  })
})

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('game/server')

    loading.value = false
    options.value = options.value.concat(list.map(i => ({ value: i.server_id, label: i.server_name })))
  }
  catch (e){
    loading.value = false
    options.value = []
  }
}

fetch()
</script>