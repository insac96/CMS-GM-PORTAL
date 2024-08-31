<template>
  <UCard v-if="news" class="BoxNews" :ui="{
    body: { padding: 'p-0 sm:p-0' },
    footer: { padding: 'pb-2 sm:pb-2 pt-0 sm:pt-0 sm:px-4 px-4', base: 'border-none' },
    shadow: 'shadow-md hover:shadow-lg',
    ring: 'dark:ring-1 ring-0 hover:ring-2 dark:hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400',
  }">
    <div @click="open(news._id)" class="cursor-pointer w-full">
      <UiImg :src="news.og_image" w="16" h="9" class="w-full" />
    </div>

    <div class="pt-2.5 pb-3 px-4">
      <NuxtLink :to="`/main/news/${news._id}`" class="md:text-md text-sm line-clamp-1 text-gray hover:text-primary font-semibold">
        {{ news.title }}
      </NuxtLink>
      
      <UiText class="line-clamp-2 md:text-sm text-xs md:mt-0 mt-0.5 md:min-h-[40px] min-h-[32px]" color="gray">
        {{ news.description }}
      </UiText>
    </div>

    <template #footer>
      <UiFlex justify="between">
        <UiText color="gray" weight="semibold" class="text-xs mr-auto">
          {{ displayTime(news.updatedAt) }}
        </UiText>

        <UBadge :color="news.category?.color || 'primary'">
          {{ news.category?.name || 'News' }}
        </UBadge>
      </UiFlex>
    </template>
  </UCard>
</template>

<script setup>
defineProps(['news'])

const { displayTime } = useDayJs()

const open = async (_id) => {
  await navigateTo(`/main/news/${_id}`)
}
</script>

<style lang="sass">
.BoxNews
  transition: all 0.25s ease
  overflow: hidden
  &:hover
    transform: translateY(-5px)
  img
    aspect-ratio: 16 / 9
</style>