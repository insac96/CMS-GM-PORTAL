<template>
  <NuxtLink :to="to">
    <UCard class="transition-2 cursor-pointer" :ui="{
      base: 'hover:scale-95',
      divide: '',
      ring: 'ring-0 dark:ring-1 dark:ring-gray-800',
      shadow: 'shadow hover:shadow-xl',
      header: {
        padding: 'p-0 p-0 sm:p-0',
      },
      body: {
        padding: 'px-3 py-3 sm:p-4',
      },
      footer: {
        base: 'border-none',
        padding: 'px-3 py-0 pb-3 sm:px-4',
      }
    }">
      <template #header>
        <div class="relative overflow-hidden rounded-t-lg">
          <UiImg :src="game.image?.banner" w="16" h="9" />

          <UiIcon class="absolute top-2 left-2 jump-anim" v-if="!!game.pin" color="primary" name="i-bxs-star" size="5" />

          <UiFlex class="absolute bottom-2 left-2 gap-0.5">
            <UBadge color="gray" size="xs">{{ game.platform.name }}</UBadge>
            <UBadge color="gray" size="xs">{{ game.category.name }}</UBadge>
          </UiFlex>
        </div>
      </template>

      <template #default>
        <div class="GameRibbon bg-primary pr-2 pl-1" v-if="game.rate">
          <UiText size="sm" weight="semibold">1:{{ game.rate.pay }}</UiText>
        </div>

        <UiText weight="bold" class="mb-0.5 line-clamp-1 text-sm sm:text-base text-gray-300 hover:text-primary">
          {{ game.name }}
        </UiText>
        
        <UiText color="gray" class="italic line-clamp-2 text-xs min-h-[32px]">
          {{ game.description }}
        </UiText>
      </template>

      <template #footer>
        <UiFlex class="gap-1" justify="center">
          <UBadge size="xs" color="gray" variant="soft">
            <UiIcon name="i-bx-show" size="4"/>
            <UiText class="mx-0.5">{{ useMoney().miniMoney(game.statistic.view) }}</UiText>
          </UBadge>

          <UBadge size="xs" color="gray" variant="soft">
            <UiIcon name="i-bx-play" size="4"/>
            <UiText class="mx-0.5">{{ useMoney().miniMoney(game.statistic.play) }}</UiText>
          </UBadge>

          <UBadge size="xs" color="gray" variant="soft">
            <UiIcon name="i-bx-group" size="4"/>
            <UiText class="mx-0.5">{{ useMoney().miniMoney(game.statistic.user) }}</UiText>
          </UBadge>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['game', 'os', 'gm'])

const to = computed(() => {
  if(!props.gm) return `/game/${props.os}/${props.game?.key}`
  if(!!props.gm) return `/manage/@gm/${props.os}/${props.game?._id}`
})
</script>

<style lang="sass">
.GameRibbon
  --f:.5em
  --r:.8em
  position: absolute
  top: 10px
  right: calc(-1*var(--f))
  border-bottom: var(--f) solid #0005
  border-left: var(--r) solid #0000
  clip-path: polygon(var(--r) 0, 100% 0, 100% calc(100% - var(--f)), calc(100% - var(--f)) 100%, calc(100% - var(--f)) calc(100% - var(--f)), var(--r) calc(100% - var(--f)), 0 calc(50% - var(--f)/2))
</style>