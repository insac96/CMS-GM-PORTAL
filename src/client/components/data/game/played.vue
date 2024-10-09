<template>
  <UiContent title="Lịch Sử Chơi" sub="Các trò chơi đã chơi hoặc thanh toán" no-dot class="p-4">
    <SelectGameOs v-model="os" class="mb-2" />

    <DataGameToolPlayed :user="user" v-if="os == 'tool'" />
    <DataGamePrivatePlayed :user="user" v-if="os == 'private'" />
    <DataGameChinaPlayed :user="user" v-if="os == 'china'" />
  </UiContent>
</template>

<script setup>
const props = defineProps(['user'])
const os = ref('tool')
</script>