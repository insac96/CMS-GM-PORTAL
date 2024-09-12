<template>
  <UiContent class="w-full max-w-[700px] mx-auto" :title="news.title" :sub="news.description" v-if="news" no-dot>
    <UiImg 
      :src="news.og_image"
      w="16" h="9"
      img-size="xs:300px sm:600 md:800px 1000px"
      alt="News Banner"
      class="rounded-3xl"
      preload
    ></UiImg>

    <UiFlex class="gap-2 my-4">
      <UAvatar size="lg" :src="news.updater.avatar" alt="Avatar" />

      <div>
        <UiText class="capitalize mb-1" size="sm" weight="semibold">{{ news.updater.username }}</UiText>
        <UiFlex wrap class="gap-1">
          <UBadge color="gray" variant="soft" size="xs">Tin tức</UBadge>
          <UBadge color="gray" variant="soft" size="xs">{{ news.category.name }}</UBadge>
        </UiFlex>
      </div>

      <UiText class="ml-auto" size="xs" color="gray">{{ useDayJs().fromTime(news.createdAt) }}</UiText>
    </UiFlex>

    <div class="my-4">
      <DataEmpty class="h-[300px]" v-if="!news.content" />
      <DataEditor :content="news.content" v-else />
    </div>

    <UiFlex justify="center">
      <NuxtLink to="/news">
        <UButton color="black">Xem Tin Khác</UButton>
      </NuxtLink>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const route = useRoute()
const news = ref(undefined)
const loading = ref(true)

const getNews = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/key', {
      key: route.params._key
    })

    news.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}
getNews()
</script>