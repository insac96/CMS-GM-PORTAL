<template>
  <div class="HomePage">
    <UiFlex type="col" justify="center" class="py-12">
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
        class="transition-all rounded-lg shadow-md hover:shadow-lg max-w-3xl"
        preload
      ></UiImg>
    </UiFlex>

    <div class="my-12">
      <DataGameToolLatest />
    </div>

    <div class="my-12">
      <DataGamePrivateLatest />
    </div>

    <div class="my-12">
      <DataGameChinaLatest />
    </div>
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