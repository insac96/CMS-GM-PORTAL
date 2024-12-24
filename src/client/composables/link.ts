export const useMakeLink = () => {
  const runtimeConfig = useRuntimeConfig()

  function img(link : string) : string {
    const url =  new URL(link || '/images/null.webp', runtimeConfig.public.clientURL)
    return url.href
  }

  function web(link : string) : string {
    const url =  new URL(link, runtimeConfig.public.clientURL)
    return url.href.endsWith('/') ? url.href.slice(0, -1) : url.href;
  }

  return { img, web }
}