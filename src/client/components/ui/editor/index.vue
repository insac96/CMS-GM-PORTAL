<template>
  <UCard :ui="{ 
    header: { padding: 'py-2 sm:py-2 px-4 sm:px-4'},
    body: { padding: 'p-4 sm:p-4'}
  }">
    <template #header>
      <UiFlex v-if="editor" justify="center" class="gap-1" wrap>
        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().chain().focus().undo().run()"
            color="gray"
            icon="i-bx-undo" square
          />
          <UButton
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().chain().focus().redo().run()"
            color="gray"
            icon="i-bx-redo" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().toggleBold().run()"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            :color="editor.isActive('bold') ? 'primary' : 'gray'"
            icon="i-bx-bold" square
          />

          <UButton
            @click="editor.chain().focus().toggleItalic().run()"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            :color="editor.isActive('italic') ? 'primary' : 'gray'"
            icon="i-bx-italic" square
          />

          <UButton
            @click="editor.chain().focus().toggleStrike().run()"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            :color="editor.isActive('strike') ? 'primary' : 'gray'"
            icon="i-bx-strikethrough" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :color="editor.isActive('heading', { level: 1 }) ? 'primary' : 'gray'"
            square
          >H1</UButton>

          <UButton
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :color="editor.isActive('heading', { level: 2 }) ? 'primary' : 'gray'"
            square
          >H2</UButton>

          <UButton
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :color="editor.isActive('heading', { level: 3 }) ? 'primary' : 'gray'"
            square
          >H3</UButton>
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().toggleBulletList().run()"
            :color="editor.isActive('bulletList') ? 'primary' : 'gray'"
            icon="i-bx-list-ul" square
          />

          <UButton
            @click="editor.chain().focus().toggleOrderedList().run()"
            :color="editor.isActive('orderedList') ? 'primary' : 'gray'"
            icon="i-bx-list-ol" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UButton
            @click="editor.chain().focus().setTextAlign('left').run()"
            :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'gray'"
            icon="i-bx-align-left" square
          />
          <UButton
            @click="editor.chain().focus().setTextAlign('center').run()"
            :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'gray'"
            icon="i-bx-align-middle" square
          />
          <UButton
            @click="editor.chain().focus().setTextAlign('right').run()"
            :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'gray'"
            icon="i-bx-align-right" square
          />
          <UButton
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :color="editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'gray'"
            icon="i-bx-align-left" square
          />
        </UButtonGroup>

        <UButtonGroup>
          <UiUploadImage v-model="image" class="h-[32px]">
            <template #default="{ select }">
              <UButton @click="select" color="gray" icon="i-bx-image" square />
            </template>
          </UiUploadImage>
          
          <UButton @click="addYoutube" color="gray" icon="i-bx-video" square/>
        </UButtonGroup>

        <UButton
          @click="editor.chain().focus().toggleBlockquote().run()"
          icon="i-bx-square-rounded" square
          :color="editor.isActive('blockquote') ? 'primary' : 'gray'"
        />

        <UButton
          @click="editor.chain().focus().setHorizontalRule().run()"
          icon="i-bx-minus" square
          color="gray"
        />
      </UiFlex>
    </template>

    <template #default>
      <TiptapEditorContent :editor="editor" />
    </template>
  </UCard>

</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    TiptapStarterKit, 
    TiptapImage, 
    TiptapYoutube, 
    TiptapTextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    TiptapLink.configure({
      HTMLAttributes: {
        rel: 'noopener noreferrer',
        target: '_blank'
      }, 
      openOnClick: false,
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

const image = ref(null)
watch(() => image.value, (val) => {
  if(!val) return
  editor.value.chain().focus().setImage({ src: val }).run()
  image.value = null
})

const addYoutube = () => {
  const url = window.prompt('Nhập Link Video Youtube')
  if (url) {
    editor.value.commands.setYoutubeVideo({
      src: url,
      width: 640,
      height: 480,
    })
  }
}

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>

<style lang="sass">

</style>