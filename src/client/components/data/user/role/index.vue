<template>
  <UiFlex justify="center" class="relative w-full h-[200px]" v-if="!!props.role && !!use && !!role">
    <DataUserRoleWing class="absolute" :source="role.wing" v-if="role.wing"></DataUserRoleWing>
    <DataUserRoleBody class="absolute top-[-50%]" :source="role.body"></DataUserRoleBody>
    <DataUserRolePet class="absolute right-0 bottom-[-15%]" :source="role.pet" v-if="role.pet"></DataUserRolePet>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['role'])
const use = ref(undefined)
const bag = ref(undefined)
const role = ref(undefined)

const getRole = async () => {
  try {
    if(!props.role) throw true
    if(!props.role.use) throw true

    use.value = props.role.use
    bag.value = props.role.bag
    const data = await useAPI('role/public/get', JSON.parse(JSON.stringify(use.value)))
    role.value = data
  }
  catch(e){
    role.value = undefined
  }
}

onMounted(() => setTimeout(getRole, 1))
</script>