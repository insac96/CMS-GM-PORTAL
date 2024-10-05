<template>
  <DataGamePrivateShop 
    :game="game"
    @done-recharge="emit('done-recharge')"
    @done-item="emit('done-item')"
    @done-pack="emit('done-pack')"
  />
</template>

<script setup>
const game = useAttrs().game
const emits = defineEmits(['done-recharge', 'done-item', 'done-pack'])
</script>