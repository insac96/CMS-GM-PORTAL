<template>
  <div class="grid grid-cols-12 gap-2">
    <UCard 
      @click="select(item._id)" 
      class="col-span-4 transition-2 cursor-pointer"
      :class="{
        'scale-95': !!gate && item._id == gate
      }"
      v-for="(item, index) in options" :key="index" 
      :ui="{
        base: 'hover:scale-95',
        background: 'dark:bg-gray-800',
        header: {
          padding: 'p-2 sm:p-2'
        },
        body: {
          padding: 'pt-2 sm:pt-2'
        }
      }"
    >
      <template #header>
        <UiFlex justify="center" class="gap-1">
          <UiText align="center" size="sm" weight="semibold">{{ item.name }}</UiText>
          <UiIcon name="i-bxs-check-circle" color="green"  v-if="!!gate && item._id == gate"/>
        </UiFlex>
      </template>

      <template #default>
        <UiImg class="rounded-full" w="1" h="1" :src="`/images/gate/${typeGate[item.type]['img']}`" />
      </template>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  gate: Object,
  options: {
    type: Array,
    default: () => []
  }
})

const typeGate = {
  1: { img: 'card.png', title: 'Thẻ Cào' },
  2: { img: 'bank.png', title: 'CK Ngân Hàng' },
  3: { img: 'momo.png', title: 'Ví Momo' },
}

const emit = defineEmits(['update:modelValue', 'update:gate'])

const loading = ref(true)

const gate = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('update:gate', options.value.find(i => i._id === value))
  } 
}) 

const options = ref(props.options)

const select = (_id) => {
  gate.value = _id
}

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('gate/public/select')

    options.value = options.value.concat(list)
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>