<template>
  <div>
    <UiFlex class="relative m-3 cursor-pointer" @click="viewAction">
      <UAvatar :src="user.avatar" :alt="user.username" class="AvatarImg" :size="size || 'xs'" style="transform: scale(1.2)"></UAvatar>
      <img :src="`/images/user/frame/${level}.png`" class="absolute select-none pointer-events-none" style="transform: scale(1.9) translateY(1px)" />
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="user._id" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'xs' },
  noAction: { type: Boolean, default: false },
})

const view = ref(false)

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1

  const level = props.user.level?.number || 1
  return level
})

const viewAction = () => {
  if(!!props.noAction) return
  view.value = true
}
</script>
