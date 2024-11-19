<template>
  <div>
    <DataUserBox :fetch-id="user" v-model:user-data="userData"></DataUserBox>

    <div class="px-4 pb-2">
      <UAccordion
        color="primary"
        variant="soft"
        size="md"
        :items="menu"
      >
        <template #default="{ item, open }">
          <UButton :color="open ? 'primary' : 'gray'" size="md" class="mb-2">
            {{ item.label }}
          </UButton>
        </template>

        <template #log>
          <UCard :ui="{ body: { padding: 'p-4 sm:py-4' }}">
            <ManageUserLog :user="user" />
          </UCard>
        </template>

        <template #ip>
          <UCard :ui="{ body: { padding: 'p-4 sm:py-4' }}">
            <ManageUserIp :user="user" />
          </UCard>
        </template>

        <template #payment>
          <UCard :ui="{ body: { padding: 'py-0 sm:py-0 px-2 sm:px-2'}}">
            <DataPaymentHistory :user="user" />
          </UCard>
        </template>

        <template #played>
          <UCard :ui="{ body: { padding: 'py-0 sm:py-0 px-2 sm:px-2'}}">
            <DataGamePlayed :user="user" />
          </UCard>
        </template>
      </UAccordion>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const route = useRoute()

const userData = ref(null)

const menu = [
  { label: 'Dòng thời gian', slot: 'log' },
  { label: 'Địa chỉ IP', slot: 'ip' },
  { label: 'Nạp tiền', slot: 'payment' },
  { label: 'Trò chơi đã chơi', slot: 'played' },
]
</script>