<template>
	<div>
		<UiFlex type="col" class="gap-1 mb-4" v-if="!!configStore.config.social.game.private || !!game.newserver || !!game.hasecoin">
			<UAlert title="Hỗ trợ" icon="i-bx-support" color="green" variant="soft" v-if="!!configStore.config.social.game.private">
				<template #description>
					Tham gia <b class="cursor-pointer text-primary underline decoration-1" @click="useTo().openNewTab(configStore.config.social.game.private)">nhóm Zalo Game Private</b> để được hỗ trợ kịp thời
				</template>

				<template #icon="{ icon }">
					<UiIcon :name="icon" size="10"/>
				</template>
			</UAlert>

			<UAlert title="ECoin" icon="i-bxl-bitcoin" color="orange" variant="soft" v-if="!!game.hasecoin">
				<template #description>
					Trò chơi này có thể kiếm được <b class="text-orange decoration-1">ECoin</b> từ các hoạt động
				</template>

				<template #icon="{ icon }">
					<UiIcon :name="icon" size="10"/>
				</template>
			</UAlert>

			<UAlert title="Máy chủ mới nhất" icon="i-bx-party" color="primary" variant="soft" v-if="!!game.newserver">
				<template #description>
					Khai mở <b>{{ game.newserver.server_name }}</b> vào ngày <b>{{ useDayJs().displayFull(game.newserver.opentime) }}</b>
				</template>

				<template #icon="{ icon }">
					<UiIcon :name="icon" size="10"/>
				</template>
			</UAlert>
		</UiFlex>

		<DataGamePrivateGiftcodePublic :game="game" class="mb-4" />

		<DataEmpty class="h-[300px]" text="Chưa có tin tức mới" v-if="!game.content || game.content == '<p></p>'" />
		<UiEditorContent :content="game.content" v-else />
	</div>
</template>

<script setup>
const configStore = useConfigStore()
const game = useAttrs().game
</script>