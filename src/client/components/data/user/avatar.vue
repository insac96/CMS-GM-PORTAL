<template>
  <div>
    <UiFlex class="relative m-3">
      <UAvatar :src="user.avatar" :alt="user.username" class="rounded-full"></UAvatar>
      <img :src="`/images/user/level/${imgLevel}.webp`" class="absolute" style="transform: scale(2.7) translateY(1.1px) translateX(0.1px)"/>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const imgLevel = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  if(!props.user.type) return props.user.level.number || 1
  if(props.user.type == 100) return 17
  return props.user.level.number || 1
})
</script>
