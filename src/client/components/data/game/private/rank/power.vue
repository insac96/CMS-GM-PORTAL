<template>
  <div class="relative">
    <UiFlex class="px-4 py-2 border-b border-gray-100 dark:border-gray-800" justify="between">
      <UiText size="sm" weight="semibold">Máy chủ</UiText>
      <SelectGameServer v-model="state.server_id" :game="game.code" type="private" size="sm" />
    </UiFlex>

    <LoadingTable v-if="!!loading" />

    <UTable :columns="columns" :rows="list">
      <template #power-data="{ row }">
        {{ useMoney().toMoney(row.power) }}
      </template>
    </UTable>
  </div>
</template>

<script setup>
const props = defineProps(['game'])

const list = ref([])

const columns = [
  {
    key: 'rank',
    label: 'Hạng',
  },{
    key: 'role_name',
    label: 'Nhân vật',
  },{
    key: 'power',
    label: 'Lực chiến'
  }
]
const loading = ref(false)
const state = ref({
  server_id: null,
  game: props.game.code
})
watch(() => state.value.server_id, (val) => !!val && getRank())

const getRank = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/project/rank/power', JSON.parse(JSON.stringify(state.value)))

    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}
</script>