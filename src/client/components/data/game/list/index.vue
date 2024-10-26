<template>
  <DataEmpty class="h-[300px]" :loading="loading" v-if="!!loading || list.length == 0" />

  <div v-else class="grid grid-cols-12 gap-2 md:gap-4">
    <DataGameBox 
      v-for="(item, index) in list" 
      :key="index" 
      :class="grid"
      :game="item"
      :os="os"
      :gm="gm"
    />
  </div>
</template>

<script setup>
const props = defineProps(['loading', 'list', 'os', 'gm', 'max'])

const grid = computed(() => {
  let item = ''
  if(props.max == '4') item = 'xl:col-span-3 col-span-6'
  else if(props.max == '6') item = 'xl:col-span-4 col-span-6'
  else item = 'xl:col-span-3 md:col-span-4 col-span-6'
  return item
})
</script>