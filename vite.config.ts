import { defineConfig } from 'vite';

export default () => {
  return defineConfig({
    server: {
      port: 3000,
      open: true,
      host: 'localhost'
    },
    build: {
      outDir: 'build'
    },
    assetsInclude: ['**/*.xlsx']
  });
};
