<template>
  <UiFlex class="select-none">
    <img :src="configStore.config.logo_image" :style="{ height: `${imgSize}px` }"  v-if="!!configStore.config.logo_image" />
    
    <UiText weight="bold" size="2xl" color="primary" class="italic" v-else>
      ENI <span class="text-white text-base">Studio</span>
    </UiText>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  imgSize: { type: Number || String, default: 23 }
})
const configStore = useConfigStore()
</script>