<template>
  <UCard :ui="{ 
    base: 'overflow-hidden',
    background: 'bg-gray-100 dark:bg-gray-800',
    body: { padding: 'p-2 sm:p-4', background: 'bg-white dark:bg-gray-900' },
    header: { padding: 'px-2 sm:px-2 py-1.5 sm:py-1.5', }
  }">
    <template #header>
      <UiFlex>
        <div 
          v-for="item in tabs" 
          :key="item.value"
          class="py-1.5 px-4 text-sm rounded-2xl cursor-pointer select-none"
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
      <DataGamePrivateShopRecharge :game="game" v-if="tabs[tab-1]['key'] == 'recharge'" @done="updatePrivateShopBuy"/>
      <DataGamePrivateShopItem :game="game" v-if="tabs[tab-1]['key'] == 'item'" @done="updatePrivateShopBuy" />
      <DataGamePrivateShopPack :game="game" v-if="tabs[tab-1]['key'] == 'pack'" @done="updatePrivateShopBuy" />
    </template>
  </UCard>
</template>

<script setup>
const props = defineProps(['game'])

const tab = ref(1)

const tabs = computed(() => {
  const list = []
  if(!props.game.paygame){
    list.push({ label: 'Nạp Game', value: 1, key: 'recharge' })
    list.push({ label: 'Vật Phẩm', value: 2, key: 'item' })
    list.push({ label: 'Gói Vật Phẩm', value: 3, key: 'pack' })
  }
  else {
    list.push({ label: 'Vật Phẩm', value: 1, key: 'item' })
    list.push({ label: 'Gói Vật Phẩm', value: 2, key: 'pack' })
  }
  return list
})
</script>