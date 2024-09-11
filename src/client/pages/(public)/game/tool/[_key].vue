<template>
  <div>
    <!-- Header -->
    <div class="grid grid-cols-12 gap-2 md:gap-4 mb-4">
      <div class="md:col-span-8 col-span-12">
        <DataGameReview />
      </div>

      <UiContent class="md:col-span-4 col-span-12" title="Tu Tiên Ký" sub="Game PK số 1 Việt Nam">
        <UiFlex wrap class="gap-1">
          <UBadge color="gray" variant="soft">Game Tool</UBadge>
          <UBadge color="gray" variant="soft">Game H5</UBadge>
          <UBadge color="gray" variant="soft">Thẻ Bài</UBadge>
        </UiFlex>

        <UiFlex class="my-4" justify="center">
          <UiFlex type="col" class="grow border-r">
            <UiText size="sm" weight="semibold">1.2m</UiText>
            <UiText color="gray" size="xs">Lượt xem</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow border-l">
            <UiText size="sm" weight="semibold">1.2m</UiText>
            <UiText color="gray" size="xs">Lượt chơi</UiText>
          </UiFlex>
        </UiFlex>

        <div class="my-4">
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Cập nhật</UiText>
            <UiText weight="semibold" size="sm">1 giờ trước</UiText>
          </UiFlex>
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="sm">Tool nạp</UiText>
            <UiText weight="semibold" size="sm">100.000đ</UiText>
          </UiFlex>
          <UiFlex justify="between">
            <UiText weight="semibold" color="gray" size="sm">Tool thư</UiText>
            <UiText weight="semibold" size="sm">100.000đ</UiText>
          </UiFlex>
        </div>

        <UAlert class="my-4" color="gray" variant="soft" description="Nếu không mua tool, bạn vẫn có thể chơi bình thường"/>

        <UiFlex class="gap-1">
          <UButton icon="i-bx-play" class="grow justify-center" size="lg">Chơi Ngay</UButton>
          <UButton icon="i-bx-cart" class="grow justify-center" size="lg" color="gray">Mua Tool</UButton>
        </UiFlex>
      </UiContent>
    </div>

    <!--Content-->
    <div>
      <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-1"></UTabs>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const tab = ref(0)
const tabs = [{
  label: 'Tin tức',
  icon: 'i-bx-news',
  to: ''
},{
  label: 'Nạp game',
  icon: 'i-bx-shopping-bag',
  disabled: false,
  to: 'recharge'
},{
  label: 'Gửi thư',
  icon: 'i-bx-envelope',
  disabled: false,
  to: 'mail'
}]

const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/tool/${route.params._key}/${tabSelect.to}`)
}
</script>