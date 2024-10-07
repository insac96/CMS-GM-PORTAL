<template>
  <div class="bg-gray-100 rounded-3xl p-2">
    <UiFlex>
      <div 
        v-for="item in tabs" 
        :key="item.value"
        class="py-2 px-4 text-sm rounded-tl-2xl rounded-tr-2xl cursor-pointer select-none"
        :class="{
          'bg-white': tab == item.value
        }"
        @click="tab = item.value"
      >
        <UiText size="xs" weight="semibold">{{ item.label }}</UiText>
      </div>
    </UiFlex>

    <div class="bg-white rounded-2xl p-2" :class="{
      'rounded-tl-none': tab == 1
    }">
      <DataGamePrivateEventLogin :game="game" v-if="tabs[tab-1]['key'] == 'login'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventPay :game="game" v-if="tabs[tab-1]['key'] == 'pay'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventSpend :game="game" v-if="tabs[tab-1]['key'] == 'spend'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventOther :game="game" v-if="tabs[tab-1]['key'] == 'other'" @start-receive="updatePrivateEventReceive" />
    </div>
  </div>
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