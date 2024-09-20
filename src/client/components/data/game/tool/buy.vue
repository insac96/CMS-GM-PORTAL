<template>
  <UiContent no-dot title="Mua Tool" sub="Lựa chọn loại tool muốn mua" class="p-4">
    <UiFlex class="mb-4">
      <UCheckbox v-model="stateBuy.recharge" :color="!!game.tool.recharge ? 'green' : 'primary'" :disabled="!!game.tool.recharge" label="Nạp tiền" class="mr-auto" />
      <UiText weight="semibold" size="sm" :color="!!game.tool.recharge ? 'green' : null">{{ !!game.tool.recharge ? 'Đã mua' : toMoney(game.price.recharge)+'đ' }}</UiText>
    </UiFlex>

    <UiFlex class="mb-4">
      <UCheckbox v-model="stateBuy.mail" :color="!!game.tool.mail ? 'green' : 'primary'" :disabled="!!game.tool.mail" label="Gửi thư" class="mr-auto" />
      <UiText weight="semibold" size="sm" :color="!!game.tool.mail ? 'green' : null">{{ !!game.tool.mail ? 'Đã mua' : toMoney(game.price.mail)+'đ' }}</UiText>
    </UiFlex>

    <UiFlex class="mb-4">
      <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Đơn giá</UiText>
      <UiText weight="semibold" size="sm">{{ toMoney(totalPrice) }}đ</UiText>
    </UiFlex>

    <UiFlex justify="end" class="gap-1">
      <UButton :loading="loading" @click="buyTool">Mua</UButton>
      <UButton color="gray" :disabled="loading" @click="emits('close')">Đóng</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const {  toMoney } = useMoney()
const props = defineProps(['game'])
const emits = defineEmits(['done', 'close'])
const authStore = useAuthStore()

const loading = ref(false)

const stateBuy = ref({
  recharge: props.game.tool.recharge,
  mail: props.game.tool.mail
})

const totalPrice = computed(() => {
  let total = 0
  if(!props.game.tool.recharge && !!stateBuy.value.recharge) total = total + props.game.price?.recharge
  if(!props.game.tool.mail && !!stateBuy.value.mail) total = total + props.game.price?.mail
  return total
})

const buyTool = async () => {
  try {
    loading.value = true

    const send = JSON.parse(JSON.stringify(stateBuy.value))
    send.game = props.game.code

    const data = await useAPI('game/tool/public/project/buy', send)
    await authStore.setAuth()

    stateBuy.value.recharge = data.recharge
    stateBuy.value.mail = data.mail

    loading.value = false
    emits('done', JSON.parse(JSON.stringify(stateBuy.value)))
  }
  catch(e){
    loading.value = false
  }
}
</script>