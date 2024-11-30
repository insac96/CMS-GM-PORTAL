<template>
  <div>
    <UButton icon="i-bx-box" color="gray" @click="open = true">Kho Vật Phẩm</UButton>

    <UModal v-model="open" :ui="{ width: 'max-w-[400px] sm:max-w-[400px]' }">
      <div class="p-2">
        <UTabs v-model="tab" :items="tabs" :content="false" class="block"></UTabs>

        <DataEmpty :loading="loading" text="Kho đồ trống" class="min-h-[300px]" v-if="!!loading || list.length == 0"></DataEmpty>

        <UiFlex wrap class="gap-1.5 py-4" justify="center" v-else>
          <DataUserRoleItem v-for="(item, index) in list" :key="index" :item="item" :type="tabs[tab]['type']" @on-use="open = false; emits('onUse')"></DataUserRoleItem>
        </UiFlex>
      </div>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['user'])
const emits = defineEmits(['onUse'])

const loading = ref(true)
const open = ref(false)

const list = ref([])

const tab = ref(0)
const tabs = [
  { label: 'Trang phục', type: 'body' },
  { label: 'Cánh', type: 'wing' },
  { label: 'Thú cưng', type: 'pet' }
]

watch(() => tab.value, () => getList())
watch(() => open.value, (val) => !!val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('role/public/bag', JSON.parse(JSON.stringify({
      type: tabs[tab.value]['type']
    })))

    list.value = data
    setTimeout(() => loading.value = false, 500)
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>