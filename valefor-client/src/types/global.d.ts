export {}

declare global {
  interface Window {
    ENV: {
      [key: string]: string
    }
  }
}
