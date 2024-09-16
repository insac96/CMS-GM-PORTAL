<template>
  <iframe 
    title="Playing Game"
    :src="route.query.url"
    width="100%"
    height="100%"
    class="Iframe"
  ></iframe>

  <DataGameToolPlayDrag :game="game" v-if="game" />

  <UModal v-model="modal.recharge">
    <DataGameToolRechargeBuy
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
  middleware: 'auth'
})

const route = useRoute()
const loading = ref(false)
const game = ref(undefined)

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

    const data = await useAPI('game/tool/public/project/recharge/check', JSON.parse(JSON.stringify(send)))
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

const getGame = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/public/project/play/verify', JSON.parse(JSON.stringify(route.query)))

    game.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}
getGame()
</script>