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
        description="Bạn có thể kiếm ECoin từ việc làm nhiệm vụ hoặc tham gia cày cuốc trong các trò chơi"
        icon="i-bxs-bell"
        class="mb-4"
      ></UAlert>

      <UTabs v-model="tab" :items="tabs" :content="false" class="block sm:inline-block mb-4"></UTabs>
      
      <DataEcoinMission v-if="tab == 0"/>
      <DataEcoinP2p v-if="tab == 1"/>
      <DataEcoinGame v-if="tab == 2"/>
    </div>
  </UiContent>
</template>

<script setup>
const tab = ref(0)
const tabs = [{
  label: 'Nhiệm vụ',
  icon: 'i-bxs-book-open',
},{
  label: 'Giao dịch',
  icon: 'i-bx-transfer-alt',
},{
  label: 'Trò chơi',
  icon: 'i-bx-game',
}]

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