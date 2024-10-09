<template>
  <NuxtLink :to="`/news/${news.key}`">
    <UCard class="overflow-hidden transition-2 cursor-pointer" :ui="{
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

      <div>
        <UiText color="gray" weight="semibold" class="line-clamp-1 text-sm sm:text-base">
          {{ news.title }}
        </UiText>
        
        <UiText color="gray" class="line-clamp-2 text-xs sm:text-sm">
          {{ news.description }}
        </UiText>
      </div>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['news'])
</script>