<template>
  <iframe 
    title="Playing Game"
    :src="route.query.url"
    width="100%"
    height="100%"
    class="Iframe"
  ></iframe>

  <UModal v-model="modal.recharge">
    <DataGameToolBuy
      :game="selectRecharge.game"
      :recharge="selectRecharge.recharge"
      :server="selectRecharge.server"
      @close="modal.recharge = false" 
    />
  </UModal>
</template>

<script setup>
useSeoMeta({
  title: () => `Playing Game`,
  robots: 'none'
})

definePageMeta({
  layout: 'play',
  middleware: 'play-game-tool'
})

const route = useRoute()

const modal = ref({
  recharge: false,
  mail: false
})

const selectRecharge = ref({
  recharge: null,
  server: null,
  game: {
    code: route.query.game
  }
})

const onRecharge = async (detail) => {
  try {
    const send =JSON.parse(JSON.stringify(detail))
    send.game = route.query.game

    const data = await useAPI('game/tool/public/project/play/recharge', JSON.parse(JSON.stringify(send)))
    selectRecharge.value.recharge = data.recharge
    selectRecharge.value.server = data.server
    modal.value.recharge = true
  }
  catch (e) {
    return
  }
}

const onMessage = (e) => {
  const detail = e.data
  if(!detail) return
  onRecharge(detail)
}

onMounted(() => {
  window.addEventListener('message', onMessage, false)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('message', onMessage, false)
})
</script>