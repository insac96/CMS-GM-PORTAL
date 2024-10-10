<template>
  <div class="w-full h-full" v-if="!!verify && !!game">
    <iframe title="Playing Game" :src="verify.url" width="100%" height="100%" class="Iframe"></iframe>

    <DataGameToolPlayDrag :game="game" @buy-tool="doneBuyTool"/>

    <UModal v-model="modal.recharge">
      <DataGameToolRechargeBuy
        :game="selectRecharge.game"
        :recharge="selectRecharge.recharge"
        :server="selectRecharge.server"
        @close="modal.recharge = false"
      />
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'play',
  middleware: 'auth'
})

const route = useRoute()
const loading = ref(false)
const game = ref(undefined)
const verify = ref(undefined)

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
    if(!detail.item_id || !detail.item_name || !detail.price) return
    const send = JSON.parse(JSON.stringify(detail))
    send.game = route.query.game

    const data = await useAPI('game/tool/public/recharge/check', JSON.parse(JSON.stringify(send)))
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

const doneBuyTool = (state) => {
  game.value.tool.recharge = state.recharge
  game.value.tool.mail = state.mail
}

const getGame = async () => {
  try {
    loading.value = true
    const verifyData = await useAPI('game/tool/public/project/play/verify', JSON.parse(JSON.stringify(route.query)))
    const gameData = await useAPI('game/tool/public/project/key', { key: verifyData.key })

    game.value = gameData
    verify.value = verifyData
    loading.value = false
  }
  catch(e){
    return false
  }
}

onMounted(() => setTimeout(getGame, 1))
</script>