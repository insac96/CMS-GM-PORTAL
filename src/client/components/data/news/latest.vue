<template>
  <UiContent title="News" sub="Cập nhật các tin tức mới nhất" :start="false" class="w-[800px] max-w-full mx-auto" >
    <div class="grid grid-cols-12 gap-4" v-if="!!loading">
      <LoadingNewsBox v-for="i in [1,2]" :key="i" class="md:col-span-6 col-span-12" />
    </div>
    
    <div v-else>
      <DataEmpty icon="i-bx-news" text="Không có tin tức mới" v-if="list.length == 0"></DataEmpty>

      <div class="grid grid-cols-12 gap-4" v-if="list.length > 0">
        <DataNewsBox 
          v-for="(item, index) in list" 
          :key="index" 
          class="md:col-span-4 sm:col-span-6 col-span-12"
          :news="item"
        ></DataNewsBox>
      </div>

      <UiFlex justify="center" class="mt-6" v-if="list.length > 0">
        <NuxtLink to="/main/news">
          <UButton icon="i-bx-news" variant="soft">Xem thêm</UButton>
        </NuxtLink>
      </UiFlex>
    </div>
  </UiContent>
</template>

<script setup>
const loading = ref(true)
const list = ref([])

const getLatest = async () => {
  try {
    const latest = await useAPI('news/public/latest')
    loading.value = false

    list.value = latest
  }
  catch (e) {
    loading.value = false
    list.value = []
  }
}

getLatest()
</script>