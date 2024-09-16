<template>
  <div class="p-2">
    <SelectGameOs v-model="os" class="mb-2" />

    <DataGameToolHistory :user="user" v-if="os == 'tool'" />
    <DataGameChinaHistory :user="user" v-if="os == 'china'" />
  </div>
</template>

<script setup>
const props = defineProps(['user'])
const os = ref('tool')
</script>