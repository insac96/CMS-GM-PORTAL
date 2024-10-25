<template>
  <div>
    <UiFlex class="relative m-3">
      <UAvatar :src="user.avatar" :alt="user.username" class="rounded-full" :size="size || 'xs'"></UAvatar>
      <img :src="`/images/user/level/${level}.webp`" class="absolute" style="transform: scale(2.7) translateY(1.1px) translateX(0.1px)"/>
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="user._id" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['user', 'size'])

const view = ref(false)

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  if(!props.user.type) return props.user.level.number || 1
  // if(props.user.type == 100) return 15
  return props.user.level.number || 1
})
</script>
