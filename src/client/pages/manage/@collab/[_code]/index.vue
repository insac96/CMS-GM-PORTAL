<template>
  <UiContent title="Statistic" sub="Thống kê số liệu">
    <ManageStatisticFast class="mb-4" :collab="route.params._code"/>

    <DataChartLine class="mb-4" :source="source" />

    <UiFlex class="mb-2">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageStatisticPayment v-if="tab == 0" v-model="source" :collab="route.params._code" />
    <ManageStatisticSignin v-if="tab == 1" v-model="source" :collab="route.params._code" />
    <ManageStatisticSignup v-if="tab == 2" v-model="source" :collab="route.params._code" />
  </UiContent>
</template>

<script setup>
const route = useRoute()

const tab = ref(0)
const tabs = [
  { label: 'Nạp tiền', key: 'payment' },
  { label: 'Đăng nhập', key: 'signin' },
  { label: 'Đăng ký', key: 'signup' },
]

const source = ref([])
</script>