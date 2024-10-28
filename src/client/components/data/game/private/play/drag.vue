<template>
  <div>
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown :items="list" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true',
        offsetDistance: 14
      }">
        <img v-if="!!game.image.icon" :src="game.image.icon" class="w-full h-full rounded-full" />
        <UiIcon v-else name="i-bxs-customize" color="primary" size="8" />
      </UDropdown>
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!dragging"></div>

    <!--Giftcode-->
    <UModal v-model="modal.giftcode" preventClose>
      <DataGamePrivateGiftcode
        :game="game" 
        @close="modal.giftcode = false" 
        class="p-4"
      /> 
    </UModal>

    <!--Shop-->
    <UModal v-model="modal.shop" preventClose :ui="{ width: 'sm:max-w-3xl' }">
      <UiContent title="Cửa Hàng" sub="Mua vật phẩm gửi vào game" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.shop = false"></UButton>
        </template>

        <DataGamePrivateShop :game="game" />
      </UiContent>
    </UModal>

    <!--Event-->
    <UModal v-model="modal.event" preventClose :ui="{ width: 'sm:max-w-3xl' }">
      <UiContent title="Sự Kiện" sub="Các sự kiện của trò chơi" class="p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.event = false"></UButton>
        </template>
        
        <DataGamePrivateEvent :game="game" />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const props = defineProps(['game'])

const el = ref(null)
const dragging = ref(false)
const modal = ref({
  giftcode: false,
  shop: false,
  event: false
})

const { style } = useDraggable(el, {
  initialValue: { x: 0, y: 0 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const list = [
  [{
    label: 'Giftcode',
    icon: 'i-bx-barcode',
    click: () => modal.value.giftcode = true,
  },{
    label: 'Cửa Hàng',
    icon: 'i-bx-store',
    click: () => modal.value.shop = true,
  },{
    label: 'Sự Kiện',
    icon: 'i-bx-calendar',
    click: () => modal.value.event = true,
  }],
  [{
    label: 'Thoát',
    icon: 'i-bx-log-out',
    click: () => useTo().navigateToSSL(`/game/private/${props.game.key}`)
  }]
]
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 45px
  min-height: 45px
  width: 45px
  height: 45px
  max-width: 45px
  max-height: 45px
  z-index: 100
  cursor: pointer
</style>