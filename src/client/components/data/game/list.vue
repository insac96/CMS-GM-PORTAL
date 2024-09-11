<template>
  <DataEmpty class="h-[300px]" v-if="list.length == 0" />

  <div v-else class="grid grid-cols-12 gap-2 md:gap-4">
    <DataGameBox 
      v-for="(item, index) in list" 
      :key="index" 
      class="md:col-span-4 col-span-6"
      :game="item"
      :os="os"
    />
  </div>
</template>

<script setup>
const props = defineProps(['list', 'os'])
</script>