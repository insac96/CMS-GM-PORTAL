<template>
  <iframe 
    title="Playing Game"
    :src="playCookie"
    width="100%"
    height="100%"
    class="Iframe"
  ></iframe>

  <LayoutPlayDrag />
  
  <UModal v-model="fastShop.modal" prevent-close>
    
  </UModal>
</template>

<script setup>
definePageMeta({
  layout: 'play',
})

// Recharge Game
const fastShop = ref({
  modal: false,
  item: null,
  server: null
})

const onFastShop = async (detail) => {
  try {
    const data = await useAPI('shop/getFast', JSON.parse(JSON.stringify(detail)))
    fastShop.value.item = data.item
    fastShop.value.server = data.server
    fastShop.value.modal = true
  }
  catch (e) {
    return
  }
}

const onDoneBuy = async (data) => {
  
}

// On Fast
const onFast = (e) => {
  const detail = e.data
  if(!detail) return
  if(detail.item_id) return onFastShop(detail)
}

onMounted(() => {
  window.addEventListener('message', onFast, false)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('message', onFast, false)
})
</script>