<template>
  <NuxtLink :to="to">
    <UCard class="overflow-hidden transition-2 cursor-pointer " :ui="{
      base: 'hover:scale-95',
      divide: '',
      ring: 'ring-0 dark:ring-1 dark:ring-gray-800 hover:dark:ring-2 hover:dark:ring-primary-500',
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
        <div class="relative">
          <UiImg :src="game.image?.banner" w="16" h="9" />

          <UiIcon class="absolute top-2 left-2 jump-anim" v-if="!!game.pin" color="primary" name="i-bxs-star" size="5" />

          <UiFlex class="absolute bottom-2 left-2 gap-0.5">
            <NuxtLink :to="`/game/platform/${game.platform.key}`">
              <UBadge color="gray" size="xs">{{ game.platform.name }}</UBadge>
            </NuxtLink>
            
            <NuxtLink :to="`/game/category/${game.category.key}`">
              <UBadge color="gray" size="xs">{{ game.category.name }}</UBadge>
            </NuxtLink>
          </UiFlex>
        </div>
      </template>

      <UiFlex class="gap-4">
        <!-- <UAvatar :src="game.image?.icon" :alt="game.code" class="hidden md:flex" v-if="!gm" /> -->

        <div>
          <UiText color="gray" weight="bold" class="mb-0.5 line-clamp-1 text-sm sm:text-base">
            {{ game.name }}
          </UiText>
          
          <UiText color="gray" class="italic line-clamp-2 text-xs min-h-[32px]">
            {{ game.description }}
          </UiText>
        </div>
      </UiFlex>

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