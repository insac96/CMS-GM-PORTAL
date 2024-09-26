<template>
  <div class="HomePage">
    <UiFlex type="col" justify="center" class="py-24">
      <UiFlex class="select-none sm:text-6xl text-4xl">
        <UiText weight="bold" color="primary" class="italic">ENI</UiText>
        <UiText class="ml-1 italic" weight="semibold">Studio</UiText>
      </UiFlex>
      <UiText align="center" size="lg" color="gray" class="md:mt-2 mt-0 mb-4 md:mb-6 tracking-tight max-w-xl">{{ config.description }}</UiText>

      <UiFlex class="gap-1 mb-4 md:mb-6" wrap>
        <UButton color="primary" size="lg" icon="i-bxs-book-open" @click="navigateTo('/about')">Giới Thiệu</UButton>
        <UButton color="black" size="lg" icon="i-bxs-download" @click="downloadMiniClient()" v-if="!!device.isWindows">Mini Client</UButton>
      </UiFlex>

      <UiImg 
        :src="config.og_image"
        w="16" h="9"
        alt="Banner"
        class="transition-all rounded-3xl shadow-md hover:shadow-lg max-w-3xl"
        preload
      ></UiImg>
    </UiFlex>

    <UiFlex type="col" justify="center">
      <UiText align="center" class="font-bold tracking-tight text-gray-900 sm:text-4xl text-2xl">
        Tại đây <span class="text-primary">chúng tôi</span> có gì ?
      </UiText>

      <div class="w-full max-w-3xl grid grid-cols-12 gap-2 md:gap-4 py-8">
        <UCard class="md:col-span-6 col-span-6 transition-2" :ui="{ ring: 'hover:ring-primary' }">
          <UiText class="md:text-5xl text-3xl mb-1" weight="semibold" color="primary">{{ home.member }}</UiText>
          <UiText weight="bold" size="sm">Thành viên</UiText>
          <UiText color="gray" class="text-sm md:text-base">Cộng đồng người chơi đông đảo từ tất cả các nền tảng</UiText>
        </UCard>

        <UCard class="md:col-span-6 col-span-6 transition-2 relative cursor-pointer" :ui="{ ring: 'hover:ring-primary' }" @click="navigateTo('/game/tool')">
          <UiText class="md:text-5xl text-3xl mb-1" weight="semibold" color="primary">{{ home.game.tool }}</UiText>
          <UiText weight="semibold" size="sm">Game Tool</UiText>
          <UiText color="gray" class="text-sm md:text-base">Cung cấp các trò chơi với bộ công cụ GM tiên tiến nhất</UiText>
          <UiIcon color="primary" name="i-bx-link-external" class="absolute top-4 right-4" />
        </UCard>

        <UCard class="md:col-span-6 col-span-6 transition-2 relative cursor-pointer" :ui="{ ring: 'hover:ring-primary' }" @click="navigateTo('/game/private')">
          <UiText class="md:text-5xl text-3xl mb-1" weight="semibold" color="primary">{{ home.game.private }}</UiText>
          <UiText weight="semibold" size="sm">Game Private</UiText>
          <UiText color="gray" class="text-sm md:text-base">Tổng hợp tất cả các trò chơi Private hay nhất trên thị trường</UiText>
          <UiIcon color="primary" name="i-bx-link-external" class="absolute top-4 right-4" />
        </UCard>

        <UCard class="md:col-span-6 col-span-6 transition-2 relative cursor-pointer" :ui="{ ring: 'hover:ring-primary' }" @click="navigateTo('/game/china')">
          <UiText class="md:text-5xl text-3xl mb-1" weight="semibold" color="primary">{{ home.game.china }}</UiText>
          <UiText weight="semibold" size="sm">Game China</UiText>
          <UiText color="gray" class="text-sm md:text-base">Các trò chơi hay từ cổng trò chơi lớn nhất Trung Quốc</UiText>
          <UiIcon color="primary" name="i-bx-link-external" class="absolute top-4 right-4" />
        </UCard>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const device = useDevice()
const { error } = useNotify()
const { openNewTab } = useTo()
const { config } = useConfigStore()

const home = ref({
  member: 0,
  game: {
    tool: 0,
    china: 0,
    private: 0
  }
})

const downloadMiniClient = () => {
  const isMiniClient = localStorage.getItem('miniclient')
  if(!!isMiniClient) return error('Bạn đang sử dụng Mini Client, không thể tải')

  if(!device.isWindows && !device.isMacOS) return error('Mini Client chỉ hỗ trợ hệ điều hành Windows và MacOS')
  if(!!device.isWindows && !config.download.windows) return error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  if(!!device.isMacOS && !config.download.mac) return error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')

  if(!!device.isWindows) return openNewTab(config.download.windows)
  if(!!device.isMacOS) return openNewTab(config.download.mac)
}

const getHome = async () => {
  try {
    const data = await useAPI('config/public/home')
    home.value = data
  }
  catch(e){
    return false
  }
}
getHome()
</script>