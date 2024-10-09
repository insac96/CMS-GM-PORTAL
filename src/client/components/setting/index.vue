<template>
  <UiFlex>
    <UButton icon="i-bx-cog" variant="soft" aria-label="Theme" square @click="open = true"/>

    <UModal v-model="open" :ui="{width: 'sm:max-w-[280px]'}">
      <UiContent title="Giao Diện" sub="Chỉnh sửa giao diện" no-dot class="p-4">
        <SettingMode class="mb-2"/>
        <SettingColor />
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>