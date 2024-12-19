<template>
  <UiContent title="ECoin" sub="Tiền nền tảng hệ thống" class="w-full max-w-[700px] mx-auto">
    <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-4"></UTabs>

    <NuxtPage></NuxtPage>
  </UiContent>
</template>

<script setup>
const route = useRoute()
const tabRouter = {
  'ecoin-index': 0,
  'ecoin-index-p2p': 1,
}
const tab = ref(tabRouter[route.name])
const tabs = [{
  label: 'Nhiệm vụ',
  icon: 'i-bxs-book-open',
  to: ''
},{
  label: 'Giao dịch',
  icon: 'i-bx-transfer-alt',
  to: 'p2p'
}]

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/ecoin/${tabSelect.to}`)
}
</script>