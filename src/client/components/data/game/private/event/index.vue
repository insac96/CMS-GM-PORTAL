<template>
  <UCard :ui="{ 
    base: 'overflow-hidden',
    background: 'bg-gray-100 dark:bg-gray-800',
    body: { padding: 'p-0 sm:p-0', background: 'bg-white dark:bg-gray-900' },
    header: { padding: 'p-2 sm:p-2', }
  }">
    <template #header>
      <UiFlex>
        <div 
          v-for="item in tabs" 
          :key="item.value"
          class="py-2 px-4 text-sm rounded-lg cursor-pointer select-none"
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
      <DataGamePrivateEventPay :game="game" v-if="tabs[tab-1]['key'] == 'pay'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventSpend :game="game" v-if="tabs[tab-1]['key'] == 'spend'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventOther :game="game" v-if="tabs[tab-1]['key'] == 'other'" @start-receive="updatePrivateEventReceive" />
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
    list.push({ label: 'Tích nạp', value: 2, key: 'pay' })
    list.push({ label: 'Tiêu phí', value: 3, key: 'spend' })
    list.push({ label: 'Khác', value: 4, key: 'other' })
  return list
})
</script>