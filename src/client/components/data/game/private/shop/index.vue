<template>
  <div class="bg-gray-100 rounded-3xl p-2">
    <UiFlex>
      <div 
        v-for="item in tabs" 
        :key="item.value"
        class="py-2 px-4 text-sm rounded-tl-2xl rounded-tr-2xl cursor-pointer"
        :class="{
          'bg-white': tab == item.value
        }"
        @click="tab = item.value"
      >
        <UiText size="xs" weight="semibold">{{ item.label }}</UiText>
      </div>
    </UiFlex>

    <div class="bg-white rounded-2xl min-h-[200px] p-2" :class="{
      'rounded-tl-none': tab == 1
    }">
      <DataGamePrivateShopRecharge :game="game" v-if="tabs[tab-1]['key'] == 'recharge'" @done="emit('done-recharge')"/>
      <DataGamePrivateShopItem :game="game" v-if="tabs[tab-1]['key'] == 'item'" @done="emit('done-item')" />
      <DataGamePrivateShopPack :game="game" v-if="tabs[tab-1]['key'] == 'pack'" @done="emit('done-pack')" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['done-recharge', 'done-item', 'done-pack'])

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