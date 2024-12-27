export default defineNuxtPlugin(async () => {
  const { bootConfig } = useConfigStore()
  const { bootCollab } = useCollabStore()
  await bootConfig()
  await bootCollab()
})