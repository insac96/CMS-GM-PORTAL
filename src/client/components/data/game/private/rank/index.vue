<template>
  <UCard :ui="{ 
    background: 'bg-gray-100 dark:bg-gray-800',
    body: { padding: 'p-0 sm:p-0', background: 'bg-white dark:bg-gray-900' },
    header: { padding: 'p-2 sm:p-2', }
  }">
    <template #header>
      <UiFlex>
        <div 
          v-for="item in tabs" 
          :key="item.value"
          class="py-2 px-4 text-sm rounded-2xl cursor-pointer select-none"
          :class="{
            'bg-white dark:bg-gray-900': tab == item.value
          }"
          @click="tab = item.value"
        >
          <UiText size="xs" weight="semibold">{{ item.label }}</UiText>
        </div>
      </UiFlex>
    </template>
    
    <template #default>
      <DataGamePrivateRankPower :game="game" v-if="tabs[tab-1]['key'] == 'power'" />
      <DataGamePrivateRankLevel :game="game" v-if="tabs[tab-1]['key'] == 'level'" />
      <DataGamePrivateRankSpend :game="game" v-if="tabs[tab-1]['key'] == 'spend'" />
    </template>
  </UCard>
</template>

<script setup>
const props = defineProps(['game'])

const tab = ref(1)
const tabs = computed(() => {
  const list = []
    list.push({ label: 'Lực chiến', value: 1, key: 'power' })
    list.push({ label: 'Cấp độ', value: 2, key: 'level' })
    list.push({ label: 'Tiêu phí', value: 3, key: 'spend' })
  return list
})
</script>