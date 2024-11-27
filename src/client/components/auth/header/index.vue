<template>
  <UiFlex class="gap-1">
    <UButtonGroup>
      <UButton square icon="i-bx-coin" @click="navigateTo('/payment')" />
      <UButton color="gray" @click="navigateTo('/payment')">{{ authStore.profile.currency.coin > 0 ? useMoney().miniMoney(authStore.profile.currency.coin) : 'Nạp' }}</UButton>
    </UButtonGroup>

    <AuthHeaderNotify />

    <AuthHeaderMessage />
    
    <AuthHeaderMenu />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
</script>