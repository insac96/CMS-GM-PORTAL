<template>
  <UiFlex type="col" class="divide-y divide-gray-100 dark:divide-gray-800">
    <UiFlex v-for="(game, index) in list" :key="index" class="w-full gap-4 py-2">
      <UAvatar :src="game.image?.icon" :alt="game.code" />

      <div class="grow">
        <NuxtLink :to="`/game/${os}/${game.key}`" @click="emits('to')">
          <UiText color="gray" weight="semibold" class="line-clamp-2 text-xs sm:text-sm hover:text-primary hover:dark:text-primary mb-0.5">
            {{ game.name }}
          </UiText>
        </NuxtLink>
        
        <UiFlex class="gap-1">
          <NuxtLink :to="`/game/${os}`" @click="emits('to')" v-if="!!showOs">
            <UBadge color="gray" size="xs" variant="soft" class="capitalize">Game {{ os }}</UBadge>
          </NuxtLink>

          <NuxtLink :to="`/game/platform/${game.platform.key}`" @click="emits('to')">
            <UBadge color="gray" size="xs" variant="soft">{{ game.platform.name }}</UBadge>
          </NuxtLink>
          
          <NuxtLink :to="`/game/category/${game.category.key}`" @click="emits('to')">
            <UBadge color="gray" size="xs" variant="soft">{{ game.category.name }}</UBadge>
          </NuxtLink>
        </UiFlex>
      </div>

      <NuxtLink :to="`/game/${os}/${game.key}`" @click="emits('to')" v-if="!noIcon">
        <UiIcon name="i-bx-link-external" size="5" color="gray" v-if="!play"></UiIcon>
        <UButton size="2xs" color="gray" icon="i-bx-play" v-else>Chơi</UButton>
      </NuxtLink>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['os', 'list', 'noIcon', 'showOs', 'play'])
const emits = defineEmits(['to'])
</script>