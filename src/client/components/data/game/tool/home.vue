<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="2xl:col-span-8 col-span-12">
      <DataGameToolListLatest class="mb-4" />
    </div>
    
    <div class="2xl:col-span-4 col-span-12">
      <UTabs v-model="tab" :items="items" />

      <LazyDataGameToolListOpenServer v-if="tab == 0" />
      <LazyDataGameToolListTop sort="statistic.user" v-if="tab == 1" />
      <LazyDataGameToolListTop sort="statistic.play" v-if="tab == 2" />
    </div>
  </div>
</template>

<script setup>
const tab = ref(0)
const items = [
  { label: 'Máy chủ mới'},
  { label: 'Game Hot'},
  { label: 'Chơi nhiều'},
]
</script>