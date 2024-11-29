<template>
  <UiContent title="Role" sub="Quản lý ngoại hình nhân vật">
    <UTabs v-model="tab" :items="tabs" @change="onTabChange" :content="false" class="block sm:inline-block mb-4"></UTabs>

    <div>
      <NuxtPage />
    </div>
  </UiContent>
</template>

<script setup>
const route = useRoute()

const tabRouter = {
  'manage-@eni-user-role': 0,
  'manage-@eni-user-role-wing': 1,
  'manage-@eni-user-role-pet': 2,
}
const tab = ref(tabRouter[route.name])
const tabs = [{
  label: 'Trang phục',
  to: ''
},{
  label: 'Cánh',
  to: 'wing'
},{
  label: 'Thú cưng',
  to: 'pet'
}]
const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/manage/@eni/user/role/${tabSelect.to}`)
}
</script>