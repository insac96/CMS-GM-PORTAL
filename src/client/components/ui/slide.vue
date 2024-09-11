<template>
  <div>
    <UCarousel 
      v-if="images"
      v-slot="{ item }" 
      :items="images" 
      :ui="{ item: 'basis-full', container: 'rounded-3xl' }"
      :prev-button="{
        icon: 'i-bx-chevrons-left',
      }"
      :next-button="{
        icon: 'i-bx-chevrons-right',
      }"
      class="rounded-3xl overflow-hidden"
      :arrows="images.length > 1 ? true : false"
      ref="carouselRef"
    >
      <UiFlex class="w-full bg-gray-50 overflow-hidden cursor-pointer" justify="center" style="aspect-ratio: 16 / 9" @click="viewImg(item)">
        <UiImg :src="item" h="100%" />
      </UiFlex>
    </UCarousel>

    <UModal v-model="open" fullscreen :ui="{
      fullscreen: 'w-auto h-auto max-w-full max-h-[100vh]'
    }">
      <UiFlex justify="center" class="w-full h-full">
        <img :src="imgSelect" class="max-h-[90vh] w-auto object-contain"/>
      </UiFlex>

      <UiFlex class="absolute -top-0 -right-0" @click="open = false">
        <UButton :ui="{ rounded: 'rounded-none rounded-l-3xl rounded-b-3xl' }" icon="i-bx-x" ></UButton>
      </UiFlex>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  images: Array,
  auto: {
    type: Boolean,
    default: true
  }
})
const carouselRef = ref()
const open = ref(false)
const imgSelect = ref(false)

const viewImg = (src) => {
  imgSelect.value = src
  open.value = true
}

onMounted(() => {
  if(!props.auto) return

  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 3000)
})
</script>