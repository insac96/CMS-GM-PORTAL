<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <UiFlex v-for="(item, i) in list" :key="i" class="py-4 gap-4">
      <div class="grow">
        <NuxtLink :to="`/news/${item.key}`">
          <UiText weight="bold" class="md:text-base text-sm select-none hover:text-primary-500 text-gray-400">{{ item.title }}</UiText>
        </NuxtLink>

        <UiFlex class="mt-2 gap-1" wrap>
          <UBadge :color="item.category.color" variant="soft">{{ item.category.name }}</UBadge>
          <UBadge color="gray" class="xl:hidden">
            <UIcon name="i-bx-show" class="mr-1" /> {{ item.view }}
          </UBadge>
          <UiText color="gray" class="text-xs select-none ml-2">{{ useDayJs().fromTime(item.createdAt) }}</UiText>
        </UiFlex>
      </div>

      <UiFlex class="divide-x divide-gray-100 dark:divide-gray-800 hidden xl:flex select-none">
        <UiFlex type="col" justify="center" class="px-2">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.view) }}</UiText>
          <UiText size="xs" color="gray">Lượt xem</UiText>
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['list'])
</script>