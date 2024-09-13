<template>
	<div>
		<div v-if="!authStore.isLogin">
			<DataEmpty text="Vui lòng đăng nhập trước" />
		</div>

		<DataGameToolMail v-else :game="game" />
	</div>
</template>

<script setup>
const authStore = useAuthStore()
const game = useAttrs().game

</script>