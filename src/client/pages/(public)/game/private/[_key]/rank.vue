<template>
  <DataGamePrivateRank :game="game"/>
</template>

<script setup>
const game = useAttrs().game
</script>