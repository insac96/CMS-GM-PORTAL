<template>
  <UCard :ui="{ 
    base: 'overflow-hidden',
    background: 'bg-gray-100 dark:bg-gray-800',
    body: { padding: 'px-4 sm:px-4 py-1.5 sm:py-1.5', background: 'bg-white dark:bg-gray-900' },
    header: { padding: 'px-4 sm:px-4 py-2 sm:py-2', }
  }">
    <template #header>
      <slot name="header"></slot>
    </template>

    <slot></slot>
  </UCard>
</template>