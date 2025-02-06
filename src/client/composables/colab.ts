export const useCollab = () => {
  const runtimeConfig = useRuntimeConfig()

  function getCode() : string | null {
    if(!!runtimeConfig.public.collab) return runtimeConfig.public.collab

    const url = useRequestURL()
    const hostname = url.hostname.split('.')
    const codeCollab = !runtimeConfig.public.dev ? (hostname.length > 2 ? hostname[0] : null) : (hostname.length > 1 ? hostname[0] : null)
    if(!codeCollab) return null
    if(codeCollab == 'play') return null
    return codeCollab
  }

  return { getCode }
}