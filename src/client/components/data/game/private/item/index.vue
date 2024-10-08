<template>
  <div class="
    relative inline-block
    hover:ring-primary-500
    cursor-pointer
    rounded-lg 
  ">
    <DataGamePrivateItemImage 
      class="p-1"
      :size="size"
      :src="item.item_image"
      :game="game" 
      @click="modal = true" 
    />

    <UiFlex 
      v-if="amount && amount > 0"
      class="
        absolute
        bottom-1 right-1
        rounded-lg
        px-[5px]
        bg-gray-600
        cursor-pointer
      "
      @click="modal = true" 
    >
      <UiText align="center" weight="bold" style="color:#fff; font-size: 10px;" >
        x{{ miniMoney(amount) }}
      </UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UCard :ui="{ body: { padding: 'p-4 sm:p-4' } }">
        <DataGamePrivateItemImage :src="item.item_image" :size="120" class="mx-auto" :game="game" />

        <UiFlex type="col" class="mt-4">
          <UiText align="center" weight="bold" color="gray" class="leading-5">{{ item.item_name }}</UiText>
          <UBadge size="md" color="primary" class="mt-4 px-3 font-semibold" v-if="!!amount && amount > 0">
              x {{ toMoney(amount) }}
          </UBadge>
        </UiFlex>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const { miniMoney, toMoney } = useMoney()
const props = defineProps({
  item: Object,
  amount: [ String, Number ],
  size: { type: [ String, Number ]},
  game: { type: String }
})

const modal = ref(false)
</script>