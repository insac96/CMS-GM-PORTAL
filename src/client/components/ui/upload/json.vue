<template>
  <div>
    <input @change="onFileChange" type="file" accept=".json" ref="input" hidden class="none">
    <slot :select="selectFile" :loading="loading"></slot>
  </div>
</template>

<script setup>
const toast = useToast()
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const input = ref()
const loading = ref(false)

const selectFile = () => input.value.click()

const onFileChange = async (e) => {
  try {
    loading.value = true

    const files =  e.target.files
    if(files.length == 0) throw 'Vui lòng chọn hình ảnh trước'

    const file = files[0]
    const isJson = file.type === 'application/json'
    if(!isJson) throw 'Chỉ hỗ trợ định dạng file (json)'

    const is5M = file.size / 1024 / 1024 < 10
    if (!is5M) throw 'Chỉ hỗ trợ ảnh dung lượng nhỏ hơn 10MB'

    const formData = new FormData()
    formData.append('json', file)

    const url = await useAPI('upload/json', formData)
    loading.value = false

    emit('update:modelValue', url)
  }
  catch(e) {
    loading.value = false
    toast.add({
      color: 'red',
      title: 'Thông báo',
      description: e.toString(),
      icon: 'i-bx-upload'
    })
  }
}
</script>