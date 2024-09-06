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
          <ManageUserLog :user="user" />
        </template>

        <template #ip>
          <ManageUserIp :user="user" />
        </template>

        <template #payment>
          <DataPaymentHistory :user="user" />
        </template>

        <template #order>
          <DataOrderHistory :user="user" />
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
  {
    label: 'Dòng thời gian',
    slot: 'log'
  },
  {
    label: 'Địa chỉ IP',
    slot: 'ip'
  },
  {
    label: 'Nạp tiền',
    slot: 'payment'
  },
  {
    label: 'Đơn hàng',
    slot: 'order'
  }
]
</script>