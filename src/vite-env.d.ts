/// <reference types="vite/client" />

declare module "*.svg?url" {
  const url: string;
  export default url;
}
declare module "*.mp3?url" {
  const url: string;
  export default url;
}
declare module "*.wav?url" {
  const url: string;
  export default url;
}
declare module "*.png" {
  const url: string;
  export default url;
}
