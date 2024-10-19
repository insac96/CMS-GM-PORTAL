<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <UiFlex class="gap-4 py-6" items="start" v-for="(comment, index) in list" :key="index">
      <UAvatar :src="comment.user.avatar" :alt="comment.user.username" v-if="comment.user"></UAvatar>

      <div>
        <UiFlex class="gap-1 mb-1" items="end">
          <UiText class="capitalize" size="sm" weight="semibold" color="primary">{{ comment.user.username }}</UiText>
          <UiText color="gray" size="xs">viết lúc</UiText>
          <UiText color="gray" size="xs">{{ useDayJs().displayTime(comment.createdAt) }}</UiText>
        </UiFlex>
        <DataEditor :content="comment.content"></DataEditor>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['list'])
</script>