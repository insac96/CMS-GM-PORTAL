<template>
  <UCard class="cursor-pointer dark:bg-gray-800" :ui="{
    body: { 
      padding: 'p-0 sm:p-0',
    }
  }">
    <UiImg 
      :src="item.icon"
      :img-w="Number(size) * 2"
      :img-h="Number(size) * 2"
      w="1" h="1" 
      class="
        transition-all 
        rounded-2xl 
      "
      :style="{
        minWidth: size ? `${size}px` : null,
        minHeight: size ? `${size}px` : null,
        width: size ? `${size}px` : null,
        height: size ? `${size}px` : null,
        maxWidth: size ? `${size}px` : null,
        maxHeight: size ? `${size}px` : null,
      }"
      @click="modal = true"
    ></UiImg>

    <UModal v-model="modal" :ui="{ width: 'max-w-[300px] sm:max-w-[300px]' }">
      <div class="pb-5">
        <UiFlex justify="center" class="relative w-[250px] h-[250px] mx-auto select-none pointer-events-none mb-4">
          <DataUserRoleViewWing class="w-full" :source="item" v-if="type == 'wing'"></DataUserRoleViewWing>
          <DataUserRoleViewBody class="w-full" :source="item" v-if="type == 'body'" ></DataUserRoleViewBody>
          <DataUserRoleViewPet class="w-full" :source="item" v-if="type == 'pet'"></DataUserRoleViewPet>
        </UiFlex>
        
        <UiFlex type="col" justify="center">
          <UiText size="lg" weight="bold">{{ item.name }}</UiText>
          <UiText size="sm" weight="semibold" color="gray">{{ useMoney().toMoney(item.power) }}</UiText>
          <UButton color="gray" class="mt-5" :loading="loading" :disabled="!!loading" @click="useFashion">Trang Bị</UButton>
        </UiFlex>
      </div>
    </UModal>
  </UCard>
</template>

<script setup>
const props = defineProps({
  item: Object,
  type: String,
  size: { type: [ String, Number, undefined ], default: 55 }
})
const emits = defineEmits(['onUse'])

const modal = ref(false)
const loading = ref(false)

const useFashion = async () => {
  try {
    loading.value = true
    await useAPI('role/public/use', JSON.parse(JSON.stringify({
      _id: props.item._id,
      type: props.type
    })))

    loading.value = false
    emits('onUse', { item: props.item, type: props.type })
    modal.value = false
  }
  catch(e){
    loading.value = false
  }
}
</script>