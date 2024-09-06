<template>
  <div>
    <LoadingNewsId v-if="!!loading"/>

    <UiContent 
      v-if="!loading && !!news" 
      :title="news.title" 
      :sub="news.description" 
      :start="false"
    >
      <UiImg 
        w="4" h="2" 
        :src="news.og_image"
        :alt="news.title" 
        img-size="xs:300px sm:600 md:800px 1000px"
        preload
        class="rounded-lg shadow-md"
      />

      <UiFlex class="py-4">
        <UAvatar :src="news.updater?.avatar" size="sm" class="mr-4"/>

        <UiFlex type="col" items="start">
          <UiText color="primary" weight="semibold" class="capitalize" pointer @click="modal.user = true">{{ news.updater?.username }}</UiText>
          <UiText color="gray" weight="semibold" size="xs">{{ displayTime(news.updatedAt) }}</UiText>
        </UiFlex>

        <UBadge :color="news.category?.color || 'primary'" class="ml-auto">
          {{ news.category?.name || 'News' }}
        </UBadge>
      </UiFlex>

      <DataEmpty text="Chúng tôi đang cập nhật thông tin, vui lòng quay lại sau" v-if="!news.content"/>
      <DataEditor :content="news.content" v-else />

      <UiFlex justify="center" class="py-4">
        <NuxtLink to="/main/news">
          <UButton icon="i-bx-news" variant="soft">Xem các tin khác</UButton>
        </NuxtLink>
      </UiFlex>

      <!-- Modal User Box -->
      <UModal v-model="modal.user" :ui="{ width: 'max-w-xs sm:max-w-xs' }">
        <DataUserBox :fetch-id="news.updater?._id" />
      </UModal>
    </UiContent>
  </div>
</template>

<script setup>
const { imgLink } = useMakeLink()
const configStore = useConfigStore()

const route = useRoute()
const { displayTime } = useDayJs()

const loading = ref(true)
const modal = ref({
  user: false
})

const news = ref({
  title: 'Loading...',
  description: '...',
  og_image: '',
  category: {
    name: '...'
  },
  updater: {
    username: '...',
  },
  createdAt: '...',
  updatedAt: '...',
  keywords: ['...']
})

useSeoMeta({
  title: () => `${news.value.title} - ${configStore.config.name}`,
  ogTitle: () => `${news.value.title} - ${configStore.config.name}`,
  description: () => news.value.description,
  ogDescription: () => news.value.description,
  ogImage: () => imgLink(news.value.og_image), 
  ogImageAlt: () => news.value.title,
  ogType: 'article',
  articleAuthor: () => news.value.updater.username,
  articleSection: () => news.value.category.name,
  articlePublishedTime: () => news.value.createdAt,
  articleModifiedTime: () => news.value.updatedAt,
  articleTag: () => news.value.keywords.join(', ')
})

const getNews = async () => {
  try {
    const get = await useAPI('news/id', { _id: route.params._id })
    loading.value = false
    news.value = get
  }
  catch (e) {
    loading.value = true
  }
}
getNews()
</script>