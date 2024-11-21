<template>
  <div v-if="!!game">
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="md:col-span-6 col-span-12">
        <DataGameReview :review="game.image.review" :banner="game.image.banner" />
      </div>

      <div class="md:col-span-6 col-span-12">
        <UiContent :title="`[${game.code}] ${game.name}`" :sub="game.description" no-dot>
          <template #more>
            <UiFlex class="gap-1 ml-auto">
              <ManageGamePrivateAction :game="game" @update="getGame"/>

              <UDropdown :items="menus(game)">
                <UButton color="gray" icon="i-bx-menu-alt-right" />
              </UDropdown>

              <NuxtLink :to="`/game/private/${game.key}`">
                <UButton  icon="i-bx-power-off" color="red" square />
              </NuxtLink>
            </UiFlex>
          </template>

          <UiFlex wrap class="gap-1">
            <NuxtLink to="/game/private">
              <UBadge color="gray" variant="soft">Game Private</UBadge>
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
            <UiFlex justify="between" class="mb-3" v-if="!authStore.isAdmin">
              <UiText weight="semibold" color="gray" size="sm">IP Game</UiText>
              <UiText weight="semibold" size="sm">{{ game.ip || '...' }}</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">Giảm giá</UiText>
              <UiText weight="semibold" size="sm" color="rose">- {{ useRate().data(game.rate.shop).number }}%</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">VIP Tháng</UiText>
              <UiText weight="semibold" size="sm" color="rose">- {{ game.rate.shop.vip.month }}%</UiText>
            </UiFlex>
            <UiFlex justify="between" class="mb-3">
              <UiText weight="semibold" color="gray" size="sm">VIP trọn đời</UiText>
              <UiText weight="semibold" size="sm" color="rose">- {{ game.rate.shop.vip.forever }}%</UiText>
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
  layout: 'gm-private',
  middleware: 'gm'
})

const authStore = useAuthStore()
const route = useRoute()
const { miniMoney, toMoney } = useMoney()

// Game Data
const game = ref(undefined)

// Loading
const loading = ref({
  game: true
})

// Menu
const menus = (row) => [
  [
    {
      label: 'Người chơi',
      icon: 'i-bx-group',
      click: () => navigateTo(`/manage/@gm/private/${row._id}`)
    },
    {
      label: 'Nhân vật',
      icon: 'i-bxs-user-account',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/game/roles`)
    }
  ],[
    {
      label: 'Vật phẩm',
      icon: 'i-bx-pyramid',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/item`)
    },
    {
      label: 'Gói vật phẩm',
      icon: 'i-bx-package',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/item/box`)
    }
  ],[
    {
      label: 'Cửa hàng gói nạp',
      icon: 'i-bx-cylinder',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/recharge`)
    },
    {
      label: 'Cửa hàng vật phẩm',
      icon: 'i-bx-shopping-bag',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/shop/item`)
    },
    {
      label: 'Cửa hàng gói',
      icon: 'i-bxs-shopping-bag-alt',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/shop/pack`)
    },
  ],[
    {
      label: 'Sự kiện',
      icon: 'i-bx-calendar',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/event`)
    },
    {
      label: 'Giftcode',
      icon: 'i-bx-barcode',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/giftcode`)
    }
  ],[
    {
      label: 'Nhật ký',
      icon: 'i-bxs-book-open',
      click: () => navigateTo(`/manage/@gm/private/${row._id}/log`)
    }
  ]
]

const getGame = async () => {
  try {
    loading.value.game = true
    const data = await useAPI('game/private/manage/project/_id', { _id: route.params._id })

    game.value = data
    loading.value.game = false
  }
  catch(e){
    return false
  }
}

getGame()
</script>