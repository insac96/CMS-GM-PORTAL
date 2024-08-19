<template>
  <div>
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown :items="menu" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true'
      }">
        <UiImg v-if="!!configStore.config.logo_image" :src="configStore.config.logo_image" w="1" h="1" img-w="100" img-h="100" class="w-full h-full overflow-hidden rounded-full" />
        <UiIcon v-else name="i-bx-menu" color="primary" size="8" />
      </UDropdown>
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!dragging"></div>

    <UModal v-model="modal.mail" preventClose :ui="{ width: 'lg:max-w-3xl md:max-w-2xl sm:max-w-xl' }">
      <PlayModal title="Gửi vật phẩm" @close="modal.admin.mail = false">
        
      </PlayModal>
    </UModal>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const props = defineProps(['admin'])
const configStore = useConfigStore()

const el = ref(null)
const dragging = ref(false)

const modal = ref({
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

const menu = computed(() => {
  return [
    [{
      label: 'Trang chủ',
      icon: 'i-bx-home',
      click: () => useTo().navigateToSSL('/')
    }],
    [{
      label: 'Gửi vật phẩm',
      icon: 'i-bx-envelope',
      click: () => modal.value.mail = true
    }]
  ]
})
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