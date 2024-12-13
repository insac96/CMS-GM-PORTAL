<template>
  <UiFlex class="w-full min-h-full max-h-full overflow-hidden" type="col">
    <UiFlex class="justify-center min-h-[var(--header-size)] max-h-[var(--header-size)] w-full">
      <NuxtLink to="/" @click="emit('to')">
        <UiLogo />
      </NuxtLink>
    </UiFlex>

    <div class="w-full grow overflow-y-auto py-2 h-0">
      <LoadingLayoutPublicMenu v-if="!!loading" />

      <UiFlex v-else type="col" v-for="(item, index) in menu" :key="`m-${index}`" class="mx-6">
        <UiFlex 
          v-if="!item.child" 
          class="LayoutPublicNavMenuItem gap-4 text-gray-500" 
          @click="goTo(item.to)"
          :class="{
            'LayoutPublicNavMenuItem--Active': item.to == activeTo
          }"
        >
          <UiIcon class="LayoutPublicNavMenuItem__Icon" :name="item.icon" size="6" />
          <UiText class="LayoutPublicNavMenuItem__Text" size="sm" weight="semibold">{{ item.title }}</UiText>
        </UiFlex>

        <div class="w-full my-4" v-else>
          <UDivider class="mb-4"></UDivider>
          <UiText size="xs" weight="bold" class="mb-4">{{ item.title }}</UiText>
          <UiFlex 
            v-for="(child, cIndex) in item.child" :key="`c-${index}-${cIndex}`" 
            class="LayoutPublicNavMenuItem gap-4 text-gray-500" 
            @click="goTo(child.to)"
            :class="{
              'LayoutPublicNavMenuItem--Active': child.to == activeTo
            }"
          >
            <UiIcon class="LayoutPublicNavMenuItem__Icon" :name="child.icon" size="6" />
            <UiText class="LayoutPublicNavMenuItem__Text" size="sm" weight="semibold">{{ child.title }}</UiText>
          </UiFlex>
        </div>
      </UiFlex>
    </div>

    <UiFlex class="w-full p-4 gap-1">
      <DataSupport class="w-full" />
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const router = useRoute()
const emit = defineEmits(['to'])
const menu = ref([])
const loading = ref(true)

const activeTo = computed(() => {
  return router.fullPath
})

const goTo = (link) => {
  if(link == activeTo.value) return
  navigateTo(link)
  emit('to')
}

const makeMenu = async () => {
  try {
    loading.value = true
    const categories = await useAPI('game/public/category/select')
    const platforms = await useAPI('game/public/platform/select')
    const list =  [
      { title: 'Nạp Xu', icon: 'i-bxs-credit-card', to: '/payment' },
      { title: 'Nâng VIP', icon: 'i-bxs-star', to: '/vip' },
      { title: 'Nhiệm Vụ', icon: 'i-bxs-book-open', to: '/mission' },
      { title: 'Tin Tức', icon: 'i-bx-news', to: '/news' },
      { title: 'Diễn Đàn', icon: 'i-bx-layer', to: '/forum' },
      { title: 'Danh Mục', child: [
        { title: 'Game Tool', icon: 'i-ion-game-controller', to: '/game/tool' },
        { title: 'Game Private', icon: 'i-fluent-games-28-filled', to: '/game/private' },
        { title: 'Game China', icon: 'i-jam-gamepad-f', to: '/game/china' },
      ]},
      { title: 'Nền Tảng', child: platforms.map(i => {
        return { title: i.name, icon: i.icon, to: `/game/platform/${i.key}` }
      })},
      { title: 'Thể Loại', child: categories.map(i => {
        return { title: i.name, icon: i.icon, to: `/game/category/${i.key}` }
      })}
    ]
    menu.value = list
    loading.value = false
  }
  catch(e){
    return false
  }
}
makeMenu()
</script>

<style lang="sass">
.LayoutPublicNavMenuItem
  width: 100%
  min-height: 40px
  max-height: 40px
  overflow: hidden
  cursor: pointer
  user-select: none
  &:hover > .LayoutPublicNavMenuItem__Icon
    color: rgb(var(--color-primary-500))
  &:hover > .LayoutPublicNavMenuItem__Text
    color: initial
  &--Active
    .LayoutPublicNavMenuItem__Icon
      color: rgb(var(--color-primary-500))
    .LayoutPublicNavMenuItem__Text
      color: initial
</style>