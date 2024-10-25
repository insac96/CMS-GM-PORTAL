<template>
  <div class="UserName">
    <UiFlex class="gap-2 cursor-pointer z-[2]" @click="view = true">
      <img :src="`/images/user/stone/${level}.webp`" :width="sizeStone[size]" :height="sizeStone[size]"/>
      <UiText :size="size" weight="semibold" :class="`capitalize User--${level} UserName__text`">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="user._id" />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' }
})

const view = ref(false)

const sizeStone = {
  'xs': 10,
  'sm': 12,
  'md': 14,
  'lg': 16,
  'xl': 18,
  '2xl': 20,
  '3xl': 22,
}

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  if(!props.user.type) return props.user.level.number || 1
  // if(props.user.type == 100) return 11
  return props.user.level.number || 1
})
</script>

<style lang="sass">
.UserName
  position: relative
  &__text
    color: #fff
    text-shadow: 0px 0px 5px var(--user-color), 0px 0px 7px var(--user-color)
    animation: user-name .75s ease-out infinite

@keyframes user-name
  from
    text-shadow: 0px 0px 10px var(--user-color), 0px 0px 10px var(--user-color), 0px 0px 20px var(--user-color)
</style>