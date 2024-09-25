<template>
  {{ game }}
</template>

<script setup>
const route = useRoute()
const game = ref(undefined)
const loading = ref(true)

const getGame = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/manage/project/key', { key: route.params._key })

    game.value = data
    loading.value = false
  }
  catch(e){
    return false
  }
}
getGame()
</script>