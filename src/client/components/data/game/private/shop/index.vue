<template>
  <UCard :ui="{ background: 'bg-gray-100 dark:bg-gray-800', body: { padding: 'p-2 sm:p-2' }}">
    <UiFlex>
      <div 
        v-for="item in tabs" 
        :key="item.value"
        class="py-2 px-4 text-sm rounded-tl-lg rounded-tr-lg cursor-pointer select-none"
        :class="{
          'bg-white dark:bg-gray-900': tab == item.value
        }"
        @click="tab = item.value"
      >
        <UiText size="xs" weight="semibold">{{ item.label }}</UiText>
      </div>
    </UiFlex>

    <div class="bg-white dark:bg-gray-900 rounded-lg p-2" :class="{
      'rounded-tl-none': tab == 1
    }">
      <DataGamePrivateShopRecharge :game="game" v-if="tabs[tab-1]['key'] == 'recharge'" @done="updatePrivateShopBuy"/>
      <DataGamePrivateShopItem :game="game" v-if="tabs[tab-1]['key'] == 'item'" @done="updatePrivateShopBuy" />
      <DataGamePrivateShopPack :game="game" v-if="tabs[tab-1]['key'] == 'pack'" @done="updatePrivateShopBuy" />
    </div>
  </UCard>
</template>

<script setup>
const { updatePrivateShopBuy } = useGameStore()
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