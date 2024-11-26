<template>
  <div class="UserName">
    <UiFlex class="relative gap-2 cursor-pointer z-[2]" @click="viewAction">
      <img src="/images/user/vip.png" :style="{
        height: sizeVip[size]+'px'
      }" v-if="!!vip" />
      
      <img :src="`/images/user/stone/${level}.webp`" class="select-none pointer-events-none" :width="sizeStone[size]" :height="sizeStone[size]"/>

      <UiText :size="size" weight="semibold" :class="{
        'relative capitalize flex items-center justify-start select-none pointer-events-none': true,
        [`User--${level} UserName__text`]: true,
        [`UserName__text__anim`]: level >= 5 ? true : false
      }">
        <img class="UserName__lightning" src="/images/user/effect/lightning.gif" v-if="level >= 10" />
        {{ !!user ? user.username : 'Ẩn danh'}}
      </UiText>
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="user._id" @close="view = false"/>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' },
  noAction: { type: Boolean, default: false },
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

const sizeVip = {
  'xs': 10,
  'sm': 11,
  'md': 13,
  'lg': 14,
  'xl': 15,
  '2xl': 16,
  '3xl': 17,
}

const vip = computed(() => {
  if(!props.user) return false
  if(!props.user.vip) return false
  if(!props.user.vip.month || !props.user.vip.forever) return false

  if(props.user.vip.month.enable) return true
  if(props.user.vip.forever.enable) return true
  return false
})

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  
  const level = props.user.level?.number || 1
  return level > 10 ? 10 : level
})

const viewAction = () => {
  if(!!props.noAction) return
  view.value = true
}
</script>

<style lang="sass">
.User
  &--10
    --user-color: #d62d6c
  &--9
    --user-color: #d97b22
  &--8
    --user-color: #bc15ce
  &--7
    --user-color: #0c64ad
  &--6
    --user-color: #8622ef
  &--5
    --user-color: #d97b22
  &--4
    --user-color: #2bced6
  &--3
    --user-color: #02ab96
  &--2
    --user-color: #47ae07
    
.UserName
  position: relative
  &__lightning
    position: absolute
    transform: rotate(90deg) scale(1.5)
    left: 0
    filter: brightness(2)
    max-height: 80px
  &__text
    color: #fff
    text-shadow: 0px 0px 5px var(--user-color), 0px 0px 7px var(--user-color)
    &__anim
      animation: user-name .75s ease-out infinite

@keyframes user-name
  from
    text-shadow: 0px 0px 10px var(--user-color), 0px 0px 10px var(--user-color), 0px 0px 20px var(--user-color)
</style>