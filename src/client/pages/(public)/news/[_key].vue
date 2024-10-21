<template>
  <LoadingNewsKey v-if="!!loading" />

  <UiContent v-else class="w-full max-w-[700px] mx-auto" :title="news.title" :sub="news.description" no-dot>
    <UiImg 
      :src="news.og_image"
      w="16" h="9"
      img-size="xs:300px sm:600 md:800px 1000px"
      alt="News Banner"
      class="rounded-lg"
      preload
    ></UiImg>

    <UiFlex class="gap-2 my-4">
      <DataUserAvatar :user="news.updater"/>

      <div class="ml-2">
        <DataUserName :user="news.updater" class="mb-1" />
        <UiText size="xs" color="gray">{{ useDayJs().fromTime(news.createdAt) }}</UiText>
      </div>

      <UBadge :color="news.category.color" variant="soft" size="sm" class="ml-auto">{{ news.category.name }}</UBadge>
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
const { img } = useMakeLink()
const configStore = useConfigStore()
const route = useRoute()
const news = ref({
  title: '...',
  description: '...',
  og_image: null,
  updater: {
    username: '...',
  },
  category: {
    name: '...'
  },
  createdAt: '...',
  updatedAt: '...',
})
const loading = ref(true)

useSeoMeta({
  title: () => `${news.value.title} - Tin Tức - ${configStore.config.name}`,
  ogTitle: () => `${news.value.title} - Tin Tức - ${configStore.config.name}`,
  description: () => news.value.description,
  ogDescription: () => news.value.description,
  ogImage: () => img(news.value.og_image), 
  ogImageAlt: () => news.value.title,
  ogType: 'article',
  articleAuthor: () => news.value.updater.username,
  articleSection: () => news.value.category.name,
  articlePublishedTime: () => news.value.createdAt,
  articleModifiedTime: () => news.value.updatedAt
})

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
    return false
  }
}
getNews()
</script>