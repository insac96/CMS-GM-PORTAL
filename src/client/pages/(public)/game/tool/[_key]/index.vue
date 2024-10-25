<template>
	<div>
		<DataEmpty class="h-[300px]" text="Chưa có tin tức mới" v-if="!game.content" />
		<UiEditorContent :content="game.content" v-else />
	</div>
</template>

<script setup>
const game = useAttrs().game
</script>