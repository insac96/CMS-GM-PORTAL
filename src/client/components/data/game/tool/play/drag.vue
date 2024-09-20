<template>
  <div>
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown :items="list" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true',
        offsetDistance: 14
      }">
        <UiImg v-if="!!game.image.icon" :src="game.image.icon" w="1" h="1" img-w="100" img-h="100" class="w-full h-full overflow-hidden rounded-full" />
        <UiIcon v-else name="i-bxs-customize" color="primary" size="8" />
      </UDropdown>
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!dragging"></div>

    <!--Buy Tool-->
    <UModal v-model="modal.buy" prevent-close>
      <DataGameToolBuy :game="game" @close="modal.buy = false" @done="doneBuyTool"></DataGameToolBuy>
    </UModal>

    <!--Recharge-->
    <UModal v-model="modal.recharge" :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <UiContent :title="game.name" sub="Tool nạp vào trò chơi" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="sm" color="gray" square @click="modal.recharge = false"></UButton>
        </template>

        <DataGameToolRecharge :game="game" />

        <UiFlex justify="end" class="mt-2">
          <UButton color="gray" @click="modal.recharge = false">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <!--Mail-->
    <UModal v-model="modal.mail" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <UiContent :title="game.name" sub="Tool gửi thư vào trò chơi" class="p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="sm" color="gray" square @click="modal.mail = false"></UButton>
        </template>

        <DataGameToolMail :game="game">
          <template #close="{ loading }">
            <UButton color="gray" :disabled="loading" @click="modal.mail = false">Đóng</UButton>
          </template>
        </DataGameToolMail>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const props = defineProps(['game'])
const emits = defineEmits(['buyTool'])

const el = ref(null)
const dragging = ref(false)
const modal = ref({
  buy: false,
  recharge: false,
  mail: false
})

const { style } = useDraggable(el, {
  initialValue: { x: -8, y: -8 },
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
    label: 'Mua Tool',
    icon: 'i-bx-shopping-bag',
    click: () => modal.value.buy = true,
    disabled: !!props.game?.tool?.recharge && !!props.game?.tool?.mail
  }],
  [{
    label: 'Nạp game',
    icon: 'i-bx-package',
    click: () => modal.value.recharge = true
  },{
    label: 'Gửi thư',
    icon: 'i-bx-mail-send',
    click: () => modal.value.mail = true
  }],
  [{
    label: 'Thoát',
    icon: 'i-bx-log-out',
    click: () => useTo().navigateToSSL(`/game/tool/${props.game.key}`)
  }],
]

const doneBuyTool = (state) => {
  emits('buyTool', state)
  modal.value.buy = false
}
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