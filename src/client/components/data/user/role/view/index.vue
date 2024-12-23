<template>
  <UiFlex justify="center" class="relative w-[250px] h-[250px] mx-auto select-none pointer-events-none" v-if="!!props.role && !!use && !!role">
    <DataUserRoleViewAll :role="role" class="scale-[0.8]"></DataUserRoleViewAll>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['role'])
const use = ref(undefined)
const role = ref(undefined)

const getRole = async () => {
  try {
    if(!props.role) throw true
    if(!props.role.use) throw true

    use.value = props.role.use
    const data = await useAPI('role/public/get', JSON.parse(JSON.stringify(use.value)))
    role.value = data
  }
  catch(e){
    role.value = undefined
  }
}

onMounted(() => setTimeout(getRole, 1))
</script>