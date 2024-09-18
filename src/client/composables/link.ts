export const useMakeLink = () => {
  const runtimeConfig = useRuntimeConfig()

  function img(link : string) : string {
    const url =  new URL(link || '/images/null.webp', runtimeConfig.public.clientURL)
    return url.href
  }

  function web(link : string) : string {
    const url =  new URL(link, runtimeConfig.public.clientURL)
    return url.href
  }

  return { img, web }
}