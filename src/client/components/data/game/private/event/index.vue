<template>
  <UCard :ui="{ 
    base: 'overflow-hidden',
    background: 'bg-gray-100 dark:bg-gray-800',
    body: { padding: 'p-0 sm:p-0', background: 'bg-white dark:bg-gray-900' },
    header: { padding: 'px-2 sm:px-2 py-1.5 sm:py-1.5', }
  }">
    <template #header>
      <UiFlex>
        <div 
          v-for="item in tabs" 
          :key="item.value"
          class="py-1.5 px-4 text-sm rounded-lg cursor-pointer select-none"
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
      <DataGamePrivateEventLogin :game="game" v-if="tabs[tab-1]['key'] == 'login'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventSpend :game="game" v-if="tabs[tab-1]['key'] == 'spend'" @start-receive="updatePrivateEventReceive" />
    </template>
  </UCard>
</template>

<script setup>
const { updatePrivateEventReceive } = useGameStore()
const props = defineProps(['game'])

const tab = ref(1)
const tabs = computed(() => {
  const list = []
    list.push({ label: 'Điểm Danh', value: 1, key: 'login' })
    list.push({ label: 'Tiêu Xu', value: 2, key: 'spend' })
  return list
})
</script>