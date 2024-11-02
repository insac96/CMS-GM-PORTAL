<template>
  <div :class="{
    'NotifyGlobalText h-[20px]': true
  }">
    <p 
      id="NotifyGlobalText"
      :class="{
        'NotifyGlobalText__Content text-sm font-semibold': true,
        'NotifyGlobalText__Anim': !!isRunning
      }" 
      v-html="text"
    ></p>
  </div>
</template>

<script setup>
const { $socket } = useNuxtApp()
const isRunning = ref(false)
const emits = defineEmits(['running'])
const text = ref(null)
const list = ref([
  'Chào mừng đến với cổng game <b class="text-primary-500">ENI Studio</b>, chúc bạn có những phút giây chơi game vui vẻ...'
])
const length = computed(() => {
  return list.value.length
})

const start = () => {
  const el = document.getElementById('NotifyGlobalText')
  setTimeout(() => {
    el.style.right = (el.offsetWidth * -1)+'px'
    isRunning.value = true
  }, 1)
  el.addEventListener("animationend", stop)
}

const stop = () => {
  list.value.shift()
  const el = document.getElementById('NotifyGlobalText')
  el.style.right = '-9999px'
  text.value = null
  isRunning.value = false
  emits('running', false)
  el.removeEventListener("animationend", stop)
  run()
}

const run = () => {
  if(list.value.length == 0) return text.value = null, isRunning.value = false
  text.value = list.value[0]
  start()
  emits('running', true)
}

onMounted(() => {
  run()
  
  $socket.on('notify-global-push', (data) => {
    list.value.push(data)
  })
})
watch(() => length.value, () => !isRunning.value && run())
</script>

<style lang="sass">
.NotifyGlobalText
  position: relative
  overflow: hidden
  &__Content
    position: absolute
    padding: 0
    width: max-content
    right: -9999px
  &__Anim
    animation: marquee 20s linear

@keyframes marquee
  to
    right: 100%
</style>