<template>
  <UiFlex type="col" justify="center" class="sm:py-24 py-10 max-w-full w-[800px] mx-auto">
    <UiText align="center" class="font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl text-3xl">{{ config.name }}</UiText>
    <UiText align="center" size="lg" color="gray" class="sm:mt-4 mt-2 mb-6 tracking-tight">{{ config.description }}</UiText>

    <UiImg 
      :src="config.og_image"
      w="16" h="9"
      img-size="xs:300px sm:600 md:800px 1000px"
      alt="Banner"
      class="transition-all rounded-3xl shadow-md hover:shadow-lg max-w-full"
      preload
    ></UiImg>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>