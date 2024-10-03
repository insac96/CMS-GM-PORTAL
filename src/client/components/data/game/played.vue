<template>
  <div class="p-2">
    <SelectGameOs v-model="os" class="mb-2" />

    <DataGameToolPlayed :user="user" v-if="os == 'tool'" />
    <DataGamePrivatePlayed :user="user" v-if="os == 'private'" />
    <DataGameChinaPlayed :user="user" v-if="os == 'china'" />
  </div>
</template>

<script setup>
const props = defineProps(['user'])
const os = ref('tool')
</script>