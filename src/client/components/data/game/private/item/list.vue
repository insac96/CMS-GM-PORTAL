<template>
  <UiFlex wrap :justify="justify" class="gap-2">
    <UiText color="gray" v-if="!items || items.length == 0">{{empty || 'Không có phần thưởng'}}</UiText>
    <DataGamePrivateItem v-for="(item, index) in items" :key="index" :item="item" :amount="item.amount" :size="size" />
  </UiFlex>
</template>

<script setup>
const props = defineProps(['items', 'empty', 'justify', 'size'])
</script>