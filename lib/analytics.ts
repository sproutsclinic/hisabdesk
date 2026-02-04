export const track = (event: string, params?: any) => {
  if (typeof window === "undefined") return

  // @ts-ignore
  window.gtag?.("event", event, params)
}
