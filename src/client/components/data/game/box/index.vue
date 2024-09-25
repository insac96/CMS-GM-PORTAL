<template>
  <NuxtLink :to="to">
    <UCard class="overflow-hidden transition-2 cursor-pointer" :ui="{
      divide: '',
      ring: 'ring-0',
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
        <UiImg :src="game.image?.banner" w="16" h="9" />
      </template>


      <UiFlex class="gap-4">
        <UAvatar :src="game.image?.icon" :alt="game.code" class="hidden md:flex" v-if="!gm" />

        <div>
          <UiText color="gray" weight="semibold" class="line-clamp-1 text-sm sm:text-base">
            {{ game.name }}
          </UiText>
          
          <UiText color="gray" class="line-clamp-2 text-xs sm:text-sm">
            {{ game.description }}
          </UiText>
        </div>
      </UiFlex>

      <template #footer>
        <UiFlex>
          <UiFlex class="gap-2 hidden sm:flex" v-if="!gm">
            <UiIcon name="i-bxs-star" :color="!!game.pin ? 'primary' : 'gray'" />
            <UiText color="gray" size="xs" weight="semibold" class="relative top-[1px]" v-if="game.statistic.play > 0">{{ useMoney().miniMoney(game.statistic.play) }}</UiText>
          </UiFlex>

          <UButton 
            :class="{
              '!w-full': !!gm,
              'ml-auto w-full justify-center sm:w-auto': true
            }"
            :icon="!!gm ? 'i-bxs-edit' : 'i-bx-play'"
            block
          >
            {{ !!gm ? 'Quản Lý' : 'Chơi' }}
          </UButton>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['game', 'os', 'gm'])

const to = computed(() => {
  if(!props.gm) return `/game/${props.os}/${props.game?.key}`
  if(!!props.gm) return `/manage/@gm/${props.os}/${props.game?.key}`
})
</script>