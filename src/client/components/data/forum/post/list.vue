<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <UiFlex v-for="(item, i) in list" :key="i" class="py-4 gap-4">
      <DataUserAvatar :user="item.creater" size="md" v-if="!!item.creater" />

      <div class="grow">
        <NuxtLink :to="`/forum/post/${item.key}`">
          <UiText weight="bold" class="md:text-base text-sm select-none">{{ item.title }}</UiText>
        </NuxtLink>

        <UiFlex class="mt-2 gap-1" wrap>
          <UBadge :color="item.category.color" variant="soft">{{ item.category.name }}</UBadge>
          <UBadge color="gray" variant="soft" v-if="item.sub">{{ item.sub.name }}</UBadge>
          <UiText color="gray" class="text-xs select-none ml-2">{{ useDayJs().fromTime(item.update.last) }}</UiText>
        </UiFlex>

        <UiFlex class="mt-2 gap-1 md:hidden">
          <UBadge color="gray">
            <UIcon name="i-bx-show" class="mr-1" /> {{ item.statistic.view }}
          </UBadge>

          <UBadge color="gray">
            <UIcon name="i-bx-like" class="mr-1" /> {{ item.statistic.like }}
          </UBadge>

          <UBadge color="gray">
            <UIcon name="i-bx-chat" class="mr-1" /> {{ item.statistic.comment }}
          </UBadge>
        </UiFlex>
      </div>

      <UiFlex class="divide-x divide-gray-100 dark:divide-gray-800 hidden md:flex select-none">
        <UiFlex type="col" class="px-2">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.statistic.view) }}</UiText>
          <UiText size="xs" color="gray">Lượt xem</UiText>
        </UiFlex>

        <UiFlex type="col" class="px-2">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.statistic.like) }}</UiText>
          <UiText size="xs" color="gray">Thích</UiText>
        </UiFlex>

        <UiFlex type="col" class="px-2">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.statistic.comment) }}</UiText>
          <UiText size="xs" color="gray">Bình luận</UiText>
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['list'])
</script>