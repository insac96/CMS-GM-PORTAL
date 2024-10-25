<template>
  <div v-if="!!game">
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="md:col-span-5 col-span-12">
        <DataGameReview :review="game.image.review" :banner="game.image.banner" />
      </div>

      <div class="md:col-span-7 col-span-12">
        <UiContent :title="`[${game.code}] ${game.name}`" :sub="game.description" no-dot>
          <template #more>
            <UiFlex class="gap-1 ml-auto">
              <ManageGameChinaAction :game="game" @update="getGame" />

              <NuxtLink :to="`/game/china/${game.key}`">
                <UButton  icon="i-bx-power-off" color="red" square />
              </NuxtLink>
            </UiFlex>
          </template>

          <UiFlex wrap class="gap-1">
            <NuxtLink to="/game/tool">
              <UBadge color="gray" variant="soft">Game Tool</UBadge>
            </NuxtLink>
            
            <NuxtLink :to="`/game/platform/${game.platform.key}`">
              <UBadge color="gray" variant="soft">{{ game.platform.name }}</UBadge>
            </NuxtLink>
            
            <NuxtLink :to="`/game/category/${game.category.key}`">
              <UBadge color="gray" variant="soft">{{ game.category.name }}</UBadge>
            </NuxtLink>
          </UiFlex>

          <UiFlex class="my-4" justify="center">
            <UiFlex type="col" class="grow">
              <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.view) }}</UiText>
              <UiText color="gray" size="xs">Lượt xem</UiText>
            </UiFlex>

            <UiFlex type="col" class="grow border-l border-r dark:border-gray-800">
              <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.play) }}</UiText>
              <UiText color="gray" size="xs">Lượt chơi</UiText>
            </UiFlex>

            <UiFlex type="col" class="grow">
              <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.user) }}</UiText>
              <UiText color="gray" size="xs">Người chơi</UiText>
            </UiFlex>
          </UiFlex>

          <div class="my-4">
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">Doanh thu</UiText>
              <UiText weight="semibold" size="sm">{{ toMoney(game.statistic.revenue) }}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">Tỷ lệ nạp</UiText>
              <UiText weight="semibold" size="sm">{{ game.rate.pay }}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">Cập nhật cuối</UiText>
              <UiText weight="semibold" size="sm">{{ useDayJs().fromTime(game.updatedAt) }}</UiText>
            </UiFlex>
          </div>
        </UiContent>
      </div>
    </div>

    <div>
      <NuxtPage :game="game" />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'gm-china',
  middleware: 'gm'
})

const route = useRoute()
const { miniMoney, toMoney } = useMoney()

// Game Data
const game = ref(undefined)

// Loading
const loading = ref({
  game: true
})

const getGame = async () => {
  try {
    loading.value.game = true
    const data = await useAPI('game/china/manage/project/_id', { _id: route.params._id })

    game.value = data
    loading.value.game = false
  }
  catch(e){
    return false
  }
}

getGame()
</script>