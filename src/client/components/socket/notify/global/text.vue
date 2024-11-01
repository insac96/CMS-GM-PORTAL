<template>
  <div :class="{
    'NotifyGlobalText': true,
    'h-[30px]': !!isRunning
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
const isRunning = ref(false)
const text = ref(null)
const list = ref([
  'Đặc quyền VIP 30 ngày',
  'Giảm 50% mua Tool tất cả các trò chơi',
  'Giảm 10% mua các tài nguyên Private'
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
  el.removeEventListener("animationend", stop)
  run()
}

const run = () => {
  if(list.value.length == 0) return text.value = null, isRunning.value = false
  text.value = list.value[0]
  start()
}

onMounted(() => run())
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
    animation: marquee 15s linear

@keyframes marquee
  to
    right: 100%
</style>