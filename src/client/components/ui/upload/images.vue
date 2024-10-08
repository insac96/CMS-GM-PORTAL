<template>
  <div>
    <input @change="onFileChange" type="file" accept=".jpg,.jpeg,.png,.webp" ref="input" hidden class="none">

    <UiFlex class="gap-1 flex-wrap">
      <UiFlex 
        v-for="(item, index) in list" :key="index"
        justify="center"
        class="
          h-16 w-16 min-w-16 min-h-16 max-h-16 max-w-16
          bg-gray-200 dark:bg-gray-800
          rounded-lg cursor-pointer overflow-hidden
        "
        @click="onViewFile(item, index)"
      >
        <UiImg :src="item" w="1" h="1" class="w-16 h-16"/>
      </UiFlex>

      <UiFlex 
        justify="center"
        class="
          h-16 w-16 min-w-16 min-h-16 max-h-16 max-w-16
          bg-gray-200 dark:bg-gray-800
          rounded-lg cursor-pointer overflow-hidden
        "
        @click="selectFile"
      >
        <UiIcon name="i-bx-plus" size="8" />
      </UiFlex>
    </UiFlex>

    <UModal v-model="open" fullscreen :ui="{
      fullscreen: 'w-auto h-auto max-w-full max-h-[100vh] !overflow-hidden'
    }">
      <UiFlex justify="center" class="w-full h-full">
        <img :src="imgSelect.src" class="max-h-[90vh] w-auto object-contain rounded-lg"/>
      </UiFlex>

      <UiFlex class="absolute top-1 right-1 gap-0.5">
        <UButton color="red" @click="onDelImage(imgSelect.index)">Xóa</UButton>
        <UButton color="gray" @click="open = false">Đóng</UButton>
      </UiFlex>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const input = ref()
const loading = ref(false)
const open = ref(false)

const list = ref(props.modelValue || [])
const imgSelect = ref({
  src: null,
  index: null
})

const selectFile = () => input.value.click()

const onFileChange = async (e) => {
  try {
    if(!!loading.value) throw 'Vui lòng đợi...'
    loading.value = true

    const files =  e.target.files
    if(files.length == 0) throw 'Vui lòng chọn hình ảnh trước'

    const file = files[0]
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp'
    if(!isImage) throw 'Chỉ hỗ trợ định dạng ảnh (jpg|jpeg|png|webp)'

    const is5M = file.size / 1024 / 1024 < 10
    if (!is5M) throw 'Chỉ hỗ trợ ảnh dung lượng nhỏ hơn 10MB'

    const formData = new FormData()
    formData.append('image', file)

    const url = await useAPI('upload/image', formData)
    loading.value = false

    list.value.push(url)
    emit('update:modelValue', list)
  }
  catch(e) {
    loading.value = false
    useNotify().error(e.toString())
  }
}

const onViewFile = (src, index) => {
  imgSelect.value.src = src
  imgSelect.value.index = index
  open.value = true
}

const onDelImage = (index) => {
  list.value.splice(index, 1)
  open.value = false
}
</script>