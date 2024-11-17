<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <UiFlex class="gap-4 py-6" items="start" v-for="(comment, index) in list" :key="index">
      <DataUserAvatar size="md" :user="comment.user" v-if="!!comment.user"/>

      <div class="w-full">
        <UiFlex class="gap-1">
          <DataUserName :user="comment.user" size="sm" />
          <UiText color="gray" size="xs" class="hidden sm:inline">viết lúc</UiText>
          <UiText color="gray" size="xs" class="sm:ml-0 ml-auto">{{ useDayJs().displayTime(comment.createdAt) }}</UiText>
        </UiFlex>
        
        <UiEditorContent :content="comment.content"></UiEditorContent>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['list'])
</script>