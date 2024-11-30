<template>
  <UiFlex justify="center" class="relative w-full h-[200px] select-none pointer-events-none" v-if="!!props.role && !!use && !!role">
    <DataUserRoleViewWing 
      class="absolute top-[-75%]" 
      style="
        background: transparent; 
        transform: scale(0.45);
        transform-origin: top;
      "
      :source="role.wing" v-if="role.wing"
    ></DataUserRoleViewWing>

    <DataUserRoleViewBody 
      class="absolute" 
      style="
        background: transparent; 
        transform: scale(0.5);
        transform-origin: center center;
      "
      :source="role.body" v-if="role.body"
    ></DataUserRoleViewBody>

    <DataUserRoleViewPet 
      class="absolute right-[-10%] bottom-[-15%]" 
      style="
        background: transparent; 
        transform: scale(0.3);
        transform-origin: bottom right;
      " 
      :source="role.pet" v-if="role.pet"
    ></DataUserRoleViewPet>
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