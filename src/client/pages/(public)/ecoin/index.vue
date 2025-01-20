<template>
  <UiContent title="ECoin" sub="Tiền nền tảng hệ thống" class="w-full max-w-[700px] mx-auto">
    <DataEmpty :loading="loading" v-if="!!loading || !season" text="Chưa có mùa giải mới" class="h-[200px]"></DataEmpty>

    <div v-else>
      <UCard class="mb-2" >
        <UiFlex type="col" class="gap-4">
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="sm">Mùa giải</UiText>
            <UiText weight="semibold" size="sm">{{ season.title }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="sm">Tổng cung dự án</UiText>
            <UiText weight="semibold" size="sm">
              <span class="text-primary">{{ useMoney().toMoney(season.vnd) }}</span>
              đ
            </UiText>
          </UiFlex>

          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="sm">Ecoin sàn</UiText>
            <UiText weight="semibold" size="sm">{{ useMoney().toMoney(season.ecoin) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="sm">Ecoin khai khác</UiText>
            <UiText weight="semibold" size="sm">{{ useMoney().toMoney(season.farming) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="sm">Giá trị 1 Ecoin</UiText>
            <UiText weight="semibold" size="sm">
              <span class="text-primary">{{ useMoney().toMoney(season.price) }}</span>
              đ
            </UiText>
          </UiFlex>
        </UiFlex>
      </UCard>
      
      <UAlert 
        title="Chú Ý"
        description="Bạn có thể kiếm ECoin từ việc làm nhiệm vụ hoặc tham gia cầy cuốc trong các trò chơi"
        icon="i-bxs-bell"
        class="mb-4"
      ></UAlert>

      <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-4"></UTabs>
      
      <NuxtPage :season="season"></NuxtPage>
    </div>
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

const loading = ref(true)
const season = ref(undefined)

const getSeason = async () => {
  try {
    loading.value = true
    const data = await useAPI('ecoin/public/season/get')

    season.value = data
    setTimeout(() => loading.value = false, 500)
  }
  catch(e){
    loading.value = false
  }
}
getSeason()
</script>