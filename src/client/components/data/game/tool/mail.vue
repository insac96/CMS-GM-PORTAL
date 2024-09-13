<template>
  <DataEmpty class="h-[300px]" text="Vui lòng mua tool để sử dụng" v-if="!game.tool?.mail " />

  <UForm v-else></UForm>
</template>

<script setup>
const props = defineProps(['game'])
const loading = ref(false)
</script>