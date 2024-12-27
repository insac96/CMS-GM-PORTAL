<template>
  <DataEmpty class="h-[300px]" :loading="loading" v-if="!!loading || list.length == 0" />

  <div v-else class="grid grid-cols-12 gap-2 md:gap-4">
    <DataNewsBox 
      v-for="(item, index) in list" 
      :key="index" 
      class="2xl:col-span-3 xl:col-span-4 col-span-6"
      :news="item"
    />
  </div>
</template>

<script setup>
const props = defineProps(['list', 'loading'])
</script>