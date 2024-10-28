<template>
  <UiContent title="Diễn Đàn" sub="Trang diễn đàn chính thức">
    <!--Last Post Update-->
    <UiCard class="mb-4">
      <template #header>
        <UiFlex class="gap-1.5">
          <UiIcon name="i-bx-time" />
          <UiText size="xs" weight="semibold">Mới Cập Nhật</UiText>
        </UiFlex>
      </template>

      <DataEmpty text="Chưa có bài viết mới" class="min-h-[300px]" :loading="loading" v-if="posts.length == 0 || !!loading" />
      <DataForumPostList :list="posts" v-else />
    </UiCard>

    <!--Categories-->
    <UiCard>
      <template #header>
        <UiFlex class="gap-1.5">
          <UiIcon name="i-bx-category" />
          <UiText size="xs" weight="semibold">Danh Mục</UiText>
        </UiFlex>
      </template>

      <DataEmpty text="Chưa có danh mục mới" class="min-h-[300px]" :loading="loading" v-if="categories.length == 0 || !!loading" />
      <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
        <UiFlex v-for="(item, i) in categories" :key="i" class="py-4 gap-4">
          <UButton square :icon="item.icon" :color="item.color"></UButton>

          <div class="grow">
            <NuxtLink :to="`/forum/category/${item.key}`">
              <UiText color="primary" weight="bold" class="md:text-base text-sm select-none">{{ item.name }}</UiText>
            </NuxtLink>
            
            <UiText color="gray" class="md:text-sm text-xs select-none">{{ item.description }}</UiText>

            <UiFlex wrap v-if="!!item.subs && item.subs.length > 0" class="gap-4 mt-3 lg:max-w-[30%]">
              <NuxtLink 
                v-for="(sub, iSub) in item.subs" :key="`sub-${iSub}`"
                :to="`/forum/category/${item.key}?sub=${sub.key}`"
              >
                <UiFlex class="gap-1 select-none">
                  <UiIcon name="bx-caret-right"></UiIcon>
                  <UiText weight="semibold" size="xs">{{ sub.name }}</UiText>
                </UiFlex>
              </NuxtLink>
            </UiFlex>
          </div>

          <UiFlex class="divide-x divide-gray-100 dark:divide-gray-800 hidden md:flex select-none">
            <UiFlex type="col" class="px-2">
              <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.posts) }}</UiText>
              <UiText size="xs" color="gray">Chủ đề</UiText>
            </UiFlex>

            <UiFlex type="col" class="px-2">
              <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.views) }}</UiText>
              <UiText size="xs" color="gray">Lượt xem</UiText>
            </UiFlex>

            <UiFlex type="col" class="px-2">
              <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.comments) }}</UiText>
              <UiText size="xs" color="gray">Bình luận</UiText>
            </UiFlex>
          </UiFlex>
        </UiFlex>
      </div>
    </UiCard>
  </UiContent>
</template>

<script setup>
const categories = ref([])
const posts = ref([])
const loading = ref(true)

const getForum = async () => {
  try {
    loading.value = true
    const data = await useAPI('forum/public/get')

    categories.value = data.categories
    posts.value = data.posts
    setTimeout(() => loading.value = false, 1000)
  }
  catch(e){
    loading.value = false
  }
}

getForum()
</script>