<template>
  <div>
    <UiFlex class="relative m-3">
      <UAvatar :src="user.avatar" :alt="user.username" class="rounded-full"></UAvatar>
      <img :src="`/images/user/level/${user.level ? user.level.number : 1}.webp`" class="absolute" style="transform: scale(2.7) translateY(1.1px) translateX(0.1px)"/>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])
</script>
