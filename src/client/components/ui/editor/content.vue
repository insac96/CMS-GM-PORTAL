<template>
  <div v-html="content" class="tiptap !p-0"></div>
</template>

<script setup>
defineProps(['content'])
</script>