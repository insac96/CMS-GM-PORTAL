<template>
  <NuxtLink :to="`/news/${news.key}`">
    <UCard class="overflow-hidden transition-2 cursor-pointer" :ui="{
      base: 'hover:scale-95',
      divide: '',
      ring: 'ring-0 dark:ring-1 dark:ring-gray-800',
      shadow: 'shadow hover:shadow-xl',
      header: {
        padding: 'p-0 p-0 sm:p-0',
      },
      body: {
        padding: 'px-3 py-3 sm:p-4',
      },
      footer: {
        base: 'border-none',
        padding: 'px-3 py-0 pb-3 sm:px-4',
      }
    }">
      <template #header>
        <UiImg :src="news.og_image" w="16" h="9" />
      </template>

      <template #default>
        <UiText weight="bold" class="mb-0.5 line-clamp-1 text-sm sm:text-base text-gray-300 hover:text-primary">
          {{ news.title }}
        </UiText>
        
        <UiText color="gray" class="italic line-clamp-2 text-xs min-h-[32px]">
          {{ news.description }}
        </UiText>

        <UiText color="gray" weight="semibold" class="text-xs mt-2">
          {{ news.category?.name || 'News' }} | {{ useDayJs().displayTime(news.createdAt) }}
        </UiText>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['news'])
</script>