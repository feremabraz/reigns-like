import 'zx/globals';

await $`pnpm build:all`;
await $`electron-builder --linux AppImage`;
