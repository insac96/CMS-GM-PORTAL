<template>
	<div>
		<UAlert title="Máy chủ mới nhất" icon="i-bx-party" color="primary" variant="soft" class="mb-4" v-if="!!game.newserver">
			<template #description>
				Khai mở <b>{{ game.newserver.server_name }}</b> vào ngày <b>{{ useDayJs().displayFull(game.newserver.opentime) }}</b>
			</template>

			<template #icon="{ icon }">
				<UiIcon :name="icon" size="10"/>
			</template>
		</UAlert>

		<DataEmpty class="h-[300px]" text="Chưa có tin tức mới" v-if="!game.content" />
		<UiEditorContent :content="game.content" v-else />
	</div>
</template>

<script setup>
const game = useAttrs().game
</script>