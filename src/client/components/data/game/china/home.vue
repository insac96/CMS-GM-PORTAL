<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="2xl:col-span-8 col-span-12">
      <DataGameChinaListLatest class="mb-4" />
    </div>
    
    <div class="2xl:col-span-4 col-span-12">
      <UTabs v-model="tab" :items="items" />

      <UCard :ui="{ body: { padding: 'py-2 sm:py-2' }}">
        <LazyDataGameChinaListTop sort="statistic.user" v-if="tab == 0" />
        <LazyDataGameChinaListTop sort="statistic.play" v-if="tab == 1" />
        <LazyDataGameChinaListTop sort="statistic.view" v-if="tab == 2" />
      </UCard>
    </div>
  </div>
</template>

<script setup>
const tab = ref(0)
const items = [
  { label: 'Game Hot'},
  { label: 'Chơi Nhiều'},
  { label: 'Xem Nhiều'},
]
</script>