<template>
  <div class="HomePage">
    <div class="HomeBanner relative overflow-hidden rounded-3xl">
      <!-- Image -->
      <UiImg :src="config.og_image" class="!absolute w-full h-full top-0 left-0" w="16" h="9"/>

      <!-- Overlay -->
      <div class="absolute w-full h-full bg-black/80"></div>

      <!-- Content -->
      <UiFlex type="col" items="start" justify="center" class="relative w-full h-full md:p-20 p-12 aspect-auto">
        <UiLogo v-if="config.logo_image" img-size="45"></UiLogo>
        <UiFlex v-else class="select-none sm:text-6xl text-4xl">
          <UiText weight="bold" color="primary" class="italic">ENI</UiText>
          <UiText class="ml-1 italic" weight="semibold">Studio</UiText>
        </UiFlex>

        <UiText size="lg" color="gray" class="md:mt-2 mt-0 tracking-tight max-w-xl">{{ config.description }}</UiText>

        <UiFlex class="my-8 gap-8 text-gray-300 w-full" wrap>
          <div class="grow">
            <UiText size="sm">Thành viên</UiText>
            <UiText size="xl" weight="bold">{{ home.member }}</UiText>
          </div>

          <div class="grow">
            <UiText size="sm">Game Tool</UiText>
            <UiText size="xl" weight="bold">{{ home.game.tool }}</UiText>
          </div>

          <div class="grow">
            <UiText size="sm">Game Private</UiText>
            <UiText size="xl" weight="bold">{{ home.game.private }}</UiText>
          </div>

          <div class="grow">
            <UiText size="sm">Game China</UiText>
            <UiText size="xl" weight="bold">{{ home.game.china }}</UiText>
          </div>
        </UiFlex>

        <UiFlex class="gap-1 md:justify-start justify-center w-full">
          <UButton color="primary" size="md" icon="i-bxs-book-open" @click="navigateTo('/about')">Giới Thiệu</UButton>
          <UButton color="black" size="md" icon="i-bxs-download" @click="downloadMiniClient()" v-if="!!device.isWindows">Mini Client</UButton>
        </UiFlex>
      </UiFlex>
    </div>

    <!--News-->
    <div class="my-12 mb-16">
      <DataNewsHome />
    </div>

    <!--Private-->
    <UiLazy #default="{ render }">
      <div class="my-12 mb-16">
        <DataGamePrivateHome />
      </div>
    </UiLazy>

    <!--Tool-->
    <UiLazy #default="{ render }">
      <div class="my-12 mb-16">
        <LazyDataGameToolHome v-if="!!render" />
      </div>
    </UiLazy>

    <!--China-->
    <UiLazy #default="{ render }">
      <div class="my-12">
        <LazyDataGameChinaHome v-if="!!render" />
      </div>
    </UiLazy>
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