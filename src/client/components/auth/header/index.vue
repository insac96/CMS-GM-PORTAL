<template>
  <UiFlex class="gap-1">
    <UButton color="primary" @click="navigateTo('/payment')" variant="soft" icon="i-bx-coin">
      <UiText size="xs" weight="bold">{{ useMoney().toMoney(authStore.profile.currency.coin) }}</UiText>
    </UButton>

    <AuthHeaderNotify />
    
    <AuthHeaderMenu />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
</script>